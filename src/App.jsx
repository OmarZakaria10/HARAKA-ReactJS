import "./App.css";
import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import VehicleGrid from "./components/grids/VehicleGrid";
import LicenceGrid from "./components/grids/LicenceGrid";
import ExpiredLicensesGrid from "./components/grids/ExpiredLicensesGrid";
import MilitaryLicenseGrid from "./components/grids/MilitaryLicenseGrid";
import ReportsGrid from "./components/grids/ReportsGrid";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWindow, setCurrentWindow] = useState("vehicles"); // State for current view

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try cookie-based authentication
        const response = await fetch(
          "https://haraka-asnt.onrender.com/users/me",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.data.user);
          console.log("Authenticated via cookie");
        } else {
          // If cookie auth fails, try localStorage token
          const token = localStorage.getItem("token");
          if (token) {
            console.log("Trying token auth");
            const tokenResponse = await fetch(
              "https://haraka-express.onrender.com/users/me",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );

            if (tokenResponse.ok) {
              const tokenData = await tokenResponse.json();
              setUser(tokenData.data.user);
              console.log("Authenticated via token");
            } else {
              // Token is invalid, remove it
              console.log("Token invalid, removing");
              localStorage.removeItem("token");
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear potentially invalid token
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
      case "reports":
        return <ReportsGrid user={user} />;
      default:
        return <VehicleGrid user={user} />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <Navbar
        name={"جهاز مستقبل مصر"}
        user={user}
        onLogout={handleLogout}
        currentWindow={currentWindow}
        setCurrentWindow={setCurrentWindow}
      />
      <main className="main-content">{renderCurrentWindow()}</main>
    </div>
  );
}

export default App;
