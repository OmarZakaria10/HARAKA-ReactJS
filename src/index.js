"use client";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VehicleGrid from "./components/VehicleGrid";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <h1 style={{ textAlign: 'center' }}>كشف الميري الشامل</h1>
    <VehicleGrid />
  </StrictMode>
);
