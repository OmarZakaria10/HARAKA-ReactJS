"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import AssociatedDataForm from "../forms/AssociatedDataForm";
import { AgGridReact } from "ag-grid-react";
import Button from "../Button";
import PopUp from "../PopUp";
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

const DataGrid = ({
  direction = "rtl",
  config,
}) => {
  const {
    // Data configuration
    headers,
    fetchData,
    deleteData,
    
    // Component configuration
    AddFormComponent,
    UpdateFormComponent,
    
    // Labels and text
    labels,
    
    // Associated data configuration
    associatedDataConfig,
    
    // Feature flags
    features = {
      hideButton: false,
      associatedData: false,
    }
  } = config;

  // ------------------------------states------------------------------
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [colDefs] = useState(headers);
  const [AddModal, setAddModal] = useState(false);
  const [UpdateModal, setUpdateModal] = useState(false);
  const [showAssociatedModal, setShowAssociatedModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

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
        fileName: labels.exportFileName,
        processCellCallback: (params) => {
          return params.value ? "\uFEFF" + params.value : "";
        },
      };
      gridApi.exportDataAsCsv(params);
    }
  }, [gridApi, labels.exportFileName]);

  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      setSelectedItems(gridApi.getSelectedRows());
    }
  }, [gridApi]);

  const onHideClick = useCallback(() => {
    if (gridApi) {
      let selectedRows = gridApi.getSelectedRows();
      if (selectedRows.length === 0) {
        alert(labels.selectToHideMessage || "Please select rows to hide");
        return;
      }
      
      const currentRows = [...rowData];
      const selectedIds = selectedRows.map((row) => row.id);
      const updatedRows = currentRows.filter(
        (row) => !selectedIds.includes(row.id)
      );
      
      setRowData(updatedRows);
    }
  }, [gridApi, rowData, labels.selectToHideMessage]);

  const onDeleteClick = useCallback(() => {
    if (gridApi) {
      let selectedRows = gridApi.getSelectedRows();
      if (selectedRows.length === 0) {
        alert(labels.selectToDeleteMessage);
        return;
      }
      
      const isConfirmed = window.confirm(labels.confirmDeleteMessage);
      if (!isConfirmed) {
        return;
      }

      const selectedIds = selectedRows.map((row) => row.id);
      selectedIds.forEach((id) => {
        deleteData(id)
          .then(() => console.log(`${labels.entityName} ${id} deleted`))
          .catch((err) => {
            console.error(`Failed to delete ${labels.entityName}:`, err);
          });
      });
      
      setRowData((prevRowData) =>
        prevRowData.filter((row) => !selectedIds.includes(row.id))
      );
    }
  }, [gridApi, deleteData, labels]);

  // Handler functions for form submissions
  const handleAddSuccess = (newItem) => {
    setRowData((prevRowData) => [...prevRowData, newItem]);
    setAddModal(false);
    updateGridRef.current += 1;
  };

  const handleUpdateSuccess = (updatedItem) => {
    setRowData((prevRowData) => [...prevRowData, updatedItem]);
    setUpdateModal(false);
    updateGridRef.current += 1;
  };

  // -----------------------------Effect------------------------------
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const items = await fetchData();
        setRowData(items);
      } catch (err) {
        console.error(`Failed to fetch ${labels.entityName}:`, err);
        setError(
          `Failed to load ${labels.entityName}. Please check if the server is running.`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
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
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-2.5">
        {/* Left side buttons */}
        <div className="m-2.5 flex gap-2.5">
          <Button
            onClick={onExportClick}
            title="Excel"
            className="w-20 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-800 transition-colors text-sm"
          />
          {features.hideButton && (
            <Button
              onClick={onHideClick}
              title="إخفاء"
              className="w-20 px-4 py-2 bg-[rgb(173,177,174)] text-white rounded hover:bg-[rgb(87,90,88)] transition-colors text-sm"
            />
          )}
        </div>

        {/* Right side buttons */}
        <div className="m-2.5 flex gap-2.5">
          <Button
            onClick={onDeleteClick}
            title="حذف"
            className="w-20 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-800 transition-colors text-sm"
          />

          {/* Associated data modal */}
          {features.associatedData && (
            <PopUp
              AddModal={showAssociatedModal}
              setAddModal={setShowAssociatedModal}
              title={associatedDataConfig.modalTitle}
              buttonTitle={associatedDataConfig.buttonTitle}
            >
              {selectedItems && selectedItems.length === 1 ? (
                <AssociatedDataForm
                  {...{[associatedDataConfig.propName]: selectedItems[0]}}
                  headers={associatedDataConfig.headers}
                />
              ) : (
                <div className="text-xl text-center text-blue-200">
                  {associatedDataConfig.selectMessage}
                </div>
              )}
            </PopUp>
          )}

          {/* Update modal */}
          <PopUp
            AddModal={UpdateModal}
            setAddModal={setUpdateModal}
            title={labels.updateModalTitle}
            buttonTitle="تعديل"
          >
            {selectedItems && selectedItems.length === 1 && UpdateFormComponent && (
              <UpdateFormComponent
                {...{[labels.propName]: selectedItems[0]}}
                onSubmitSuccess={handleUpdateSuccess}
                onCancel={() => setUpdateModal(false)}
              />
            )}
          </PopUp>

          {/* Add modal */}
          <PopUp
            AddModal={AddModal}
            setAddModal={setAddModal}
            title={labels.addModalTitle}
            buttonTitle="إضافة"
          >
            {AddFormComponent && (
              <AddFormComponent
                onSubmitSuccess={handleAddSuccess}
                onCancel={() => setAddModal(false)}
              />
            )}
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

export default DataGrid;