import "./App.css";
import React, { useState ,useEffect } from "react";
import VehicleGrid from "./components/grids/VehicleGrid";
import Navbar from "./components/Navbar";
import Heading from "./components/Heading";
import LicensesGrid from "./components/grids/LicenceGrid";
import ExpiredLicensesGrid from "./components/grids/ExpiredLicensesGrid";
import ReportsGrid from "./components/grids/ReportsGrid";
import LoginForm from "./components/LoginForm";
function App() {
  const [window, setWindow] = useState("vehicles");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:4000/users/me", {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <Navbar
        name={"جهاز مستقبل مصر للتنمية المستدامة"}
        onSetWindow={setWindow}
        user={user}
      />
      <Heading
        header={"إدارة الحركة ومركز الصيانة"}
        paragraph={"جهاز مستقبل مصر"}
      />

      {window === "vehicles" && <VehicleGrid />}
      {window === "licenses" && <LicensesGrid />}
      {window === "expired" && <ExpiredLicensesGrid />}
      {window === "reports" && <ReportsGrid />}
    </div>
  );
}
export default App;
