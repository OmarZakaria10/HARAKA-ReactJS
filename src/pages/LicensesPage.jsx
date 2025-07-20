import React from "react";
import { useOutletContext } from "react-router-dom";
import LicensesGrid from "../components/grids/LicenceGrid";

const LicensesPage = () => {
  const { user } = useOutletContext();

  return (
    <div className="licenses-page">
      <LicensesGrid user={user} />
    </div>
  );
};

export default LicensesPage;
