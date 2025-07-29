"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { AgGridReact } from "ag-grid-react";
import CustomButton from "../CustomButton";
import LoadingWave from "../LoadingWave";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { generateExcel } from "../../services/excelGenerator";

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
  const [searchResults, setSearchResults] = useState({ current: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
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
        backgroundColor: "#2a3441",
      },
      valueGetter: (params) => {
        return params.node.rowIndex + 1;
      },
    };

    return [indexColumn, ...headers];
  }, [headers]);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setTimeout(() => {
      const allColumnIds =
        params.api.getColumns()?.map((column) => column.getColId()) || [];
      if (allColumnIds.length > 0) {
        params.api.autoSizeColumns(allColumnIds);
      }
    }, 100);
  }, []);

  const autoSizeStrategy = useMemo(
    () => ({
      type: "fitCellContents",
    }),
    []
  );

  const autoSizeAllColumns = useCallback(() => {
    if (gridApi) {
      const allColumnIds =
        gridApi.getColumns()?.map((column) => column.getColId()) || [];
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
        headerName: "م",
      };

      const visibleColumns = [
        indexColumn,
        ...gridApi
          .getColumns()
          .filter((col) => col.isVisible() && col.getColId() !== "rowIndex") // Exclude the grid's index column to avoid duplication
          .map((col) => ({
            field: col.getColId(),
            headerName: col.getColDef().headerName,
          })),
      ];

      const exportData = [];
      let rowIndex = 1;
      gridApi.forEachNodeAfterFilter((node) => {
        if (node.data) {
          exportData.push({
            rowIndex: rowIndex++,
            ...node.data,
          });
        }
      });

      const buffer = await generateExcel(
        visibleColumns,
        exportData,
        labels.exportFileName
      );

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${labels.exportFileName || "export"}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("فشل تصدير ملف Excel");
    }
  }, [gridApi, labels.exportFileName]);

  // Search functionality
  const performSearch = useCallback(
    (term, direction = "next") => {
      if (!gridApi || !term) {
        setSearchResults({ current: 0, total: 0 });
        // Clear any existing highlights
        gridApi?.refreshCells();
        return;
      }

      const matchingCells = [];
      const searchLower = term.toLowerCase();

      gridApi.forEachNodeAfterFilter((node) => {
        if (node.data) {
          const columns = gridApi.getColumns();
          columns.forEach((column) => {
            const colId = column.getColId();
            if (colId !== "rowIndex" && node.data[colId]) {
              const cellValue = node.data[colId].toString().toLowerCase();
              if (cellValue.includes(searchLower)) {
                matchingCells.push({
                  node: node,
                  column: column,
                  colId: colId,
                  rowIndex: node.rowIndex,
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
      if (direction === "next") {
        currentIndex = (currentIndex + 1) % matchingCells.length;
      } else if (direction === "previous") {
        currentIndex =
          currentIndex <= 0 ? matchingCells.length - 1 : currentIndex - 1;
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
        currentCell: targetCell,
      });
    },
    [gridApi, searchResults]
  );

  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      // Only clear results if search term is empty
      if (term.trim().length === 0) {
        setSearchResults({ current: 0, total: 0 });
        if (gridApi) {
          gridApi.refreshCells();
        }
      }
    },
    [gridApi]
  );

  // Manually execute search
  const executeSearch = useCallback(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim(), "first");
    }
  }, [searchTerm, performSearch]);

  // Clear search when term is empty
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({ current: 0, total: 0 });
      if (gridApi) {
        gridApi.refreshCells();
      }
    }
  }, [searchTerm, gridApi]);

  const handleSearchNext = useCallback(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim(), "next");
    }
  }, [searchTerm, performSearch]);

  const handleSearchPrevious = useCallback(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim(), "previous");
    }
  }, [searchTerm, performSearch]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+F or Cmd+F to focus search input - prevent default browser search
      if ((event.ctrlKey || event.metaKey) && event.key === "f") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        searchInputRef.current?.focus();
        searchInputRef.current?.select(); // Select all text for better UX
        return false; // Additional prevention
      }

      // Enter to execute search when search input is focused
      if (
        event.key === "Enter" &&
        document.activeElement === searchInputRef.current
      ) {
        event.preventDefault();
        executeSearch();
      }

      // Arrow keys to navigate search results when search input is focused
      if (
        searchResults.total > 0 &&
        document.activeElement === searchInputRef.current
      ) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          handleSearchNext();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          handleSearchPrevious();
        }
      }
    };

    // Add event listener to document to capture global Ctrl+F with high priority
    document.addEventListener("keydown", handleKeyDown, {
      capture: true,
      passive: false,
    });

    // Also add to window for extra coverage
    window.addEventListener("keydown", handleKeyDown, {
      capture: true,
      passive: false,
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown, {
        capture: true,
        passive: false,
      });
      window.removeEventListener("keydown", handleKeyDown, {
        capture: true,
        passive: false,
      });
    };
  }, [
    executeSearch,
    handleSearchNext,
    handleSearchPrevious,
    searchResults.total,
  ]);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const items = await fetchData();
        setRowData(items);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
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

  const defaultColDef = useMemo(
    () => ({
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
          const isCurrentCell =
            searchResults.currentCell &&
            searchResults.currentCell.rowIndex === params.node.rowIndex &&
            searchResults.currentCell.colId === params.colDef.field;

          const isMatchingCell = searchResults.matchingCells.some(
            (cell) =>
              cell.rowIndex === params.node.rowIndex &&
              cell.colId === params.colDef.field
          );

          if (isCurrentCell) {
            style.backgroundColor = "#0E9F6E"; // Green for current match
            style.color = "white";
          } else if (isMatchingCell) {
            style.backgroundColor = "#1C64F2"; // Theme blue for other matches
            style.color = "white";
          }
        }

        return style;
      },
      editable: true,
      enableCellTextSelection: true,
      copyable: true,
    }),
    [searchTerm, searchResults]
  );

  const rowSelection = useMemo(
    () => ({
      mode: "multiRow",
    }),
    []
  );

  return (
    <div
      className="flex flex-col h-[calc(100vh-120px)] bg-slate-50 dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700"
      ref={containerRef}
      tabIndex={0}
    >
      {/* Enhanced Modern Toolbar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 rounded-t-xl">
        <div className="flex justify-between items-center px-6 py-4">
          {/* Left side - Action Buttons */}
          <div className="flex items-center gap-3">
            {features.export && (
              <CustomButton
                onClick={handleExcelExport}
                variant="success"
                size="sm"
              >
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                تصدير Excel
              </CustomButton>
            )}

            {features.hideButton && (
              <CustomButton onClick={onHideClick} variant="secondary" size="sm">
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
                إخفاء المحدد
              </CustomButton>
            )}
          </div>

          {/* Center - Search Input */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={labels.searchPlaceholder || "البحث في الجدول..."}
                className="w-64 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1C64F2] focus:border-transparent transition-all duration-200"
                dir="rtl"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    executeSearch();
                  }
                }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Search Navigation - Only show when there are results */}
            {searchResults.total > 0 && (
              <>
                <div className="flex border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                  <button
                    onClick={handleSearchPrevious}
                    disabled={searchResults.total === 0}
                    className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed transition-all duration-200 text-slate-700 dark:text-slate-300"
                    title="السابق"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleSearchNext}
                    disabled={searchResults.total === 0}
                    className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed transition-all duration-200 text-slate-700 dark:text-slate-300"
                    title="التالي"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="px-2 py-1.5 bg-slate-200 dark:bg-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 min-w-[50px] text-center">
                  {searchResults.total > 0
                    ? `${searchResults.current + 1}/${searchResults.total}`
                    : "0/0"}
                </div>
              </>
            )}
          </div>

          {/* Right side - Additional Controls */}
          <div className="flex items-center gap-3">{children}</div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="flex-1 w-full relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <LoadingWave
                size="md"
                color="#1C64F2"
                message="جاري تحميل البيانات..."
              />
            </div>
          </div>
        )}

        <div className="h-full bg-white dark:bg-slate-900">
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
    </div>
  );
};

export default DataGrid;
