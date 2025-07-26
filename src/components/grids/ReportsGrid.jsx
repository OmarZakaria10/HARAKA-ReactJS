import { useState, useCallback, useEffect } from "react";
import DataGrid from "./DataGrid";
import { endPoints } from "../../services/endPoints";
import { Headers } from "../../services/vehicleHeaders";
import { Label } from "flowbite-react";

function ReportsGrid({ direction = "rtl" }) {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [uniqueValues, setUniqueValues] = useState({
    sector: [],
    administration: [],
  });

  const handleSelectionChange = useCallback((selected) => {
    // Handle selection if needed in the future
  }, []);

  // Fetch unique values for sectors and administrations
  useEffect(() => {
    const fetchUniqueValues = async () => {
      try {
        const response = await endPoints.getUniqueFieldValues();
        setUniqueValues({
          sector: response.data.sector || [],
          administration: response.data.administration || [],
        });
      } catch (error) {
        console.error("Error fetching unique values:", error);
      }
    };
    fetchUniqueValues();
  }, []);

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
    setUpdateTrigger((prev) => prev + 1);
  };

  const handleAdminChange = (event) => {
    setSelectedAdmin(event.target.value);
    setUpdateTrigger((prev) => prev + 1);
  };

  const fetchData = useCallback(async () => {
    try {
      // Create filters object based on selected values
      const filters = {
        ...(selectedSector && { sector: selectedSector }),
        ...(selectedAdmin && { administration: selectedAdmin }),
      };

      // Only make the API call if at least one filter is selected
      if (Object.keys(filters).length > 0) {
        const response = await endPoints.getFilteredVehicles(filters);
        return response.data.vehicles;
      }
      return [];
    } catch (error) {
      console.error("Error fetching filtered vehicles:", error);
      throw error;
    }
  }, [selectedSector, selectedAdmin]);

  const config = {
    headers: Headers,
    fetchData,
    labels: {
      exportFileName: "تقرير المركبات.csv",
      selectToHideMessage: "الرجاء اختيار المركبات المراد إخفائها",
    },
    features: {
      hideButton: true,
      export: true,
    },
    updateTrigger,
  };

  return (
    <div className="flex flex-col h-full">
      <DataGrid
        direction={direction}
        config={config}
        onSelectionChange={handleSelectionChange}
      >
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
          {/* Sector Selection */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor="sector-select"
              className="text-white text-sm whitespace-nowrap"
            >
              القطاع:
            </Label>
            <select
              id="sector-select"
              value={selectedSector}
              onChange={handleSectorChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white min-w-0 flex-1 sm:flex-initial sm:w-auto"
            >
              <option value="">اختر القطاع</option>
              {uniqueValues.sector.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Administration Selection */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor="admin-select"
              className="text-white text-sm whitespace-nowrap"
            >
              الإدارة:
            </Label>
            <select
              id="admin-select"
              value={selectedAdmin}
              onChange={handleAdminChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white min-w-0 flex-1 sm:flex-initial sm:w-auto"
            >
              <option value="">اختر الإدارة</option>
              {uniqueValues.administration.map((admin) => (
                <option key={admin} value={admin}>
                  {admin}
                </option>
              ))}
            </select>
          </div>
        </div>
      </DataGrid>
    </div>
  );
}

export default ReportsGrid;
