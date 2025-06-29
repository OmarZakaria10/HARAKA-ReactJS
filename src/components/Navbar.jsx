import { useState, useEffect, useRef } from 'react';
import logo from "../assets/FOE.png";

export default function NavbarComponent({ name, onSetWindow, user, onLogout }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const menuItems = [
    { id: "vehicles", label: "كشف الميري الشامل" },
    { id: "licenses", label: "كشف الرخص" },
    { id: "expired", label: "الرخص المنتهية" },
    { id: "reports", label: "التقارير" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    console.log("Starting logout process...");

    try {
      // Always clear localStorage first
      localStorage.removeItem("token");
      
      // Make logout request to server
      const response = await fetch("https://haraka-asnt.onrender.com/users/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        console.log("Server logout successful");
      } else {
        console.warn("Server logout failed, but continuing with client-side cleanup");
      }
    } catch (error) {
      console.error("Logout request failed:", error);
      // Continue with logout even if request fails
    }

    // Always call the parent logout handler
    if (onLogout) {
      onLogout();
    }
    
    // Small delay to ensure state updates, then reload as fallback
    setTimeout(() => {
      window.location.href = window.location.origin;
    }, 100);
  };

  return (
    <nav className="bg-gray-900 w-full">
      <div className="relative flex items-center justify-between w-full px-4 py-3">
        {/* Logo Section */}
        <a href="/" className="flex items-center gap-3">
          <img src={logo} className="h-8" alt="Logo" />
          <span className="self-center text-xl font-semibold text-white">
            {name}
          </span>
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSetWindow(item.id)}
              className="text-gray-300 hover:text-blue-500 px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* User Menu Section */}
        <div className="relative flex items-center gap-4" ref={userDropdownRef}>
          <span className="text-gray-300 text-sm hidden md:block">
            {user?.username || "المستخدم"}
          </span>
          
          {/* User Avatar Button */}
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white text-sm hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
            disabled={isLoggingOut}
          >
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </button>
          
          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-gray-700 rounded-md shadow-lg z-50">
              <div className="px-4 py-2 border-b border-gray-600">
                <p className="text-sm font-medium text-white">{user?.name || user?.username}</p>
                <p className="text-xs text-gray-400">{user?.role || 'User'}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-right px-4 py-2 text-sm text-red-400 hover:bg-gray-600 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="relative" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white focus:outline-none"
              disabled={isLoggingOut}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-gray-700 rounded-md shadow-lg z-50">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSetWindow(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                    disabled={isLoggingOut}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}