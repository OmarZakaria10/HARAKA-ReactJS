import { Button, Label } from "flowbite-react";
import { useRef, useState } from "react";
import LicenseHeaders from "../../services/licensesHeaders";
import { endPoints } from "../../services/endPoints";

export default function UpdateLicenseForm({
  license,
  onSubmitSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState(license || {});
  const requiredFields = ["serial_number", "plate_number", "license_type"];
  const firstInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFieldsValid = requiredFields.every(
      (field) => formData[field] !== ""
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

    handleUpdateLicense(processedData);
  };

  const handleUpdateLicense = async (licenseData) => {
    try {
      const response = await endPoints.updateLicense(license.id, licenseData);
      onSubmitSuccess(response.data);
      alert("تم تعديل الرخصة بنجاح");
    } catch (err) {
      console.error("Failed to update license:", err);
      alert("فشل في تعديل الرخصة");
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
              value={formData[header.field] || ""}
              onChange={(e) => handleChange(header.field, e.target.value)}
              placeholder={header.headerName}
              required={requiredFields.includes(header.field)}
              autoComplete="on"
            />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end gap-4 mt-4">
        <Button color="gray" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" color="blue">
          تعديل رخصة
        </Button>
      </div>
    </form>
  );
}
