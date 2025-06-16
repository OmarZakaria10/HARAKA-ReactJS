import { useState, useEffect, useRef } from 'react';
import logo from "../assets/FOE.png";

export default function NavbarComponent({ name, onSetWindow, user }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    try {
      const response = await fetch("http://localhost:4000/users/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error('Logout failed');
      localStorage.removeItem("token");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo Section */}
        <a href="/" className="flex items-center gap-3">
          <img src={logo} className="h-8" alt="Logo" />
          <span className="self-center text-xl font-semibold text-white">
            {name}
          </span>
        </a>
        
        {/* Desktop Navigation - Updated styling */}
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
          >
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </button>
          
          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-gray-700 rounded-md shadow-lg z-50">
              <div className="px-4 py-2 border-b border-gray-600">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role || 'User'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-right px-4 py-2 text-sm text-red-400 hover:bg-gray-600 hover:text-red-300"
              >
                تسجيل الخروج
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="relative" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white focus:outline-none"
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