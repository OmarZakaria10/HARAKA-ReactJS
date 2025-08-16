"use client";
import React, { useState, useCallback } from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import privateLicensesHeaders from "../../services/privateLicensesHeaders";
// import { Headers } from "../../services/vehicleHeaders";
// import CustomButton from "../CustomButton";
// import PopUp from "../PopUp";
// import AddLicenseForm from "../forms/AddLicenseForm";
// import UpdateLicenseForm from "../forms/UpdateLicenseForm";
// import AssociatedDataForm from "../forms/AssociatedDataForm";

const PrivateLicensesGrid = ({ direction = "rtl" }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  // const [showAddModal, setShowAddModal] = useState(false);
  // const [showUpdateModal, setShowUpdateModal] = useState(false);
  // const [showAssociatedModal, setShowAssociatedModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleSelectionChange = useCallback((selected) => {
    setSelectedItems([...selected]);
  }, []);

  const handleDelete = useCallback(async () => {
    if (selectedItems.length === 0) {
      alert("الرجاء اختيار التراخيص المراد حذفها");
      return;
    }

    const isConfirmed = window.confirm("هل أنت متأكد من حذف التراخيص المحددة؟");
    if (!isConfirmed) return;

    try {
      await Promise.all(
        selectedItems.map((item) => endPoints.deleteLicense(item.code))
      );
      setSelectedItems([]);
      setUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to delete private licenses:", err);
    }
  }, [selectedItems]);

  const fetchData = useCallback(async () => {
    try {
      const response = await endPoints.getAllLicensesWithVehicles();
      return response.data.licenses || [];
    } catch (error) {
      console.error("Error fetching private licenses:", error);
      throw error;
    }
  }, []);

  const config = {
    headers: privateLicensesHeaders,
    fetchData,
    labels: {
      exportFileName: "تراخيص المرور الملاكي",
      selectToHideMessage: "الرجاء اختيار التراخيص المراد إخفائها",
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
    ></DataGrid>
  );
};

export default PrivateLicensesGrid;
