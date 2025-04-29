"use client";
import Headers from "../services/gridHeaders";
import { vehicleAPI } from "../services/api";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { useCallback, useRef, useState } from "react";

export default function PopUp({ setRowData }) {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(
    Object.fromEntries(Headers.map((header) => [header.field, ""]))
  );

  const requiredFields = ["code", "chassis_number", "vehicle_type"];

  const firstInputRef = useRef(null);
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
      <Button onClick={() => setOpenModal(true)}>إضافة</Button>
      <Modal
        show={openModal}
        size="4xl"
        popup
        onClose={() => setOpenModal(false)}
        initialFocus={firstInputRef}
      >
        <ModalHeader />
        <ModalBody dir="rtl">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-right">
              إضافة مركبة جديدة
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
                    <TextInput
                      className="text-right"
                      dir="rtl"
                      id={header.field}
                      ref={index === 0 ? firstInputRef : null}
                      value={formData[header.field]}
                      onChange={(e) =>
                        handleChange(header.field, e.target.value)
                      }
                      placeholder={header.headerName}
                      required={requiredFields.includes(header.field)}
                    />
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
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
