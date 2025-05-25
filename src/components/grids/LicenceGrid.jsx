"use client";
import React, { useState, useCallback } from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import licensesHeaders from "../../services/licensesHeaders";
import vehicleHeaders from "../../services/vehicleHeaders";
import Button from "../Button";
import PopUp from "../PopUp";
import AddLicenseForm from "../forms/AddLicenseForm";
import UpdateLicenseForm from "../forms/UpdateLicenseForm";
import AssociatedDataForm from "../forms/AssociatedDataForm";
import DatePicker from "../DatePicker";
const LicensesGrid = ({ direction = "rtl" }) => {
  // States for managing popups and selections
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAssociatedModal, setShowAssociatedModal] = useState(false);
  const handleSelectionChange = useCallback((selected) => {
    setSelectedItems(selected);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedItems.length === 0) {
      alert("الرجاء اختيار الرخص المراد حذفها");
      return;
    }

    const isConfirmed = window.confirm("هل أنت متأكد من حذف الرخص المحددة؟");
    if (!isConfirmed) return;

    selectedItems.forEach((item) => {
      endPoints
        .deleteLicense(item.id)
        .then(() => console.log(`License ${item.id} deleted`))
        .catch((err) => console.error("Failed to delete license:", err));
    });
  }, [selectedItems]);

  const config = {
    headers: licensesHeaders,
    fetchData: () => endPoints.getAllLicenses(),
    labels: {
      exportFileName: "رخص العربات.csv",
      selectToHideMessage: "الرجاء اختيار الرخص المراد إخفائها",
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
        className="w-20 h-10 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-800 transition-colors text-sm"
      />

      <PopUp
        AddModal={showAssociatedModal}
        setAddModal={setShowAssociatedModal}
        title="معلومات المركبة"
        buttonTitle="عرض المركبة"
      >
        {selectedItems.length === 1 ? (
          <AssociatedDataForm
            license={selectedItems[0]}
            headers={vehicleHeaders}
          />
        ) : (
          <div className="text-xl text-center text-blue-200">
            الرجاء اختيار رخصة واحدة لعرض مركبتها
          </div>
        )}
      </PopUp>

      <PopUp
        AddModal={showUpdateModal}
        setAddModal={setShowUpdateModal}
        title="تعديل رخصة"
        buttonTitle="تعديل"
      >
        {selectedItems.length === 1 && (
          <UpdateLicenseForm
            license={selectedItems[0]}
            onSubmitSuccess={() => setShowUpdateModal(false)}
            onCancel={() => setShowUpdateModal(false)}
          />
        )}
      </PopUp>

      <PopUp
        AddModal={showAddModal}
        setAddModal={setShowAddModal}
        title="إضافة رخصة جديدة"
        buttonTitle="إضافة"
      >
        <AddLicenseForm
          onSubmitSuccess={() => setShowAddModal(false)}
          onCancel={() => setShowAddModal(false)}
        />
      </PopUp>
    </DataGrid>
  );
};

export default LicensesGrid;
