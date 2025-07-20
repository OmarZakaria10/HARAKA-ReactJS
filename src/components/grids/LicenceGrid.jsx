"use client";
import React, { useState, useCallback } from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import licensesHeaders from "../../services/licensesHeaders";
import { Headers } from "../../services/vehicleHeaders";
import CustomButton from "../CustomButton";
import PopUp from "../PopUp";
import AddLicenseForm from "../forms/AddLicenseForm";
import UpdateLicenseForm from "../forms/UpdateLicenseForm";
import AssociatedDataForm from "../forms/AssociatedDataForm";

const LicensesGrid = ({ direction = "rtl" }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAssociatedModal, setShowAssociatedModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleSelectionChange = useCallback((selected) => {
    setSelectedItems([...selected]);
  }, []);

  const handleDelete = useCallback(async () => {
    if (selectedItems.length === 0) {
      alert("الرجاء اختيار الرخص المراد حذفها");
      return;
    }

    const isConfirmed = window.confirm("هل أنت متأكد من حذف الرخص المحددة؟");
    if (!isConfirmed) return;

    try {
      await Promise.all(
        selectedItems.map((item) => endPoints.deleteLicense(item.id))
      );
      setSelectedItems([]);
      setUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to delete licenses:", err);
    }
  }, [selectedItems]);

  const fetchData = useCallback(async () => {
    try {
      const response = await endPoints.getAllLicenses();
      return response;
    } catch (error) {
      console.error("Error fetching licenses:", error);
      throw error;
    }
  }, []);

  const config = {
    headers: licensesHeaders,
    fetchData,
    labels: {
      exportFileName: "رخص العربات.csv",
      selectToHideMessage: "الرجاء اختيار الرخص المراد إخفائها",
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
          title="إضافة رخصة جديدة"
          buttonTitle="إضافة"
          disabled={false}
        >
          <AddLicenseForm
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
          title="تعديل رخصة"
          buttonTitle="تعديل"
          disabled={selectedItems.length !== 1}
        >
          {selectedItems.length === 1 && (
            <UpdateLicenseForm
              license={selectedItems[0]}
              onSubmitSuccess={() => {
                setShowUpdateModal(false);
                setUpdateTrigger((prev) => prev + 1);
              }}
              onCancel={() => setShowUpdateModal(false)}
            />
          )}
        </PopUp>

        {/* View Vehicle Button */}
        <PopUp
          AddModal={showAssociatedModal}
          setAddModal={setShowAssociatedModal}
          title="معلومات المركبة"
          buttonTitle="عرض المركبة"
          disabled={selectedItems.length !== 1}
        >
          {selectedItems.length === 1 ? (
            <AssociatedDataForm license={selectedItems[0]} headers={Headers} />
          ) : (
            <div className="text-xl text-center text-slate-300">
              الرجاء اختيار رخصة واحدة لعرض مركبتها
            </div>
          )}
        </PopUp>

        {/* Delete Button */}
        <CustomButton
          onClick={handleDelete}
          disabled={selectedItems.length === 0}
          variant="danger"
          size="sm"
        >
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          حذف المحدد
        </CustomButton>
      </div>
    </DataGrid>
  );
};

export default LicensesGrid;
