"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { AgGridReact } from "ag-grid-react";
import Button from "../Button";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);
const myTheme = themeQuartz.withParams({
  backgroundColor: "#1f2836",
  browserColorScheme: "dark",
  chromeBackgroundColor: {
    ref: "foregroundColor",
    mix: 0.07,
    onto: "backgroundColor",
  },
  foregroundColor: "#FFF",
  headerFontSize: 14,
});

const DataGrid = ({
  direction = "rtl",
  config,
  children,
  onSelectionChange,
}) => {
  const {
    headers,
    fetchData,
    labels = {},
    features = {
      hideButton: false,
      export: true,
    },
    updateTrigger = 0,
  } = config;

  // States
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [colDefs] = useState(headers);

  // Grid setup functions
  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const autoSizeStrategy = useMemo(
    () => ({
      type: "fitCellContents",
    }),
    []
  );

  const rowSelection = useMemo(
    () => ({
      mode: "multiRow",
    }),
    []
  );

  // Grid event handlers
  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      onSelectionChange?.(selectedRows);
    }
  }, [gridApi, onSelectionChange]);

  const onExportClick = useCallback(() => {
    if (gridApi) {
      const params = {
        fileName: labels.exportFileName || "export.csv",
        processCellCallback: (params) => {
          return params.value ? "\uFEFF" + params.value : "";
        },
      };
      gridApi.exportDataAsCsv(params);
    }
  }, [gridApi, labels.exportFileName]);

  const onHideClick = useCallback(() => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      if (selectedRows.length === 0) {
        alert(labels.selectToHideMessage || "Please select rows to hide");
        return;
      }

      const selectedIds = selectedRows.map((row) => row.id);
      setRowData((prevRowData) =>
        prevRowData.filter((row) => !selectedIds.includes(row.id))
      );
    }
  }, [gridApi, labels.selectToHideMessage]);

  // Data fetching
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await fetchData();
        setRowData(items);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchItems();
  }, [fetchData, updateTrigger]);

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ["reset", "apply"],
        closeOnApply: true,
      },
      resizable: true,
      minWidth: 100,
      cellStyle: { textAlign: "right" },
    }),
    []
  );

  // Render
  return (
    /* h-[42.5rem] to fit 1280 x 1024 5:4 resolution container */
    <div className="flex flex-col h-[42.5rem]">
      <div className="flex justify-between items-center p-2.5">
        {/* Left side buttons */}
        <div className="m-2.5 flex gap-2.5">
          {features.export && (
            <Button
              onClick={onExportClick}
              title="Excel"
              className="w-20 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-800 transition-colors text-sm"
            />
          )}
          {features.hideButton && (
            <Button
              onClick={onHideClick}
              title="إخفاء"
              className="w-20 px-4 py-2 bg-[rgb(173,177,174)] text-white rounded hover:bg-[rgb(87,90,88)] transition-colors text-sm"
            />
          )}
        </div>

        {/* Right side buttons/components */}
        <div className="m-2.5 flex gap-2.5">{children}</div>
      </div>

      <div className="flex-1 w-full p-2.5">
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          theme={myTheme}
          animateRows={true}
          onGridReady={onGridReady}
          enableRtl={direction === "rtl"}
          rowSelection={rowSelection}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          autoSizeStrategy={autoSizeStrategy}
          onSelectionChanged={onSelectionChanged}
          paginationPageSize={100}
          pagination={true}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">جاري التحميل...</span>'
          }
          overlayNoRowsTemplate={
            '<span class="ag-overlay-no-rows-center">لا توجد بيانات</span>'
          }
        />
      </div>
    </div>
  );
};

export default DataGrid;
