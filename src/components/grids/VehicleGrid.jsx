"use client";
import React from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import vehicleHeaders from "../../services/vehicleHeaders";
import licenseHeaders from "../../services/licensesHeaders";
import AddVehicleForm from "../forms/AddVehicleForm";
import UpdateVehicleForm from "../forms/UpdateVehicleForm";

const VehicleGrid = ({ direction = "rtl" }) => {
  const vehicleGridConfig = {
    // Data configuration
    headers: vehicleHeaders,
    fetchData: () => endPoints.getAllVehicles(),
    deleteData: (id) => endPoints.deleteVehicle(id),
    
    // Component configuration
    AddFormComponent: AddVehicleForm,
    UpdateFormComponent: UpdateVehicleForm,
    
    // Labels and text
    labels: {
      entityName: "vehicle",
      propName: "vehicle",
      exportFileName: "الميري الشامل.csv",
      selectToDeleteMessage: "الرجاء اختيار المركبات المراد حذفها",
      selectToHideMessage: "Please select rows to hide",
      confirmDeleteMessage: "هل أنت متأكد من حذف المركبات المحددة؟",
      addModalTitle: "إضافة عربة جديدة",
      updateModalTitle: "تعديل عربة جديدة",
    },
    
    // Associated data configuration
    associatedDataConfig: {
      modalTitle: "معلومات الرخصة",
      buttonTitle: "عرض الرخص",
      propName: "vehicle",
      headers: licenseHeaders,
      selectMessage: "الرجاء اختيار مركبة واحدة لعرض رخصها",
    },
    
    // Feature flags
    features: {
      hideButton: true,
      associatedData: true,
    }
  };

  return <DataGrid direction={direction} config={vehicleGridConfig} />;
};

export default VehicleGrid;