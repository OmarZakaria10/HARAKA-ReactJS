"use client";
import Headers from "../services/gridHeaders";
import { vehicleAPI } from "../services/api";
import Button from "./Button";
import { Label } from "flowbite-react";
import { useState, useEffect, useRef } from "react";

export default function VehicleForm({
  openModal,
  setOpenModal,
  setRowData,
  title,
  firstInputRef,
}) {
  const [uniqueValues, setUniqueValues] = useState({});
  const [formData, setFormData] = useState(
    Object.fromEntries(Headers.map((header) => [header.field, ""]))
  );

  useEffect(() => {
    if (openModal) {
      fetchUniqueValues();
      // Reset form data when modal opens
      setFormData(
        Object.fromEntries(Headers.map((header) => [header.field, ""]))
      );
    }
  }, [openModal]);

  const fetchUniqueValues = async () => {
    try {
      const response = await vehicleAPI.getUniqueFieldValues();
      setUniqueValues(response.data);
    } catch (err) {
      console.error("Failed to fetch unique values:", err);
    }
  };

  const requiredFields = ["code", "chassis_number", "vehicle_type"];
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check only required fields
    const requiredFieldsValid = requiredFields.every(
      (field) => formData[field]?.trim() !== ""
    );

    if (!requiredFieldsValid) {
      alert("الرجاء ملء الحقول المطلوبة");
      return;
    }

    // Convert empty strings to null for all fields
    const processedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.trim() === "" ? null : value.trim(),
      ])
    );

    handleAddVehicle(processedData);
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      const response = await vehicleAPI.createVehicle(vehicleData);
      setRowData((prevRowData) => [...prevRowData, response.data]);
      setOpenModal(false);
      alert("تمت إضافة المركبة بنجاح");
    } catch (err) {
      console.error("Failed to add vehicle:", err);
      alert("فشل في إضافة المركبة");
      // setOpenModal(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
    <>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white text-right">
        {title}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Headers.map((header, index) => (
            <div key={header.field}>
              <div className="mb-2 block text-right">
                <Label htmlFor={header.field}>
                  {header.headerName}
                  {requiredFields.includes(header.field) && (
                    <span className="text-red-500 mr-1">*</span>
                  )}
                </Label>
              </div>
              <input
                className="w-full text-right rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                dir="rtl"
                id={header.field}
                ref={index === 0 ? firstInputRef : null}
                value={formData[header.field]}
                onChange={(e) => handleChange(header.field, e.target.value)}
                placeholder={header.headerName}
                required={requiredFields.includes(header.field)}
                list={`${header.field}-list`}
                autoComplete="on"
                // autoFocus={index === 0}
              />
              {uniqueValues[header.field] && (
                <datalist id={`${header.field}-list`}>
                  {uniqueValues[header.field].map((value, i) => (
                    <option key={i} value={value} />
                  ))}
                </datalist>
              )}
            </div>
          ))}
        </div>
        <div className="w-full flex justify-end gap-4 mt-4">
          <Button color="gray" onClick={() => setOpenModal(false)}>
            إلغاء
          </Button>
          <Button type="submit" color="blue">
            إضافة مركبة
          </Button>
        </div>
      </form>
    </>
  );
}
