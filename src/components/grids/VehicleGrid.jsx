"use client";
import React, { useState, useCallback } from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import {
  Headers,
  LicensesRoleHeaders,
  GPSRoleHeaders,
} from "../../services/vehicleHeaders";
import licensesHeaders from "../../services/licensesHeaders";
import PopUp from "../PopUp";
import CustomButton from "../CustomButton";
import AddVehicleForm from "../forms/AddVehicleForm";
import UpdateVehicleForm from "../forms/UpdateVehicleForm";
import AssociatedDataForm from "../forms/AssociatedDataForm";

const VehicleGrid = ({ direction = "rtl", user }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAssociatedModal, setShowAssociatedModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Added updateTrigger

  const handleSelectionChange = useCallback(async (selected) => {
    setSelectedItems([...selected]);
  }, []);

  const handleDelete = useCallback(async () => {
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
      console.log(user?.role, "User Role");
      return response;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  }, [user?.role]);

  const config = {
    headers:
      user?.role === "licenses"
        ? LicensesRoleHeaders
        : user?.role === "GPS"
        ? GPSRoleHeaders
        : Headers,
    fetchData,
    labels: {
      exportFileName: "الميري الشامل",
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
      {/* Action Buttons Container */}
      <div className="flex items-center gap-3">
        {/* Add Button */}
        <PopUp
          AddModal={showAddModal}
          setAddModal={setShowAddModal}
          title="إضافة عربة جديدة"
          buttonTitle="إضافة"
          disabled={false}
        >
          <AddVehicleForm
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
          title="تعديل عربة"
          buttonTitle="تعديل"
          disabled={selectedItems.length !== 1}
        >
          {selectedItems.length === 1 && (
            <UpdateVehicleForm
              vehicle={selectedItems[0]}
              onSubmitSuccess={() => {
                setShowUpdateModal(false);
                setUpdateTrigger((prev) => prev + 1);
              }}
              onCancel={() => setShowUpdateModal(false)}
            />
          )}
        </PopUp>

        {/* View Licenses Button */}
        <PopUp
          AddModal={showAssociatedModal}
          setAddModal={setShowAssociatedModal}
          title="معلومات الرخصة"
          buttonTitle="عرض الرخص"
          disabled={selectedItems.length !== 1}
        >
          {selectedItems.length === 1 ? (
            <AssociatedDataForm
              vehicle={selectedItems[0]}
              headers={licensesHeaders}
            />
          ) : (
            <div className="text-xl text-center text-slate-300">
              الرجاء اختيار مركبة واحدة لعرض رخصها
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

export default VehicleGrid;
