import React from "react";
import { useOutletContext } from "react-router-dom";
import ExpiredLicensesGrid from "../components/grids/ExpiredLicensesGrid";

const ExpiredLicensesPage = () => {
  const { user } = useOutletContext();

  return (
    <div className="expired-licenses-page">
      <ExpiredLicensesGrid user={user} />
    </div>
  );
};

export default ExpiredLicensesPage;
