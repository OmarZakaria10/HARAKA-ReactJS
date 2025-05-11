import { useEffect, useState } from "react";
import { endPoints } from "../services/endPoints";
import LicenseHeaders from "../services/licensesHeaders";

export default function AssociatedLicenseForm({ vehicle }) {
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLicense = async () => {
      try {
        setLoading(true);
        const response = await endPoints.getLicenseByVehicleId(vehicle.id);
        console.log("License response:", response);
        setLicense(response || null);
      } catch (err) {
        console.error("Failed to fetch license:", err);
        setError("Failed to load license for this vehicle");
        setLicense(null);
      } finally {
        setLoading(false);
      }
    };

    if (vehicle) {
      fetchLicense();
    }
  }, [vehicle]);

  if (loading) {
    return <div className="text-center">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!license) {
    return <div className="text-center">لا توجد رخصة مرتبطة بهذه المركبة</div>;
  }

  return (
    <div className="space-y-4">
      <div className="border p-4 rounded-lg">
        {LicenseHeaders.map((header) => (
          <div key={header.field} className="mb-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 text-right">
              {header.headerName}
            </div>
            <div className="text-right">
              {license[header.field] || "غير متوفر"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
