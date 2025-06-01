import { Button, Label } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import LicenseHeaders from "../../services/licensesHeaders";
import { endPoints } from "../../services/endPoints";
import { mapVehicleToLicense } from "../../services/licenseMapper";

export default function AddLicenseForm({ 
  initialValues = {},
  onSubmitSuccess,
   onCancel }) {
  const [formData, setFormData] = useState(() => {
    // Create base form data with empty strings
    const baseFormData = Object.fromEntries(
      LicenseHeaders.map((header) => [header.field, ""])
    );
    
    // If we have initialValues, map them using licenseMapper
    if (Object.keys(initialValues).length > 0) {
      const mappedValues = mapVehicleToLicense(initialValues);
      return {
        ...baseFormData,
        ...mappedValues
      };
    }
    return baseFormData;
  });
  const [uniqueValues, setUniqueValues] = useState({});
  const requiredFields = ["serial_number", "plate_number", "license_type"];
  const firstInputRef = useRef(null);

  useEffect(() => {
    async function getUniqueValues() {
      try {
        console.log(formData)
        const response = await endPoints.getLicenseUniqueFieldValues();
        setUniqueValues(response.data);
      } catch (error) {
        console.log(error);
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

    handleAddLicense(processedData);
  };

   const handleAddLicense = async (licenseData) => {
    try {
      // Ensure all required data is present
      const dataToSubmit = {
        ...licenseData,
        vehicleId: initialValues.id,
        // Add default dates if not provided
        license_start_date: licenseData.license_start_date || new Date().toISOString().split('T')[0],
        license_end_date: licenseData.license_end_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      };

      console.log("Adding license with data:", dataToSubmit);
      const response = await endPoints.createLicense(dataToSubmit);
      console.log("License added successfully:", response);
      onSubmitSuccess(response.data);
      alert("تمت إضافة الرخصة بنجاح");
    } catch (err) {
      console.error("Failed to add license:", err);
      alert("فشل في إضافة الرخصة");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LicenseHeaders.map((header, index) => (
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
      <div className="w-full flex justify-end gap-4 mt-4">
        <Button color="gray" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" color="blue">
          إضافة رخصة
        </Button>
      </div>
    </form>
  );
}
