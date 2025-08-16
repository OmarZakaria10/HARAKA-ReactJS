import React, { useState } from "react";
import { endPoints } from "../../services/endPoints";
import CustomButton from "../CustomButton";

const ValidInsuranceStatus = [
  "تم التأمين عليها",
  "لن يتم التأمين عليها",
  "سيتم التأمين عليها",
  "تمت معاينتها",
  "تم الإستبعاد من التأمين",
];

const UpdateInsuranceStatusForm = ({
  selectedVehicles,
  onSubmitSuccess,
  onCancel,
}) => {
  const [insuranceStatus, setInsuranceStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!insuranceStatus) {
      alert("الرجاء اختيار حالة التأمين");
      return;
    }

    if (selectedVehicles.length === 0) {
      alert("الرجاء اختيار المركبات المراد تحديث حالة التأمين لها");
      return;
    }

    setIsLoading(true);
    try {
      // Extract vehicle IDs from selected vehicles
      const vehicleIds = selectedVehicles.map(
        (vehicle) => vehicle.vehicle_id || vehicle.id
      );

      const response = await endPoints.updateInsuranceStatus(
        vehicleIds,
        insuranceStatus
      );

      alert(
        `تم تحديث حالة التأمين بنجاح لـ ${response.data.updatedVehicles} مركبة`
      );
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Error updating insurance status:", error);
      alert(
        error.response?.data?.message ||
          "حدث خطأ أثناء تحديث حالة التأمين. الرجاء المحاولة مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
        تحديث حالة التأمين
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          عدد المركبات المحددة: {selectedVehicles.length}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            حالة التأمين الجديدة
          </label>
          <select
            value={insuranceStatus}
            onChange={(e) => setInsuranceStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">اختر حالة التأمين</option>
            {ValidInsuranceStatus.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <CustomButton
            type="submit"
            variant="primary"
            disabled={isLoading || !insuranceStatus}
            className="flex-1"
          >
            {isLoading ? "جاري التحديث..." : "تحديث حالة التأمين"}
          </CustomButton>

          <CustomButton
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            إلغاء
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default UpdateInsuranceStatusForm;
