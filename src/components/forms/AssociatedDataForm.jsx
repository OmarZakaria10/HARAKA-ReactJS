import { useEffect, useState } from "react";
import { Label } from "flowbite-react";
import { endPoints } from "../../services/endPoints";
import LoadingWave from "../LoadingWave";

export default function AssociatedLicenseForm({ vehicle, license, headers }) {
  const [associatedData, setAssociatedData] = useState(null);
  const [dataType, setDataType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (vehicle) {
          const response = await endPoints.getLicenseByVehicleId(vehicle.id);
          setAssociatedData(response);
          setDataType("license");
        } else if (license) {
          console.log(license.vehicleId);
          const response = await endPoints.getVehicleById(license.vehicleId);
          console.log(response.data);
          setAssociatedData(response.data.vehicle);
          setDataType("vehicle");
        }
      } catch (err) {
        console.error("Failed to fetch associated data:", err);
        setError("فشل في تحميل البيانات المرتبطة");
        setAssociatedData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vehicle, license]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingWave size="md" color="#60A5FA" message="جاري التحميل..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xl text-center font-medium text-red-400">
        {error}
      </div>
    );
  }

  if (!associatedData) {
    return (
      <div className="text-xl text-center font-medium text-blue-200">
        لا توجد رخصة مرتبطة بهذه المركبة
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="p-4 sm:p-6 rounded-xl bg-gray-800 shadow-xl border border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {headers.map((header) => (
            <div key={header.field} className="space-y-2">
              <div className="block text-right">
                <Label
                  htmlFor={header.field}
                  className="text-gray-300 text-sm sm:text-base font-medium"
                >
                  {header.headerName}
                </Label>
              </div>
              <input
                className="w-full text-right rounded-lg border border-gray-600 bg-gray-700 p-2.5 sm:p-3 text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="rtl"
                id={header.field}
                value={associatedData[header.field] || "غير متوفر"}
                disabled
                readOnly
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
