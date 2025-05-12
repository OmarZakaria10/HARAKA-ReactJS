import axios from "axios";

class Axios {
  static instance = null;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8080",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static getInstance() {
    if (!Axios.instance) {
      Axios.instance = new Axios();
    }
    return Axios.instance;
  }

  // Vehicle API methods
  async getAllVehicles() {
    try {
      const response = await this.api.get("/vehicles/getAllVehicles");
      return response.data.data.vehicles;
    } catch (error) {
      throw error;
    }
  }

  async getVehicleById(id) {
    try {
      const response = await this.api.get(`/vehicles/getVehicle/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getFilteredVehicles(filters) {
    try {
      const response = await this.api.get("/vehicles/getFilteredVehicles", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createVehicle(vehicleData) {
    try {
      const response = await this.api.post(
        "/vehicles/createVehicle",
        vehicleData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateVehicle(id, updateData) {
    try {
      const response = await this.api.patch(
        `/vehicles/updateVehicle/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteVehicle(id) {
    try {
      const response = await this.api.delete(`/vehicles/deleteVehicle/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUniqueFieldValues() {
    try {
      const response = await this.api.get(
        `/vehicles/getUniqueFieldValues/?fields=sector,administration,vehicle_type,vehicle_equipment,color,fuel_type,responsible_person,supply_source,insurance_status`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async createLicense(licenseData) {
    try {
      const response = await this.api.post(
        "/licenses/createLicense",
        licenseData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getLicenseById(id) {
    try {
      const response = await this.api.get(`/licenses/getLicenseById/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateLicense(id, updateData) {
    try {
      const response = await this.api.patch(
        `/licenses/updateLicense/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteLicense(id) {
    try {
      const response = await this.api.delete(`/licenses/deleteLicense/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAllLicenses() {
    try {
      const response = await this.api.get("/licenses/getAllLicenses");
      return response.data.data.licenses; // Make sure you're returning the data
    } catch (error) {
      throw error;
    }
  }

  async getAllLicensesWithVehicles() {
    try {
      const response = await this.api.get(
        "/licenses/getAllLicensesWithVehicles"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getExpiredLicenses() {
    try {
      const response = await this.api.get("/licenses/getExpiredLicenses");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getLicenseUniqueFieldValues() {
    try {
      const response = await this.api.get("/licenses/getUniqueFieldValues");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getExpiringLicenses() {
    try {
      const response = await this.api.get("/licenses/getExpiringLicenses");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getLicenseByVehicleId(id) {
    try {
      const response = await this.api.get(
        `/licenses/getLicenseByVehicleId/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

// Export a single instance
export const endPoints = Axios.getInstance();

export default endPoints;
