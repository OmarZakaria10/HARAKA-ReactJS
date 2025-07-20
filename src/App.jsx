import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import VehiclesPage from "./pages/VehiclesPage";
import LicensesPage from "./pages/LicensesPage";
import ExpiredLicensesPage from "./pages/ExpiredLicensesPage";
import MilitaryLicensesPage from "./pages/MilitaryLicensesPage";
import ReportsPage from "./pages/ReportsPage";
import LoginForm from "./components/LoginForm";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <Router>
        <Routes>
          <Route
            path="/"
            element={<MainLayout user={user} onLogout={handleLogout} />}
          >
            <Route index element={<Navigate to="/vehicles" replace />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="licenses" element={<LicensesPage />} />
            <Route path="expired" element={<ExpiredLicensesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="gesh" element={<MilitaryLicensesPage />} />
            {/* Redirect any unknown routes to vehicles */}
            <Route path="*" element={<Navigate to="/vehicles" replace />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
