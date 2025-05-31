import { Button, Label } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import Headers from "../../services/vehicleHeaders";
import LicenseHeaders from "../../services/licensesHeaders";
import { endPoints } from "../../services/endPoints";

export default function AddVehicleForm({ onSubmitSuccess, onCancel }) {
  const [formData, setFormData] = useState(
    Object.fromEntries(Headers.map((header) => [header.field, ""]))
  );
  const [uniqueValues, setUniqueValues] = useState({});
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [licenseFormData, setLicenseFormData] = useState({});
  const [licenseUniqueValues, setLicenseUniqueValues] = useState({});
  const [pendingVehicleData, setPendingVehicleData] = useState(null); // Hold vehicle data until license is created

  const requiredFields = ["code", "chassis_number", "vehicle_type"];
  const licenseRequiredFields = ["serial_number", "plate_number", "license_type"];
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

  useEffect(() => {
    async function getLicenseUniqueValues() {
      if (showLicenseForm) {
        try {
          const response = await endPoints.getLicenseUniqueFieldValues();
          setLicenseUniqueValues(response.data);
        } catch (error) {
          console.log("Failed to fetch license unique values");
        }
      }
    }
    getLicenseUniqueValues();
  }, [showLicenseForm]);

  // Function to get intersecting fields between vehicle and license
  const getIntersectingFields = (vehicleData) => {
    const licenseFields = LicenseHeaders.map(header => header.field);
    const vehicleFields = Headers.map(header => header.field);
    
    const intersectingFields = licenseFields.filter(field => vehicleFields.includes(field));
    
    const intersectingData = {};
    intersectingFields.forEach(field => {
      if (vehicleData[field] !== undefined && vehicleData[field] !== null && vehicleData[field] !== "") {
        intersectingData[field] = vehicleData[field];
      }
    });

    // Add plate_number from plate_number_malaky
    if (vehicleData.plate_number_malaky && vehicleData.plate_number_malaky.trim() !== "") {
      intersectingData.plate_number = vehicleData.plate_number_malaky;
    }

    return intersectingData;
  };

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

    // Check if plate_number_malaky is provided
    const hasMalaky = processedData.plate_number_malaky && processedData.plate_number_malaky.trim() !== "";
    
    if (hasMalaky) {
      // Store vehicle data and trigger license form (don't create vehicle yet)
      setPendingVehicleData(processedData);
      
      // Prepare license form with intersecting data
      const intersectingData = getIntersectingFields(processedData);
      
      // Initialize license form data with all fields empty, then fill intersecting ones
      const initialLicenseData = Object.fromEntries(
        LicenseHeaders.map((header) => [header.field, ""])
      );
      
      const preFilledLicenseData = {
        ...initialLicenseData,
        ...intersectingData
      };
      
      setLicenseFormData(preFilledLicenseData);
      setShowLicenseForm(true);
    } else {
      // No malaky plate, create vehicle directly
      handleAddVehicle(processedData);
    }
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      const response = await endPoints.createVehicle(vehicleData);
      onSubmitSuccess(response.data);
      alert("تمت إضافة المركبة بنجاح");
    } catch (err) {
      console.error("Failed to add vehicle:", err);
      alert("فشل في إضافة المركبة");
    }
  };

  const handleLicenseSubmit = (e) => {
    e.preventDefault();

    const requiredFieldsValid = licenseRequiredFields.every(
      (field) => licenseFormData[field]?.trim() !== ""
    );

    if (!requiredFieldsValid) {
      alert("الرجاء ملء الحقول المطلوبة للرخصة");
      return;
    }

    const processedLicenseData = Object.fromEntries(
      Object.entries(licenseFormData).map(([key, value]) => [
        key,
        value.trim() === "" ? null : value.trim(),
      ])
    );

    handleAddVehicleAndLicense(processedLicenseData);
  };

  const handleAddVehicleAndLicense = async (licenseData) => {
    try {
      // First create the vehicle
      const vehicleResponse = await endPoints.createVehicle(pendingVehicleData);
      
      // Then create the license
      const licenseResponse = await endPoints.createLicense(licenseData);
      
      alert("تمت إضافة المركبة والرخصة بنجاح");
      onSubmitSuccess(vehicleResponse.data);
    } catch (err) {
      console.error("Failed to add vehicle and license:", err);
      alert("فشل في إضافة المركبة والرخصة");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLicenseChange = (field, value) => {
    setLicenseFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancelLicense = () => {
    // Cancel the entire operation - vehicle won't be created
    setShowLicenseForm(false);
    setPendingVehicleData(null);
    onCancel();
  };

  if (showLicenseForm) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-blue-600">إضافة رخصة ملاكي جديدة</h3>
          <p className="text-sm text-gray-600">تم تعبئة البيانات المشتركة تلقائياً. الرجاء إكمال البيانات المتبقية</p>
        </div>
        
        <form onSubmit={handleLicenseSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LicenseHeaders.map((header, index) => (
              <div key={header.field}>
                <div className="mb-2 block text-right">
                  <Label htmlFor={header.field}>
                    {header.headerName}
                    {licenseRequiredFields.includes(header.field) && (
                      <span className="text-red-500 mr-1">*</span>
                    )}
                  </Label>
                </div>
                <input
                  className="w-full text-right rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  dir="rtl"
                  id={header.field}
                  ref={index === 0 ? firstInputRef : null}
                  value={licenseFormData[header.field] || ""}
                  onChange={(e) => handleLicenseChange(header.field, e.target.value)}
                  placeholder={header.headerName}
                  required={licenseRequiredFields.includes(header.field)}
                  list={`${header.field}-list`}
                  autoComplete="on"
                  autoFocus={index === 0}
                />
                {licenseUniqueValues[header.field] && (
                  <datalist id={`${header.field}-list`}>
                    {licenseUniqueValues[header.field].map((value, i) => (
                      <option key={i} value={value} />
                    ))}
                  </datalist>
                )}
              </div>
            ))}
          </div>
          <div className="w-full flex justify-end gap-4 mt-4">
            <Button 
              color="gray" 
              onClick={handleCancelLicense}
            >
              إلغاء
            </Button>
            <Button type="submit" color="blue">
              إضافة رخصة
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
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
          إضافة مركبة
        </Button>
      </div>
    </form>
  );
}