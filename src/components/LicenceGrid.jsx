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
import Button from "./Button";
import licensesHeaders from "../services/licensesHeaders";
import vehicleHeaders from "../services/vehicleHeaders";
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

const LicensesGrid = ({ direction = "rtl" }) => {
  // ------------------------------states------------------------------
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVehiclesModal, setShowVehiclesModal] = useState(false);
  // const [AddModal, setAddModal] = useState(false);
  // const [UpdateModal, setUpdateModal] = useState(false);
  const [selectedLicenses, setSelectedLicenses] = useState(null);

  // Define column headers for licenses
  const [colDefs] = useState(licensesHeaders);

  // ---------------------------callback functions-----------------------
  const updateGridRef = useRef(0);

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
        fileName: "رخص العربات.csv",
        processCellCallback: (params) => {
          return params.value ? "\uFEFF" + params.value : "";
        },
      };
      gridApi.exportDataAsCsv(params);
    }
  }, [gridApi]);

  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      setSelectedLicenses(gridApi.getSelectedRows());
    }
  }, [gridApi]);

  const onDeleteClick = useCallback(() => {
    if (gridApi) {
      let selectedRows = gridApi.getSelectedRows();
      if (selectedRows.length === 0) {
        alert("الرجاء اختيار الرخص المراد حذفها");
        return;
      }
      const isConfirmed = window.confirm("هل أنت متأكد من حذف الرخص المحددة؟");
      if (!isConfirmed) {
        return;
      }

      const selectedIds = selectedRows.map((row) => row.id);
      selectedIds.forEach((id) => {
        endPoints
          .deleteLicense(id)
          .then(console.log(`License ${id} deleted`))
          .catch((err) => {
            console.error("Failed to delete license:", err);
          });
      });
      setRowData((prevRowData) =>
        prevRowData.filter((row) => !selectedIds.includes(row.id))
      );
    }
  }, [gridApi]);

  // -----------------------------Effect------------------------------
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true);
        const licenses = await endPoints.getAllLicenses();
        console.log("licenses", licenses);
        setRowData(licenses);
      } catch (err) {
        console.error("Failed to fetch licenses:", err);
        setError(
          "Failed to load licenses. Please check if the server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
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

  // -------------------------UI-------------------------------
  return (
    <div className="flex flex-col h-screen ">
      <div className="flex justify-between items-center p-2.5">
        <div className="m-2.5 flex gap-2.5">
          <Button
            onClick={onExportClick}
            title={"Excel"}
            className="w-20 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-800 transition-colors text-sm"
          />
        </div>
        <div className="m-2.5 flex gap-2.5">
          <Button
            onClick={onDeleteClick}
            title={"حذف"}
            className="w-20 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-800 transition-colors text-sm"
          />
          <PopUp
            AddModal={showVehiclesModal}
            setAddModal={setShowVehiclesModal}
            title={"معلومات المركبة"}
            buttonTitle={"عرض المركبة"}
          >
            {selectedLicenses && selectedLicenses.length === 1 ? (
              <AssociatedDataForm license={selectedLicenses[0]} headers={vehicleHeaders}  />
            ) : (
              <div className="text-xl text-center font-medium text-blue-200">
                الرجاء اختيار رخصة واحدة لعرض مركبتها
              </div>
            )}
          </PopUp>
          {

          }
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

export default LicensesGrid;
