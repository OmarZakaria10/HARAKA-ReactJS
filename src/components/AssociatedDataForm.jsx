import { useEffect, useState } from "react";
import { Label } from "flowbite-react";
import { endPoints } from "../services/endPoints";
//import LicenseHeaders from "../services/licensesHeaders";
//import VehicleHeaders from "../services/vehicleHeaders";


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
          setDataType('license');
        } else if (license) {
          const response = await endPoints.getVehicleById(license.vehicle_id);
          setAssociatedData(response);
          setDataType('vehicle');
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
    return <div className="text-xl text-center font-medium text-blue-200">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-xl text-center font-medium text-red-400">{error}</div>;
  }

  if (!associatedData) {
    return <div className="text-xl text-center font-medium text-blue-200">لا توجد رخصة مرتبطة بهذه المركبة</div>;
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-gray-800 shadow-lg shadow-blue-300/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {headers.map((header) => (
            <div key={header.field} className="mb-2">
              <div className="mb-2 block text-right">
                <Label htmlFor={header.field} className="text-gray-400 text-md">
                  {header.headerName}
                </Label>
              </div>
              <input
                className="w-full text-right rounded-2xl border border-gray-600 bg-gray-700 p-2.5 text-white text-md"
                dir="rtl"
                id={header.field}
                value={associatedData[header.field] || "غير متوفر"}
                disabled
              />
            </div>
          ))}
        </div>
      </div>
    </div>   
  );
}
