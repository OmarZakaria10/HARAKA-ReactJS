"use client";
import React, { useState, useCallback } from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import privateLicensesHeaders from "../../services/privateLicensesHeaders";
import CustomButton from "../CustomButton";

const ValidInsuranceStatus = [
  "تم التأمين عليها",
  "لن يتم التأمين عليها",
  "سيتم التأمين عليها",
  "تمت معاينتها",
  "تم الإستبعاد من التأمين",
];

const PrivateLicensesGrid = ({ direction = "rtl" }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [insuranceStatus, setInsuranceStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleSelectionChange = useCallback((selected) => {
    setSelectedItems([...selected]);
  }, []);

  const handleUpdateInsuranceStatus = useCallback(async () => {
    if (!insuranceStatus) {
      alert("الرجاء اختيار حالة التأمين");
      return;
    }

    if (selectedItems.length === 0) {
      alert("الرجاء اختيار المركبات المراد تحديث حالة التأمين لها");
      return;
    }

    setIsUpdating(true);
    try {
      // Extract vehicle IDs from selected vehicles
      const vehicleIds = selectedItems.map(
        (vehicle) => vehicle.vehicle_id || vehicle.id
      );

      const response = await endPoints.updateInsuranceStatus(
        vehicleIds,
        insuranceStatus
      );

      alert(
        `تم تحديث حالة التأمين بنجاح لـ ${response.data.updatedVehicles} مركبة`
      );
      setSelectedItems([]);
      setInsuranceStatus("");
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating insurance status:", error);
      alert(
        error.response?.data?.message ||
          "حدث خطأ أثناء تحديث حالة التأمين. الرجاء المحاولة مرة أخرى."
      );
    } finally {
      setIsUpdating(false);
    }
  }, [selectedItems, insuranceStatus]);

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
    >
      {/* Insurance Status Update Controls */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-blue-200 dark:border-gray-700 bg-[#DFEAFF] dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-300 whitespace-nowrap">
            حالة التأمين:
          </label>
          <select
            value={insuranceStatus}
            onChange={(e) => setInsuranceStatus(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-blue-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent min-w-[200px]"
            disabled={isUpdating}
          >
            <option
              value=""
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              اختر حالة التأمين
            </option>
            {ValidInsuranceStatus.map((status) => (
              <option
                key={status}
                value={status}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        <CustomButton
          onClick={handleUpdateInsuranceStatus}
          disabled={
            selectedItems.length === 0 || !insuranceStatus || isUpdating
          }
          variant="primary"
          size="sm"
        >
          {isUpdating ? "جاري التعديل..." : "تعديل"}
        </CustomButton>

        {selectedItems.length > 0 && (
          <span className="text-xs text-gray-600 dark:text-gray-400">
            ({selectedItems.length} مركبة محددة)
          </span>
        )}
      </div>
    </DataGrid>
  );
};

export default PrivateLicensesGrid;
