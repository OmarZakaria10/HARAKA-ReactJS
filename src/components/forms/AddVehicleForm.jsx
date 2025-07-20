import { Button, Label } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Headers } from "../../services/vehicleHeaders";
import { endPoints } from "../../services/endPoints";
import PopUp from "../PopUp";
import AddLicenseForm from "./AddLicenseForm";
export default function VehicleForm({ onSubmitSuccess, onCancel }) {
  const [formData, setFormData] = useState(
    Object.fromEntries(Headers.map((header) => [header.field, ""]))
  );
  const [uniqueValues, setUniqueValues] = useState({});
  const [showAddLicenseModal, setShowAddLicenseModal] = useState(false);
  const [isMalaky, setIsMalaky] = useState(false);
  const [vehicleData, setVehicleData] = useState({});
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
        value.trim() === "" ? null : value.trim(),
      ])
    );

    handleAddVehicle(processedData);
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      const response = await endPoints.createVehicle(vehicleData);
      // onSubmitSuccess(response.data);
      console.log("Vehicle added successfully:", response.data.vehicle);
      window.confirm("تمت إضافة المركبة بنجاح");

      // Check plate_number_malaky directly and show modal if it exists
      if (response.data.vehicle.plate_number_malaky) {
        setVehicleData(response.data.vehicle);
        setShowAddLicenseModal(true);
      } else onSubmitSuccess(response.data);
    } catch (err) {
      console.error("Failed to add vehicle:", err);
      alert("فشل في إضافة المركبة");
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
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Headers.map((header, index) => (
            <div key={header.field} className="space-y-2">
              <div className="block text-right">
                <Label
                  htmlFor={header.field}
                  className="text-sm sm:text-base font-medium"
                >
                  {header.headerName}
                  {requiredFields.includes(header.field) && (
                    <span className="text-red-500 mr-1">*</span>
                  )}
                </Label>
              </div>
              <input
                className="input-field text-sm sm:text-base"
                dir="rtl"
                id={header.field}
                ref={index === 0 ? firstInputRef : null}
                value={formData[header.field]}
                onChange={(e) => handleChange(header.field, e.target.value)}
                placeholder={header.headerName}
                required={requiredFields.includes(header.field)}
                list={`${header.field}-list`}
                autoComplete="on"
                autoFocus={index === 0}
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
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
          <Button color="gray" onClick={onCancel} className="w-full sm:w-auto">
            إلغاء
          </Button>
          <Button type="submit" color="blue" className="w-full sm:w-auto">
            إضافة مركبة
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
            initialValues={vehicleData}
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
