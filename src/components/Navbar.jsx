import { useState, useEffect, useRef } from "react";
import logo from "../assets/FOE.png";
import LoadingWave from "./LoadingWave";
import "./Navbar.css";

export default function NavbarComponent({
  name,
  user,
  onLogout,
  currentWindow,
  setCurrentWindow,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const menuItems = [
    { id: "reports", label: "التقارير", icon: "📊" },
    { id: "expired", label: "الرخص المنتهية", icon: "⚠️" },
    { id: "gesh", label: "كشف عربات الجيش", icon: "🚗" },
    { id: "licenses", label: "كشف الرخص", icon: "📄" },
    {
      id: "vehicles",
      label: "كشف الميري الشامل",
      icon: "🚛",
    },
  ];

  // Navigation function
  const handleNavigation = async (windowId) => {
    if (currentWindow === windowId || isLoading) return;

    setIsLoading(true);
    setLoadingRoute(windowId);

    // Close menus
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);

    // Simulate loading delay for better UX
    setTimeout(() => {
      setCurrentWindow(windowId);
      setIsLoading(false);
      setLoadingRoute(null);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleGlobalKeyDown = (event) => {
      // Prevent default Ctrl+F to let custom search components handle it
      if ((event.ctrlKey || event.metaKey) && event.key === "f") {
        // Only prevent if we're not in an input field already
        if (!["INPUT", "TEXTAREA"].includes(event.target.tagName)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleGlobalKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleGlobalKeyDown, true);
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setIsUserMenuOpen(false);

    try {
      localStorage.removeItem("token");

      const response = await fetch(
        "https://haraka-asnt.onrender.com/users/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Server logout successful");
      } else {
        console.warn(
          "Server logout failed, but continuing with client-side cleanup"
        );
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    if (onLogout) {
      onLogout();
    }

    setTimeout(() => {
      window.location.href = window.location.origin;
    }, 100);
  };

  const NavigationLoadingOverlay = () =>
    isLoading && (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[10000]">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-600 p-6 flex items-center justify-center min-w-[320px]">
          <LoadingWave size="md" color="#1C64F2" message="جاري التحميل..." />
        </div>
      </div>
    );

  return (
    <>
      {/* Navigation Loading Overlay */}
      <NavigationLoadingOverlay />

      {/* Backdrop overlay for dropdown visibility */}
      {(isUserMenuOpen || isMobileMenuOpen) && !isLoggingOut && (
        <div
          className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-sm"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}

      <nav className="bg-gradient-to-r from-[#1f2836] via-[#2a3441] to-[#1f2836] w-full shadow-2xl border-b border-slate-600/50 backdrop-blur-sm relative z-[9999]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 lg:h-18">
            {/* Logo Section */}
            <div className="flex items-center">
              <a href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <img
                    src={logo}
                    className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                    alt="Logo"
                  />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate max-w-32 sm:max-w-none bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {name || "نظام الحراكة"}
                </span>
              </a>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  disabled={isLoading || isLoggingOut}
                  className={`
                  relative px-4 py-3 text-sm xl:text-base font-medium rounded-t-lg transition-all duration-300 whitespace-nowrap group
                  ${
                    currentWindow === item.id
                      ? "text-white bg-slate-700/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/20"
                  }
                  ${
                    isLoading || isLoggingOut
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-102"
                  }
                  border border-transparent hover:border-slate-600/30
                `}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base transition-transform group-hover:scale-110">
                      {item.icon}
                    </span>
                    {item.label}
                    {isLoading && loadingRoute === item.path && (
                      <LoadingWave size="sm" color="#ffffff" message="" />
                    )}
                  </span>
                  {/* Active underline */}
                  <div
                    className={`
                  absolute bottom-0 left-0 right-0 h-0.5 bg-[#1C64F2] transition-all duration-300 rounded-full
                  ${
                    currentWindow === item.id
                      ? "opacity-100 scale-x-100 shadow-lg shadow-[#1C64F2]/50"
                      : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-75"
                  }
                `}
                  ></div>
                  {/* Hover glow effect */}
                  <div
                    className={`
                  absolute inset-0 bg-gradient-to-r from-transparent via-[#1C64F2]/5 to-transparent 
                  rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300
                  ${currentWindow === item.id ? "opacity-20" : ""}
                `}
                  ></div>
                </button>
              ))}
            </div>{" "}
            {/* User Menu Section */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* User Info */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-white text-sm font-medium truncate max-w-32 lg:max-w-none">
                  {user?.name || user?.username || "المستخدم"}
                </span>
                <span className="text-slate-400 text-xs">
                  {user?.role || "مستخدم"}
                </span>
              </div>

              {/* User Avatar Button */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() =>
                    !isLoggingOut && setIsUserMenuOpen(!isUserMenuOpen)
                  }
                  disabled={isLoggingOut}
                  className={`
                  relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                  bg-gradient-to-br from-[#1C64F2] via-blue-500 to-blue-600 text-white font-bold text-lg
                  shadow-lg transition-all duration-300 nav-button-hover ring-2 ring-white/20
                  ${
                    isLoggingOut
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-xl hover:shadow-[#1C64F2]/25 hover:scale-105 focus:ring-4 focus:ring-[#1C64F2]/30 focus:outline-none"
                  }
                  ${
                    isUserMenuOpen
                      ? "ring-4 ring-[#1C64F2]/40 shadow-xl scale-105"
                      : ""
                  }
                `}
                >
                  {isLoggingOut ? (
                    <LoadingWave size="sm" color="#ffffff" message="" />
                  ) : (
                    <>
                      {user?.username?.[0]?.toUpperCase() || "U"}
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full status-online"></div>
                    </>
                  )}
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && !isLoggingOut && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-600 z-[9999] animate-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-600">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1C64F2] to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
                            {user?.name || user?.username || "مستخدم"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium text-[#1C64F2] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                              {user?.role === "admin"
                                ? "Admin"
                                : user?.role === "licenses"
                                ? "موظف رخص"
                                : user?.role === "GPS"
                                ? "موظف GPS"
                                : user?.role || "مستخدم"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="p-2">
                      {/* Profile Section */}
                      <div className="px-3 py-2 mb-2">
                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                          <span>حالة الاتصال</span>
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            متصل
                          </span>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        </div>
                        <span className="flex-1 text-right">تسجيل الخروج</span>
                        <svg
                          className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <div className="relative lg:hidden" ref={mobileMenuRef}>
                <button
                  type="button"
                  onClick={() =>
                    !isLoggingOut && setIsMobileMenuOpen(!isMobileMenuOpen)
                  }
                  disabled={isLoggingOut}
                  className={`
                  flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white 
                  hover:bg-slate-700/50 rounded-lg transition-all duration-200
                  ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}
                `}
                >
                  <svg
                    className={`w-6 h-6 transition-transform duration-300 ${
                      isMobileMenuOpen ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </button>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && !isLoggingOut && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-600 z-[9999] animate-in slide-in-from-top-2 duration-200">
                    {/* Mobile User Info */}
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-600">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1C64F2] to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
                            {user?.name || user?.username || "مستخدم"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium text-[#1C64F2] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                              {user?.role === "admin"
                                ? "مدير النظام"
                                : user?.role === "licenses"
                                ? "موظف رخص"
                                : user?.role === "GPS"
                                ? "موظف GPS"
                                : user?.role || "مستخدم"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="p-2">
                      {menuItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.id)}
                          disabled={isLoading}
                          className={`
                          w-full relative flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 mb-1 group
                          ${
                            currentWindow === item.id
                              ? "text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700/30"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                          }
                          ${
                            isLoading
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-slate-900 dark:hover:text-white"
                          }
                        `}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-200 ${
                              currentWindow === item.id
                                ? "bg-[#1C64F2] text-white shadow-lg shadow-[#1C64F2]/25"
                                : "bg-slate-100 dark:bg-slate-700 group-hover:bg-[#1C64F2]/10 group-hover:text-[#1C64F2]"
                            }`}
                          >
                            {item.icon}
                          </div>
                          <span className="flex-1 text-right font-medium">
                            {item.label}
                          </span>
                          {isLoading && loadingRoute === item.path && (
                            <LoadingWave size="sm" color="#1C64F2" message="" />
                          )}
                          {/* Active underline for mobile */}
                          <div
                            className={`
                          absolute bottom-0 left-3 right-3 h-0.5 bg-[#1C64F2] transition-all duration-300 rounded-full
                          ${
                            currentWindow === item.id
                              ? "opacity-100 scale-x-100"
                              : "opacity-0 scale-x-0"
                          }
                        `}
                          ></div>
                        </button>
                      ))}

                      {/* Logout Button in Mobile */}
                      <div className="border-t border-slate-200 dark:border-slate-600 mt-3 pt-3">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                          </div>
                          <span className="flex-1 text-right">
                            تسجيل الخروج
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoggingOut && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex items-center justify-center px-6 py-4 bg-slate-800/90 rounded-xl border border-slate-600/50">
              <LoadingWave
                size="sm"
                color="#ffffff"
                message="جاري تسجيل الخروج..."
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
