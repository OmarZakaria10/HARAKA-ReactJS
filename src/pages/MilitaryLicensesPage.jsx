import React from "react";
import { useOutletContext } from "react-router-dom";
import MilitaryLicenseGrid from "../components/grids/MilitaryLicenseGrid";

const MilitaryLicensesPage = () => {
  const { user } = useOutletContext();

  return (
    <div className="military-licenses-page">
      <MilitaryLicenseGrid user={user} />
    </div>
  );
};

export default MilitaryLicensesPage;
