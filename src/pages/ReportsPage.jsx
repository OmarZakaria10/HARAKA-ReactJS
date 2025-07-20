import React from "react";
import { useOutletContext } from "react-router-dom";
import ReportsGrid from "../components/grids/ReportsGrid";

const ReportsPage = () => {
  const { user } = useOutletContext();

  return (
    <div className="reports-page">
      <ReportsGrid user={user} />
    </div>
  );
};

export default ReportsPage;
