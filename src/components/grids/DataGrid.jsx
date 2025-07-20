"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState({ current: 0, total: 0 });
  const searchInputRef = useRef(null);
  const containerRef = useRef(null);

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

  // Search functionality
  const performSearch = useCallback((term, direction = 'next') => {
    if (!gridApi || !term) {
      setSearchResults({ current: 0, total: 0 });
      // Clear any existing highlights
      gridApi?.refreshCells();
      return;
    }

    const matchingCells = [];
    const searchLower = term.toLowerCase();

    gridApi.forEachNodeAfterFilter(node => {
      if (node.data) {
        const columns = gridApi.getColumns();
        columns.forEach(column => {
          const colId = column.getColId();
          if (colId !== 'rowIndex' && node.data[colId]) {
            const cellValue = node.data[colId].toString().toLowerCase();
            if (cellValue.includes(searchLower)) {
              matchingCells.push({
                node: node,
                column: column,
                colId: colId,
                rowIndex: node.rowIndex
              });
            }
          }
        });
      }
    });

    if (matchingCells.length === 0) {
      setSearchResults({ current: 0, total: 0 });
      gridApi.refreshCells();
      return;
    }

    let currentIndex = searchResults.current;
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % matchingCells.length;
    } else if (direction === 'previous') {
      currentIndex = currentIndex <= 0 ? matchingCells.length - 1 : currentIndex - 1;
    } else {
      currentIndex = 0; // First search
    }

    const targetCell = matchingCells[currentIndex];
    if (targetCell) {
      gridApi.ensureIndexVisible(targetCell.rowIndex);
      gridApi.setFocusedCell(targetCell.rowIndex, targetCell.colId);
      
      // Refresh cells to update highlighting
      gridApi.refreshCells();
    }

    setSearchResults({
      current: currentIndex,
      total: matchingCells.length,
      matchingCells: matchingCells,
      currentCell: targetCell
    });
  }, [gridApi, searchResults.current]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    // Only clear results if search term is empty
    if (term.trim().length === 0) {
      setSearchResults({ current: 0, total: 0 });
      if (gridApi) {
        gridApi.refreshCells();
      }
    }
  }, [gridApi]);

  const executeSearch = useCallback(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim(), 'first');
    }
  }, [searchTerm, performSearch]);

  const handleSearchNext = useCallback(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim(), 'next');
    }
  }, [searchTerm, performSearch]);

  const handleSearchPrevious = useCallback(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim(), 'previous');
    }
  }, [searchTerm, performSearch]);

  const closeSearch = useCallback(() => {
    setShowSearch(false);
    setSearchTerm("");
    setSearchResults({ current: 0, total: 0 });
    if (gridApi) {
      gridApi.refreshCells();
    }
  }, [gridApi]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+F or Cmd+F to open search
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        event.stopPropagation();
        setShowSearch(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
      
      // Escape to close search
      if (event.key === 'Escape' && showSearch) {
        closeSearch();
      }
      
      // Enter to search or navigate
      if (event.key === 'Enter' && showSearch) {
        event.preventDefault();
        if (searchResults.total === 0) {
          // First search
          executeSearch();
        } else {
          // Navigate through results
          if (event.shiftKey) {
            handleSearchPrevious();
          } else {
            handleSearchNext();
          }
        }
      }
    };

    // Add event listener to document to capture global Ctrl+F
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, searchTerm, searchResults.total, executeSearch, handleSearchNext, handleSearchPrevious, closeSearch]);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      // Cleanup function
    };
  }, []);

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
    cellStyle: (params) => {
      const style = { textAlign: "right" };
      
      // Highlight matching cells
      if (searchTerm && searchResults.matchingCells) {
        const isCurrentCell = searchResults.currentCell && 
          searchResults.currentCell.rowIndex === params.node.rowIndex &&
          searchResults.currentCell.colId === params.colDef.field;
        
        const isMatchingCell = searchResults.matchingCells.some(cell => 
          cell.rowIndex === params.node.rowIndex && 
          cell.colId === params.colDef.field
        );
        
        if (isCurrentCell) {
          style.backgroundColor = "#3b82f6"; // Blue for current match
          style.color = "white";
        } else if (isMatchingCell) {
          style.backgroundColor = "#fbbf24"; // Yellow for other matches
          style.color = "black";
        }
      }
      
      return style;
    },
    editable: true,
    enableCellTextSelection: true,
    copyable: true,
  }), [searchTerm, searchResults]);

  const rowSelection = useMemo(() => ({
    mode: "multiRow",
  }), []);

  return (
    <div className="flex flex-col h-[77vh] relative" ref={containerRef} tabIndex={0}>
      <div className="flex justify-between h-[4vh] items-center p-2.5">
        <div className="m-2.5 flex gap-2.5 items-center">
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
          
          {/* Search Bar positioned beside left buttons */}
          {showSearch && (
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-lg flex items-center gap-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={labels.searchPlaceholder || "البحث..."}
                className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500 w-32"
              />
              <button
                onClick={executeSearch}
                disabled={!searchTerm.trim()}
                className="px-2 py-1 bg-green-600 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-green-700 text-sm"
                title="بحث"
              >
                🔍
              </button>
              <button
                onClick={handleSearchPrevious}
                disabled={searchResults.total === 0}
                className="px-2 py-1 bg-blue-600 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 text-sm"
                title="السابق"
              >
                ↑
              </button>
              <button
                onClick={handleSearchNext}
                disabled={searchResults.total === 0}
                className="px-2 py-1 bg-blue-600 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 text-sm"
                title="التالي"
              >
                ↓
              </button>
              <span className="text-white text-sm min-w-[40px]">
                {searchResults.total > 0 ? `${searchResults.current + 1}/${searchResults.total}` : '0/0'}
              </span>
              <button
                onClick={closeSearch}
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                title="إغلاق"
              >
                ×
              </button>
            </div>
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