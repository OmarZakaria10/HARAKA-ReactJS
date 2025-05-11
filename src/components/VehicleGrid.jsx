"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import AssociatedDataForm from "./AssociatedDataForm";
import { AgGridReact } from "ag-grid-react";
import { endPoints } from "../services/endPoints";
import vehicleHeaders from "../services/vehicleHeaders";
import licenseHeaders from "../services/licensesHeaders";
import AddVehicleForm from "./AddVehicleForm";
import UpdateVehicleForm from "./UpdateVehicleForm";
import Button from "./Button";
import PopUp from "./PopUp";
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
  // ------------------------------states------------------------------
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [colDefs] = useState(vehicleHeaders);
  const [AddModal, setAddModal] = useState(false);
  const [UpdateModal, setUpdateModal] = useState(false);
  const [showLicensesModal, setShowLicensesModal] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  // ---------------------------callback functions-----------------------
  const updateGridRef = useRef(0);
  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
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
        fileName: "الميري الشامل.csv",
        processCellCallback: (params) => {
          // Handle Arabic text properly in Excel
          return params.value ? "\uFEFF" + params.value : "";
        },
      };
      gridApi.exportDataAsCsv(params);
    }
  }, [gridApi]);

  const onSelectionChanged = () => {
    if (gridApi) {
      const selected = gridApi.getSelectedRows();
      setSelectedVehicles(selected);
    }
  };

  const onHideClick = useCallback(() => {
    if (gridApi) {
      let selectedRows = gridApi.getSelectedRows();
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
  }, [gridApi]);

  const onDeleteClick = useCallback(() => {
    if (gridApi) {
      let selectedRows = gridApi.getSelectedRows();
      if (selectedRows.length === 0) {
        alert("Please select rows to delete");
        return;
      }
      const isConfirmed = window.confirm(
        "Are you sure you want to delete the selected items?"
      );
      if (!isConfirmed) {
        return;
      }

      // Get the IDs of selected rows
      var selectedIds = selectedRows.map((row) => row.id);
      // Call the API to delete the selected vehicles

      selectedIds.forEach((element) => {
        endPoints
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
  }, [gridApi]);

  // -----------------------------Effect------------------------------
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const vehicles = await endPoints.getAllVehicles();
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
  }, [updateGridRef.current]);

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

  const handleAddSuccess = (newVehicle) => {
    setRowData((prevRowData) => [...prevRowData, newVehicle]);
    setAddModal(false);
    updateGridRef.current += 1;
  };
  const handleUpdateSuccess = (newVehicle) => {
    setRowData((prevRowData) => [...prevRowData, newVehicle]);
    setUpdateModal(false);
    updateGridRef.current += 1;
  };
  // -------------------------UI-------------------------------
  return (
    <div className="flex flex-col h-screen h-[80vh]">
      <div className="flex justify-between items-center  p-2.5">
        <div className="m-2.5 flex gap-2.5 ">
          <Button
            onClick={onExportClick}
            title={"Excel"}
            className={
              "w-20 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-800 transition-colors text-sm"
            }
          />
          <Button
            onClick={onHideClick}
            title={"إخفاء"}
            className={
              "w-20 px-4 py-2 bg-[rgb(173,177,174)] text-white rounded hover:bg-[rgb(87,90,88)] transition-colors text-sm"
            }
          />
        </div>
        <div className="m-2.5 flex gap-2.5  ">
          <Button
            onClick={onDeleteClick}
            title={"حذف"}
            className={
              "w-20 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-800 transition-colors text-sm"
            }
          />
          <PopUp
            AddModal={showLicensesModal}
            setAddModal={setShowLicensesModal}
            title={"معلومات الرخصة"}
            buttonTitle={"عرض الرخص"}
          >
            {selectedVehicles && selectedVehicles.length === 1 ? (
              <AssociatedDataForm vehicle={selectedVehicles[0]} headers={licenseHeaders} />
            ) : (
              <div className="text-xl text-center text-blue-200">
                الرجاء اختيار مركبة واحدة لعرض رخصها
              </div>
            )}
          </PopUp>
          {
            <PopUp
              AddModal={UpdateModal}
              setAddModal={setUpdateModal}
              title={"تعديل عربة جديدة"}
              buttonTitle={"تعديل"}
            >
              {" "}
              {selectedVehicles && selectedVehicles.length == 1 && (
                <UpdateVehicleForm
                  vehicle={selectedVehicles[0]}
                  onSubmitSuccess={handleUpdateSuccess}
                  onCancel={() => setUpdateModal(false)}
                />
              )}
            </PopUp>
          }
          <PopUp
            AddModal={AddModal}
            setAddModal={setAddModal}
            title={" إضافة عربة جديدة"}
            buttonTitle={"إضافة"}
          >
            {
              <AddVehicleForm
                onSubmitSuccess={handleAddSuccess}
                onCancel={() => setAddModal(false)}
              />
            }
          </PopUp>
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

export default VehicleGrid;
