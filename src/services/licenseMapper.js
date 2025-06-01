export const mapVehicleToLicense = (vehicle) => {
  return {
    plate_number: vehicle.plate_number_malaky,
    vehicle_type: vehicle.vehicle_type,
    chassis_number: vehicle.chassis_number,
    vehicleId: vehicle.id,
    // Add any other relevant fields that should be mapped
  };
};

