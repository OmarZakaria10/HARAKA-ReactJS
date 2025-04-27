import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.12:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const vehicleAPI = {
  // Get all vehicles
  getAllVehicles: async () => {
    try {
      const response = await api.get(
        "/vehicles/getAllVehicles");
      return response.data.data.vehicles;
    } catch (error) {
      throw error;
    }
  },

  // Get vehicle by ID
  getVehicleById: async (id) => {
    try {
      const response = await api.get(`
        /vehicles/getVehicle/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get filtered vehicles
  getFilteredVehicles: async (filters) => {
    try {
      const response = await api.get(
        "/vehicles/getFilteredVehicles", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData) => {
    try {
      const response = await api.post(
        "/vehicles/createVehicle", vehicleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update vehicle
  updateVehicle: async (id, updateData) => {
    try {
      const response = await api.patch(
        `/vehicles/updateVehicle/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    try {
      const response = await api.delete(
        `/vehicles/deleteVehicle/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
