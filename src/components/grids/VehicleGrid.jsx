"use client";
import React, { useState, useCallback } from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import vehicleHeaders from "../../services/vehicleHeaders";
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

  const handleSelectionChange = useCallback((selected) => {
    setSelectedItems(selected);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedItems.length === 0) {
      alert("الرجاء اختيار المركبات المراد حذفها");
      return;
    }

    const isConfirmed = window.confirm("هل أنت متأكد من حذف المركبات المحددة؟");
    if (!isConfirmed) return;

    selectedItems.forEach((item) => {
      endPoints
        .deleteVehicle(item.id)
        .then(() => console.log(`Vehicle ${item.id} deleted`))
        .catch((err) => console.error("Failed to delete vehicle:", err));
    });
  }, [selectedItems]);

  const config = {
    headers: vehicleHeaders,
    fetchData: () => endPoints.getAllVehicles(),
    labels: {
      exportFileName: "الميري الشامل.csv",
      selectToHideMessage: "الرجاء اختيار المركبات المراد إخفائها",
    },
    features: {
      hideButton: true,
      export: true,
    },
  };

  return (
    <DataGrid
      direction={direction}
      config={config}
      onSelectionChange={handleSelectionChange}
    >
      <Button
        onClick={handleDelete}
        title="حذف"
        className="w-20 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-800 transition-colors text-sm"
      />

      <PopUp
        AddModal={showAssociatedModal}
        setAddModal={setShowAssociatedModal}
        title="معلومات الرخصة"
        buttonTitle="عرض الرخص"
      >
        {selectedItems.length === 1 ? (
          <AssociatedDataForm
            vehicle={selectedItems[0]}
            headers={vehicleHeaders}
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
            onSubmitSuccess={() => setShowUpdateModal(false)}
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
          onSubmitSuccess={() => setShowAddModal(false)}
          onCancel={() => setShowAddModal(false)}
        />
      </PopUp>
    </DataGrid>
  );
};

export default VehicleGrid;
