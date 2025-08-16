"use client";
import  { useState, useCallback } from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import licensesHeaders from "../../services/licensesHeaders";
import {Headers} from "../../services/vehicleHeaders";
// import Button from "../Button";
import PopUp from "../PopUp";
import AssociatedDataForm from "../forms/AssociatedDataForm";
import DatePicker from "../DatePicker";

const ExpiredLicensesGrid = ({ direction = "rtl" }) => {
  // States for managing popups and selections
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showAssociatedModal, setShowAssociatedModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleSelectionChange = useCallback((selected) => {
    setSelectedItems(selected);
  }, []);

  const handleDateChange = useCallback(async (date) => {
    setSelectedDate(date);
    setUpdateTrigger((prev) => prev + 1); // Trigger grid refresh
  }, []);

  const fetchData = useCallback(async () => {
    try {
      if (!selectedDate) {
        // If no date is selected, get all expired licenses
        const response = await endPoints.getExpiredLicenses();
        return response.data.licenses;
      }
      // Get licenses expiring by the selected date
      const response = await endPoints.getExpiringLicenses(selectedDate);
      return response.data.licenses;
    } catch (error) {
      console.error("Error fetching licenses:", error);
      throw error;
    }
  }, [selectedDate]);

  const config = {
    headers: licensesHeaders,
    fetchData,
    labels: {
      exportFileName: "الرخص المنتهية",
      selectToHideMessage: "الرجاء اختيار الرخص المراد إخفائها",
    },
    features: {
      hideButton: true,
      export: true,
    },
    updateTrigger, // Pass the trigger to force grid updates
  };

  return (
    <DataGrid
      direction={direction}
      config={config}
      onSelectionChange={handleSelectionChange}
    >
      <div className="flex items-center gap-4">
        <DatePicker
          label="تاريخ الإنتهاء"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-32"
        />
      </div>

      <PopUp
        AddModal={showAssociatedModal}
        setAddModal={setShowAssociatedModal}
        title="معلومات المركبة"
        buttonTitle="عرض المركبة"
      >
        {selectedItems.length === 1 ? (
          <AssociatedDataForm
            license={selectedItems[0]}
            headers={Headers}
          />
        ) : (
          <div className="text-xl text-center text-blue-200">
            الرجاء اختيار رخصة واحدة لعرض مركبتها
          </div>
        )}
      </PopUp>
    </DataGrid>
  );
};

export default ExpiredLicensesGrid;
