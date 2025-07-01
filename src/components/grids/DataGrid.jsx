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
import { generateExcel } from '../../services/excelGenerator';

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

  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  // Create column definitions with index column
  const columnDefs = useMemo(() => {
    const indexColumn = {
      headerName: "",
      field: "rowIndex",
      pinned: "right", // Pin to right for RTL layout
      sortable: false,
      filter: false,
      resizable: true,
      editable: false,
      cellStyle: { 
        textAlign: "center", 
        fontWeight: "bold",
        backgroundColor: "#2a3441"
      },
      valueGetter: (params) => {
        return params.node.rowIndex + 1;
      }
    };

    return [indexColumn, ...headers];
  }, [headers]);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setTimeout(() => {
      const allColumnIds = params.api.getColumns()?.map(column => column.getColId()) || [];
      if (allColumnIds.length > 0) {
        params.api.autoSizeColumns(allColumnIds);
      }
    }, 100);
  }, []);

  const autoSizeStrategy = useMemo(() => ({
    type: "fitCellContents",
  }), []);

  const autoSizeAllColumns = useCallback(() => {
    if (gridApi) {
      const allColumnIds = gridApi.getColumns()?.map(column => column.getColId()) || [];
      if (allColumnIds.length > 0) {
        gridApi.autoSizeColumns(allColumnIds);
      }
    }
  }, [gridApi]);

  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      onSelectionChange?.(selectedRows);
    }
  }, [gridApi, onSelectionChange]);

  const onHideClick = useCallback(() => {
    if (!gridApi) return;
    
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert(labels.selectToHideMessage || "Please select rows to hide");
      return;
    }

    const selectedIds = selectedRows.map((row) => row.id);
    setRowData((prevData) => {
      const newData = prevData.filter((row) => !selectedIds.includes(row.id));
      // Auto-size columns after hiding rows
      setTimeout(() => autoSizeAllColumns(), 50);
      return newData;
    });
  }, [gridApi, labels.selectToHideMessage, autoSizeAllColumns]);

  const handleExcelExport = useCallback(async () => {
    if (!gridApi) return;
    
    try {
      // Include index column in export
      const indexColumn = {
        field: "rowIndex",
        headerName: "م"
      };

      const visibleColumns = [
        indexColumn,
        ...gridApi.getColumns()
          .filter(col => col.isVisible() && col.getColId() !== 'rowIndex') // Exclude the grid's index column to avoid duplication
          .map(col => ({
            field: col.getColId(),
            headerName: col.getColDef().headerName
          }))
      ];

      const exportData = [];
      let rowIndex = 1;
      gridApi.forEachNodeAfterFilter(node => {
        if (node.data) {
          exportData.push({
            rowIndex: rowIndex++,
            ...node.data
          });
        }
      });

      const buffer = await generateExcel(visibleColumns, exportData, labels.exportFileName);
      
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${labels.exportFileName || 'export'}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('فشل تصدير ملف Excel');
    }
  }, [gridApi, labels.exportFileName]);

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

  // Auto-size columns when data loads
  useEffect(() => {
    if (rowData.length > 0) {
      setTimeout(() => autoSizeAllColumns(), 100);
    }
  }, [rowData, autoSizeAllColumns]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["reset", "apply"],
      closeOnApply: true,
    },
    resizable: true,
    minWidth: 20,
    cellStyle: { textAlign: "right" },
    editable: true,
    enableCellTextSelection: true,
    copyable: true,
  }), []);

  const rowSelection = useMemo(() => ({
    mode: "multiRow",
  }), []);

  return (
    <div className="flex flex-col h-[77vh]">
      <div className="flex justify-between h-[4vh] items-center p-2.5">
        <div className="m-2.5 flex gap-2.5">
          {features.export && (
            <Button
              onClick={handleExcelExport}
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
        <div className="m-2.5 flex gap-2.5">{children}</div>
      </div>

      <div className="flex-1 w-full h-[50vh] p-2.5">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          theme={myTheme}
          onGridReady={onGridReady}
          enableRtl={direction === "rtl"}
          rowSelection={rowSelection}
          onSelectionChanged={onSelectionChanged}
          autoSizeStrategy={autoSizeStrategy}
          animateRows={true}
          enableCellTextSelection={true}
          pagination={true}
          paginationPageSize={500}
          overlayLoadingTemplate='<span class="ag-overlay-loading-center">جاري التحميل...</span>'
          overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">لا توجد بيانات</span>'
        />
      </div>
    </div>
  );
};

export default DataGrid;