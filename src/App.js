import "./App.css";
import React from "react";
import VehicleGrid from "./components/VehicleGrid";
import Navbar from "./components/Navbar";
import Heading from "./components/Heading";

function App() {
  return (
    <div className="App ">
      <Navbar name={"جهاز مستقبل مصر للتنمية المستدامة"} />
      <Heading
        header={"إدارة الحركة ومركز الصيانة"}
        paragraph={"جهاز مستقبل مصر"}
      />
      <VehicleGrid />
    </div>
  );
}

export default App;
