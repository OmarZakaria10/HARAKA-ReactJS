import { Button, Label } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import LicenseHeaders from "../../services/licensesHeaders";
import { endPoints } from "../../services/endPoints";

export default function UpdateLicenseForm({
  license,
  onSubmitSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState(license || {});
  const [uniqueValues, setUniqueValues] = useState({});
  const requiredFields = ["serial_number", "plate_number", "license_type"];
  const firstInputRef = useRef(null);

  useEffect(() => {
    async function getUniqueValues() {
      try {
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {LicenseHeaders.map((header, index) => (
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
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
        <Button color="gray" onClick={onCancel} className="w-full sm:w-auto">
          إلغاء
        </Button>
        <Button type="submit" color="blue" className="w-full sm:w-auto">
          تعديل رخصة
        </Button>
      </div>
    </form>
  );
}
