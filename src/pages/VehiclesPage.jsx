import React from "react";
import { useOutletContext } from "react-router-dom";
import VehicleGrid from "../components/grids/VehicleGrid";

const VehiclesPage = () => {
  const { user } = useOutletContext();

  return (
    <div className="vehicles-page">
      <VehicleGrid user={user} />
    </div>
  );
};

export default VehiclesPage;
