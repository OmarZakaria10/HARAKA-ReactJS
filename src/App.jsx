import "./App.css";
import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import LoadingWave from "./components/LoadingWave";
import VehicleGrid from "./components/grids/VehicleGrid";
import LicenceGrid from "./components/grids/LicenceGrid";
import ExpiredLicensesGrid from "./components/grids/ExpiredLicensesGrid";
import MilitaryLicenseGrid from "./components/grids/MilitaryLicenseGrid";
import PrivateLicensesGrid from "./components/grids/PrivateLicensesGrid";
import ReportsGrid from "./components/grids/ReportsGrid";
import { endPoints } from "./services/endPoints";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWindow, setCurrentWindow] = useState("vehicles"); // State for current view

  // Initialize theme on first load
  useEffect(() => {
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem("haraka-theme");
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const theme = savedTheme || (systemDark ? "dark" : "light");

      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("haraka-theme", theme);
    };

    initializeTheme();
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1) Try cookie-based authentication
        try {
          const cookieData = await endPoints.getMe();
          setUser(cookieData.data.user);
          console.log("Authenticated via cookie");
          return;
        } catch (err) {
          console.log("Cookie auth failed");
        }

        // 2) Try token-based authentication
        const token = localStorage.getItem("token");
        if (token) {
          try {
            console.log("Trying token auth");

            const tokenData = await endPoints.getMeWithToken(token);

            setUser(tokenData.data.user);
            console.log("Authenticated via token");
            return;
          } catch (err) {
            console.log("Token invalid, removing");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);



  const handleLoginSuccess = (userData) => {
    console.log("Login successful:", userData);
    setUser(userData);
  };

  const handleLogout = () => {
    console.log("Logging out user");
    setUser(null);
    localStorage.removeItem("token");
  };

  // Function to render current window content
  const renderCurrentWindow = () => {
    switch (currentWindow) {
      case "vehicles":
        return <VehicleGrid user={user} />;
      case "licenses":
        return <LicenceGrid user={user} />;
      case "expired":
        return <ExpiredLicensesGrid user={user} />;
      case "gesh":
        return <MilitaryLicenseGrid user={user} />;
      case "privateLicenses":
        return <PrivateLicensesGrid user={user} />;
      case "reports":
        return <ReportsGrid user={user} />;
      default:
        return <VehicleGrid user={user} />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <LoadingWave size="lg" color="#60A5FA" message="جاري تحميل النظام..." />
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App bg-white dark:bg-slate-900 min-h-screen">
      <Navbar
        name={"جهاز مستقبل مصر"}
        user={user}
        onLogout={handleLogout}
        currentWindow={currentWindow}
        setCurrentWindow={setCurrentWindow}
      />
      <main className="main-content bg-white dark:bg-slate-900">
        {renderCurrentWindow()}
      </main>
    </div>
  );
}

export default App;
