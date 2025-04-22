"use client";
import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { vehicleAPI } from "../services/api";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  iconSetQuartzBold,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);


// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz
	.withPart(iconSetQuartzBold)
	.withParams({
        accentColor: "#FFCC00",
        backgroundColor: "#FBF1C7",
        borderColor: "#282828",
        browserColorScheme: "light",
        cellTextColor: "#282828",
        chromeBackgroundColor: "#EBDBB2",
        columnBorder: false,
        fontFamily: [
            "Arial",
            "sans-serif"
        ],
        foregroundColor: "#B57614",
        headerFontSize: 14,
        headerRowBorder: true,
        headerTextColor: "#FFFFFF",
        headerVerticalPaddingScale: 1.4,
        headerBackgroundColor: "#928374",
        oddRowBackgroundColor: "#F2E5BC",
        spacing: 10
    });



const VehicleGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [colDefs] = useState([
    { field: "code", headerName: "الكود" },
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

  const onExportClick = useCallback(() => {
    if (gridApi) {
      const params = {
        fileName: "vehicles_export.csv",
        processCellCallback: (params) => {
          // Handle Arabic text properly in Excel
          return params.value ? "\uFEFF" + params.value : "";
        },
      };
      gridApi.exportDataAsCsv(params);
    }
  }, [gridApi]);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ margin: '10px' }}>
        <button 
          onClick={onExportClick}
          style={{
            padding: '8px 16px',
            backgroundColor: '#F2E5BC',
            color: '#282828',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          تصدير إلى CSV
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
        />
      </div>
    </div>
  );
};

export default VehicleGrid;
