"use client";
import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { vehicleAPI } from "../services/api";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import AddButton from "./AddButton";
import UpdateButton from "./UpdateButton";
import DeleteButton from "./DeleteButton";

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
  headerVerticalPaddingScale: 1.4,
});

const mockVehicles = [
  {
    code: "V001",
    chassis_number: "CH123456",
    vehicle_type: "سيارة نقل",
    vehicle_equipment: "رافعة",
    plate_number_mokhabrat: "1234",
    plate_number_gesh: "5678",
    plate_number_malaky: "9101",
    engine_number: "EN987654",
    color: "أحمر",
    gps_device_number: "GPS001",
    line_number: "LN01",
    sector: "قطاع 1",
    model_year: "2020",
    fuel_type: "بنزين",
    administration: "إدارة النقل",
    responsible_person: "أحمد علي",
    supply_source: "شركة X",
    notes: "بدون ملاحظات"
  },
  {
    code: "V002",
    chassis_number: "CH654321",
    vehicle_type: "أتوبيس",
    vehicle_equipment: "مكيف",
    plate_number_mokhabrat: "4321",
    plate_number_gesh: "8765",
    plate_number_malaky: "1019",
    engine_number: "EN123456",
    color: "أزرق",
    gps_device_number: "GPS002",
    line_number: "LN02",
    sector: "قطاع 2",
    model_year: "2022",
    fuel_type: "سولار",
    administration: "إدارة التشغيل",
    responsible_person: "محمد حسن",
    supply_source: "شركة Y",
    notes: "يحتاج صيانة"
  }
];

const VehicleGrid = () => {
  const [rowData, setRowData] = useState(mockVehicles);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
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

  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      const selected = gridApi.getSelectedRows();
      setSelectedRows(selected);
      selected.forEach((row, idx) => {
        console.log(`Selected row [${idx}]:`, row);
      });
    }
  }, [gridApi]);

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

    // Uncomment the next line to fetch from API instead of using mock data
    // fetchVehicles();
  }, []);

  const handleUpdateSubmit = async (updatedRows) => {
    try {
      // Update each vehicle in the backend
      //await Promise.all(
        //updatedRows.map(row =>
         // vehicleAPI.updateVehicle(row._id || row.code, row)
        //)
      //);
      // Optionally, refresh data from API
      // const vehicles = await vehicleAPI.getAllVehicles();
      // setRowData(vehicles);

      // Or update rowData locally for demo:
      setRowData(prev =>
        prev.map(item =>
          updatedRows.find(u => (u._id || u.code) === (item._id || item.code)) || item
        )
      );
    } catch (err) {
      alert("فشل تحديث البيانات");
      console.error(err);
    }
  };

  const handleDelete = async (rowsToDelete) => {
    try {
      // Uncomment for real API:
      // await Promise.all(
      //   rowsToDelete.map(row =>
      //     vehicleAPI.deleteVehicle(row._id || row.code)
      //   )
      // );
      // Optionally, refresh data from API
      // const vehicles = await vehicleAPI.getAllVehicles();
      // setRowData(vehicles);

      // Or update rowData locally for demo:
      setRowData(prev =>
        prev.filter(item =>
          !rowsToDelete.some(r => (r._id || r.code) === (item._id || item.code))
        )
      );
    } catch (err) {
      alert("فشل حذف البيانات");
      console.error(err);
    }
  };

  const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    exportable: true,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ margin: '10px', display: 'flex', alignItems: 'center' }}>
        <AddButton
          onSubmit={(vehicle) => {
            // You can later call vehicleAPI.createVehicle(vehicle) here
            // For now, just log or update state as needed
            console.log("New vehicle submitted:", vehicle);
          }}
        />
        <UpdateButton
          selectedRows={selectedRows}
          onSubmit={handleUpdateSubmit}
        />
        <DeleteButton
          selectedRows={selectedRows}
          onDelete={handleDelete}
        />
        <button 
          onClick={onExportClick}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
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
          rowSelection="multiple"
          suppressRowClickSelection={false}
          suppressRowDeselection={false}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </div>
  );
};

export default VehicleGrid;
