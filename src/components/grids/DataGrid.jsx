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
import { generateExcel } from '../../services/fileGenerator';
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
      console.log(colDefs);
      console.log(rowData);
    }
  }, [gridApi, onSelectionChange]);




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
    const handleExcelExport = useCallback(async () => {
        if (gridApi) {
            try {
                const visibleColumns = gridApi.getColumns()
                    .filter(col => col.isVisible())
                    .map(col => ({
                        field: col.getColId(),
                        headerName: col.getColDef().headerName
                    }));

                const rowData = [];
                gridApi.forEachNodeAfterFilter(node => {
                    if (node.data) rowData.push(node.data);
                });

                const buffer = await generateExcel(visibleColumns, rowData, labels.exportFileName);
                
                // Create blob and download
                const blob = new Blob([buffer], { 
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${labels.exportFileName || 'export'}.xlsx`;
                link.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Excel export failed:', error);
                alert('فشل تصدير ملف Excel');
            }
        }
    }, [gridApi, labels.exportFileName]);

 
  // Data fetching
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await fetchData();
        setRowData(items);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {

        if (gridApi) {
          gridApi.sizeColumnsToFit();
        }
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
      exportable: true,
      resizable: true,
      minWidth: 100,
      cellStyle: { textAlign: "right" },
      enableCellTextSelection: true,
      copyable: true,
    }),
    []
  );

  // Render
  return (
    <div className="flex flex-col  h-[80vh]">
      <div className="flex justify-between h-[4vh] items-center p-2.5">
        {/* Left side buttons */}
        <div className="m-2.5 flex gap-2.5">
          {features.export && (
            <>

              <Button
                onClick={handleExcelExport}
                title="Excel"
                className="w-20 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-800 transition-colors text-sm"
              />

            </>
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

      <div className="flex-1 w-full h-[50vh] p-2.5">
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          theme={myTheme}
          animateRows={true}
          onGridReady={onGridReady}
          enableRtl={direction === "rtl"}
          rowSelection={rowSelection}
          rowDragManaged={true}
          enableCellTextSelection={true}
          autoSizeStrategy={autoSizeStrategy}
          onSelectionChanged={onSelectionChanged}
          paginationPageSize={500}
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
