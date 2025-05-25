"use client";
import React from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import licensesHeaders from "../../services/licensesHeaders";
import vehicleHeaders from "../../services/vehicleHeaders";
import AddLicenseForm from "../forms/AddLicenseForm";
import UpdateLicenseForm from "../forms/UpdateLicenseForm";


const LicensesGrid = ({ direction = "rtl" }) => {
  const licensesGridConfig = {
    // Data configuration
    headers: licensesHeaders,
    fetchData: () => endPoints.getAllLicenses(),
    deleteData: (id) => endPoints.deleteLicense(id),
    
    // Component configuration
    AddFormComponent: AddLicenseForm,
    UpdateFormComponent: UpdateLicenseForm,
    
    // Labels and text
    labels: {
      entityName: "license",
      propName: "license",
      exportFileName: "رخص العربات.csv",
      selectToDeleteMessage: "الرجاء اختيار الرخص المراد حذفها",
      confirmDeleteMessage: "هل أنت متأكد من حذف الرخص المحددة؟",
      addModalTitle: "إضافة رخصة جديدة",
      updateModalTitle: "تعديل رخصة",
    },
    
    // Associated data configuration
    associatedDataConfig: {
      modalTitle: "معلومات المركبة",
      buttonTitle: "عرض المركبة",
      propName: "license",
      headers: vehicleHeaders,
      selectMessage: "الرجاء اختيار رخصة واحدة لعرض مركبتها",
    },
    
    // Feature flags
    features: {
      hideButton: true,
      associatedData: true,
    }
  };

  return <DataGrid direction={direction} config={licensesGridConfig} />;
};

export default LicensesGrid;