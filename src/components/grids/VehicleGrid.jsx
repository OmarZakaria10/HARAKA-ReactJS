"use client";
import React, { useState, useCallback } from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import vehicleHeaders from "../../services/vehicleHeaders";
import licensesHeaders from "../../services/licensesHeaders";
import Button from "../Button";
import PopUp from "../PopUp";
import AddVehicleForm from "../forms/AddVehicleForm";
import UpdateVehicleForm from "../forms/UpdateVehicleForm";
import AssociatedDataForm from "../forms/AssociatedDataForm";

const VehicleGrid = ({ direction = "rtl" }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAssociatedModal, setShowAssociatedModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Added updateTrigger

  const handleSelectionChange = useCallback((selected) => {
    setSelectedItems([...selected]); // Changed to create new array
  }, []);

  const handleDelete = useCallback(async () => { // Changed to async/await
    if (selectedItems.length === 0) {
      alert("الرجاء اختيار المركبات المراد حذفها");
      return;
    }

    const isConfirmed = window.confirm("هل أنت متأكد من حذف المركبات المحددة؟");
    if (!isConfirmed) return;

    try {
      await Promise.all(
        selectedItems.map((item) => endPoints.deleteVehicle(item.id))
      );
      setSelectedItems([]); // Clear selection after deletion
      setUpdateTrigger((prev) => prev + 1); // Trigger refresh
    } catch (err) {
      console.error("Failed to delete vehicles:", err);
    }
  }, [selectedItems]);

  const fetchData = useCallback(async () => {
    try {
      const response = await endPoints.getAllVehicles();
      return response;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  }, []);

  const config = {
    headers: vehicleHeaders,
    fetchData,
    labels: {
      exportFileName: "الميري الشامل.csv",
      selectToHideMessage: "الرجاء اختيار المركبات المراد إخفائها",
    },
    features: {
      hideButton: true,
      export: true,
    },
    updateTrigger, // Added updateTrigger to config
  };

  return (
    <DataGrid
      direction={direction}
      config={config}
      onSelectionChange={handleSelectionChange}
    >
      <div className="flex items-center gap-2.5">

        <Button
          onClick={handleDelete}
          title="حذف"
          className="w-20 h-10 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-800 transition-colors text-sm"
          disabled={selectedItems.length === 0}
        />
    
      </div>

      <PopUp
        AddModal={showAssociatedModal}
        setAddModal={setShowAssociatedModal}
        title="معلومات الرخصة"
        buttonTitle="عرض الرخص"
      >
        {selectedItems.length === 1 ? (
          <AssociatedDataForm
            vehicle={selectedItems[0]}
            headers={licensesHeaders}
          />
        ) : (
          <div className="text-xl text-center text-blue-200">
            الرجاء اختيار مركبة واحدة لعرض رخصها
          </div>
        )}
      </PopUp>

      <PopUp
        AddModal={showUpdateModal}
        setAddModal={setShowUpdateModal}
        title="تعديل عربة"
        buttonTitle="تعديل"
      >
        {selectedItems.length === 1 && (
          <UpdateVehicleForm
            vehicle={selectedItems[0]}
            onSubmitSuccess={() => {
              setShowUpdateModal(false);
              setUpdateTrigger((prev) => prev + 1); // Added update trigger
            }}
            onCancel={() => setShowUpdateModal(false)}
          />
        )}
      </PopUp>

      <PopUp
        AddModal={showAddModal}
        setAddModal={setShowAddModal}
        title="إضافة عربة جديدة"
        buttonTitle="إضافة"
      >
        <AddVehicleForm
          onSubmitSuccess={() => {
            setShowAddModal(false);
            setUpdateTrigger((prev) => prev + 1); // Added update trigger
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </PopUp>
    </DataGrid>
  );
};

export default VehicleGrid;