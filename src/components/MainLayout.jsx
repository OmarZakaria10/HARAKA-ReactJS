import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = ({ user, onLogout }) => {
  return (
    <div className="main-layout">
      <Navbar name={"جهاز مستقبل مصر"} user={user} onLogout={onLogout} />
      <main className="main-content">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

export default MainLayout;
