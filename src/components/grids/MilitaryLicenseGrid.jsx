"use client";
import React, { useState, useCallback } from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import militaryLicenseHeaders from "../../services/militaryLicensesHeaders";
import CustomButton from "../CustomButton";
import PopUp from "../PopUp";
import AddMilitaryLicenseForm from "../forms/AddMilitaryLIcenseForm";
import UpdateMilitaryLicenseForm from "../forms/UpdateMilitaryLicenseForm";

const MilitaryLicenseGrid = ({ direction = "rtl", user }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleSelectionChange = useCallback((selected) => {
    setSelectedItems([...selected]);
  }, []);

  const handleDelete = useCallback(async () => {
    if (selectedItems.length === 0) {
      alert("الرجاء اختيار الرخص العسكرية المراد حذفها");
      return;
    }

    const isConfirmed = window.confirm(
      "هل أنت متأكد من حذف الرخص العسكرية المحددة؟"
    );
    if (!isConfirmed) return;

    try {
      await Promise.all(
        selectedItems.map((item) => endPoints.deleteMilitaryLicense(item.id))
      );
      setSelectedItems([]);
      setUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to delete military licenses:", err);
    }
  }, [selectedItems]);

  const fetchData = useCallback(async () => {
    try {
      const response = await endPoints.getAllMilitaryLicenses();
      return response.data.militaryLicenses;
    } catch (error) {
      console.error("Error fetching military licenses:", error);
      throw error;
    }
  }, []);

  const config = {
    headers: militaryLicenseHeaders,
    fetchData,
    labels: {
      exportFileName: "كشف الجيش",
      selectToHideMessage: "الرجاء اختيار الرخص العسكرية المراد إخفائها",
    },
    features: {
      hideButton: true,
      export: true,
    },
    updateTrigger,
  };

  return (
    <DataGrid
      direction={direction}
      config={config}
      onSelectionChange={handleSelectionChange}
    >
      <div className="flex items-center gap-3">
        {/* Add Button */}
        <PopUp
          AddModal={showAddModal}
          setAddModal={setShowAddModal}
          title="إضافة رخصة عسكرية جديدة"
          buttonTitle="إضافة"
          disabled={false}
        >
          <AddMilitaryLicenseForm
            onSubmitSuccess={() => {
              setShowAddModal(false);
              setUpdateTrigger((prev) => prev + 1);
            }}
            onCancel={() => setShowAddModal(false)}
          />
        </PopUp>

        {/* Edit Button */}
        <PopUp
          AddModal={showUpdateModal}
          setAddModal={setShowUpdateModal}
          title="تعديل رخصة عسكرية"
          buttonTitle="تعديل"
          disabled={selectedItems.length !== 1}
        >
          {selectedItems.length === 1 && (
            <UpdateMilitaryLicenseForm
              license={selectedItems[0]}
              onSubmitSuccess={() => {
                setShowUpdateModal(false);
                setUpdateTrigger((prev) => prev + 1);
              }}
              onCancel={() => setShowUpdateModal(false)}
            />
          )}
        </PopUp>

        {/* Delete Button */}
        <CustomButton
          onClick={handleDelete}
          disabled={selectedItems.length === 0}
          variant="danger"
        >
          حذف المحدد
        </CustomButton>
      </div>
    </DataGrid>
  );
};

export default MilitaryLicenseGrid;
