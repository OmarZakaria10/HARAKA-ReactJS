import { Button, Label } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import Headers from "../../services/vehicleHeaders";
import { endPoints } from "../../services/endPoints";
import PopUp from "../PopUp";
import AddLicenseForm from "./AddLicenseForm";

export default function UpdateVehicleForm({
  vehicle,
  onSubmitSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState(vehicle || {});
  const [uniqueValues, setUniqueValues] = useState({});
  const [showAddLicenseModal, setShowAddLicenseModal] = useState(false);
  const [updatedVehicleData, setUpdatedVehicleData] = useState({});

  const requiredFields = ["code", "chassis_number", "vehicle_type"];
  const firstInputRef = useRef(null);

  useEffect(() => {
    async function getUniqueValues() {
      try {
        const response = await endPoints.getUniqueFieldValues();
        setUniqueValues(response.data);
      } catch (err) {
        console.log("Failed to fetch unique values");
      }
    }
    getUniqueValues();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFieldsValid = requiredFields.every(
      (field) => formData[field]?.trim() !== ""
    );

    if (!requiredFieldsValid) {
      alert("الرجاء ملء الحقول المطلوبة");
      return;
    }

    const processedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value?.trim?.() || value || null,
      ])
    );

    handleUpdateVehicle(processedData);
  };

  const handleUpdateVehicle = async (vehicleData) => {
    try {
      const response = await endPoints.updateVehicle(vehicle.id, vehicleData);
      
      // Check if malaky plate was added during update
      if (!vehicle.plate_number_malaky && vehicleData.plate_number_malaky) {
        setUpdatedVehicleData(response.data.vehicle);
        window.confirm("تم تعديل المركبة بنجاح. سيتم توجيهك لإضافة رخصة.");
        setShowAddLicenseModal(true);
      } else {
        onSubmitSuccess(response.data);
        alert("تم تعديل المركبة بنجاح");
      }
    } catch (err) {
      console.error("Failed to update vehicle:", err);
      alert("فشل في تعديل المركبة");
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
                value={formData[header.field] || ""}
                onChange={(e) => handleChange(header.field, e.target.value)}
                placeholder={header.headerName}
                required={requiredFields.includes(header.field)}
                list={`${header.field}-list`}
                autoComplete="on"
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
          <Button color="gray" onClick={onCancel}>
            إلغاء
          </Button>
          <Button type="submit" color="blue">
            تعديل مركبة
          </Button>
        </div>
      </form>

      {showAddLicenseModal && (
        <PopUp
          AddModal={showAddLicenseModal}
          setAddModal={setShowAddLicenseModal}
          title="إضافة رخصة للمركبة"
          button={false}
        >
          <AddLicenseForm
            initialValues={updatedVehicleData}
            onSubmitSuccess={(data) => {
              setShowAddLicenseModal(false);
              onSubmitSuccess(data);
            }}
            onCancel={() => setShowAddLicenseModal(false)}
          />
        </PopUp>
      )}
    </>
  );
}
