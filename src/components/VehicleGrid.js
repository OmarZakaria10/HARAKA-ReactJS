"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { vehicleAPI } from "../services/api";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const VehicleGrid = () => {
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
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [colDefs] = useState([
    { field: "code", headerName: "الكود", rowDrag: true },
    { field: "chassis_number", headerName: "رقم الشاسية" },
    { field: "vehicle_type", headerName: "نوع المركبة" },
    { field: "vehicle_equipment", headerName: "تجهيزة المركبة" },
    { field: "plate_number_mokhabrat", headerName: "مخابرات" },
    { field: "plate_number_gesh", headerName: "جيش" },
    { field: "plate_number_malaky", headerName: "ملاكي" },
    { field: "engine_number", headerName: "رقم المحرك" },
    { field: "color", headerName: "اللون" },
    { field: "gps_device_number", headerName: "رقم GPS" },
    { field: "line_number", headerName: "رقم الخط" },
    { field: "sector", headerName: "القطاع" },
    { field: "model_year", headerName: "الموديل" },
    { field: "fuel_type", headerName: "نوع الوقود" },
    { field: "administration", headerName: "الإدارة" },
    { field: "responsible_person", headerName: "المسئول" },
    { field: "supply_source", headerName: "جهة التوريد" },
    { field: "notes", headerName: "الملاحظات" },
  ]);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };
  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitCellContents",
    };
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);
  const onExportClick = useCallback(() => {
    if (gridApi) {
      const params = {
        fileName: "الميري الشامل.xlsx",
        processCellCallback: (params) => {
          // Handle Arabic text properly in Excel
          return params.value ? "\uFEFF" + params.value : "";
        },
      };
      gridApi.exportDataAsCsv(params);
    }
  }, [gridApi]);

  const onDeleteClick = useCallback(() => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      if (selectedRows.length === 0) {
        alert("Please select rows to delete");
        return;
      }

      if (
        window.confirm(
          `Are you sure you want to delete ${selectedRows.length} rows?`
        )
      ) {
        // Get all current rows
        const currentRows = [...rowData];
        // Get the IDs of selected rows
        const selectedIds = selectedRows.map((row) => row.id);
        // Filter out the selected rows
        const updatedRows = currentRows.filter(
          (row) => !selectedIds.includes(row.id)
        );
        // Update the grid with the filtered rows
        setRowData(updatedRows);
      }
    }
  }, [gridApi, rowData]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicles = await vehicleAPI.getAllVehicles();
        setRowData(vehicles);
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
        setError(
          "Failed to load vehicles. Please check if the server is running."
        );
      }
    };

    fetchVehicles();
  }, []);

  const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    exportable: true,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "90vh" }}>
      <div style={{ margin: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={onExportClick}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Export to Excel
        </button>
        <button
          onClick={onDeleteClick}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Delete Selected
        </button>
      </div>
      <div style={{ flex: 1, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          theme={myTheme}
          animateRows={true}
          onGridReady={onGridReady}
          autoSizeStrategy={autoSizeStrategy}
          rowSelection={rowSelection}
          rowDragManaged={true}
          enableCellTextSelection={true}

        />
      </div>
    </div>
  );
};

export default VehicleGrid;
