import "./App.css";
import React, { useState } from "react";
import VehicleGrid from "./components/grids/VehicleGrid";
import Navbar from "./components/Navbar";
import Heading from "./components/Heading";
import LicensesGrid from "./components/grids/LicenceGrid";
import ExpiredLicensesGrid from "./components/grids/ExpiredLicensesGrid";

function App() {
  const [window, setWindow] = useState("vehicles");
  return (
    <div className="App">
      <Navbar
        name={"جهاز مستقبل مصر للتنمية المستدامة"}
        onSetWindow={setWindow}
      />
      <Heading
        header={"إدارة الحركة ومركز الصيانة"}
        paragraph={"جهاز مستقبل مصر"}
      />

      {window === "vehicles" && <VehicleGrid />}
      {window === "licenses" && <LicensesGrid />}
      {window === "expired" && <ExpiredLicensesGrid />}
    </div>
  );
}
export default App;
