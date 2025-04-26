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

const VehicleGrid = ({ direction = "rtl" }) => {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);
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

  let selectedRows = [];
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
      // checkboxes: false,
      // enableClickSelection: true,
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

  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      selectedRows = gridApi.getSelectedRows();
      console.log("Selected Rows:", selectedRows);
    }
  }, [gridApi]);

  const onHideClick = useCallback(() => {
    if (gridApi) {
      selectedRows = gridApi.getSelectedRows();
      if (selectedRows.length === 0) {
        alert("Please select rows to delete");
        return;
      }
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
  }, [gridApi, rowData]);

  const onDeleteClick = useCallback(() => {
    if (gridApi) {
      selectedRows = gridApi.getSelectedRows();
      if (selectedRows.length === 0) {
        alert("Please select rows to delete");
        return;
      }

      const isConfirmed = window.confirm("Are you sure you want to delete the selected items?");
      if (!isConfirmed) {
        return;
      }

      // Get the IDs of selected rows
      var selectedIds = selectedRows.map((row) => row.id);
      // Call the API to delete the selected vehicles

      selectedIds.forEach((element) => {
        vehicleAPI
          .deleteVehicle(element)
          .then(console.log(`${element} deleted`))
          .catch((err) => {
            console.error("Failed to delete vehicle:", err);
          });
      });

      setRowData((prevRowData) =>
        prevRowData.filter((row) => !selectedIds.includes(row.id))
      );
    }
  }, [gridApi, rowData]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const vehicles = await vehicleAPI.getAllVehicles();
        setRowData(vehicles);
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
        setError(
          "Failed to load vehicles. Please check if the server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const defaultColDef = {
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
    // autoHeight: true,
    // autoWidth: true,
    // editable: true,
    cellStyle: { textAlign: "right" },
    enableCellTextSelection: true,
    copyable: true,
  };

  return (
    <div className="flex flex-col h-screen h-[83vh]">
      <div className="flex justify-between items-center  p-2.5">
        <div className="m-2.5 flex gap-2.5 ">
          <button
            onClick={onExportClick}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
          >
            Export to Excel
          </button>
          <button
            onClick={onHideClick}
            className="px-4 py-2 bg-[rgb(62,112,173)] text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            Hide Selected
          </button>
        </div>
        <div className="m-2.5 flex gap-2.5 ">
          <button
            onClick={onDeleteClick}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
          >
            Delete Selected
          </button>
        </div>
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
          rowDragManaged={true}
          enableCellTextSelection={true}
          autoSizeStrategy={autoSizeStrategy}
          onSelectionChanged={onSelectionChanged}
          paginationPageSize={50}
          pagination={true}
          loadingOverlayComponent={"Loading..."}
          loadingOverlayComponentParams={{
            loadingMessage: "جاري التحميل...",
          }}
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

export default VehicleGrid;
