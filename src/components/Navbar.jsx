import logo from "../assets/FOE.png";
import { useState } from "react";

export default function Navbar({ name, onSetWindow }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { id: "expired", label: "الرخص المنتهية" },
    { id: "licenses", label: "كشف الرخص" },
    { id: "vehicles", label: "كشف الميري الشامل" },
  ];

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo and Brand Name */}
        <a
          href="/"
          className="flex items-center gap-3 rtl:flex-row-reverse"
          aria-label="Home"
        >
          <img src={logo} className="h-12 w-auto" alt="Logo" />
          <h1 className="text-lg font-semibold whitespace-nowrap dark:text-white">
            {name}
          </h1>
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-menu"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Toggle navigation menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Navigation Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto transition-all duration-200 ease-in-out`}
          id="navbar-menu"
        >
          <nav className="flex flex-col gap-2 p-4 mt-4 md:p-0 md:mt-0 md:flex-row md:gap-8 rtl:space-x-reverse">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSetWindow(item.id);
                  setIsMenuOpen(false); // Close menu after selection on mobile
                }}
                className="px-4 py-2 text-center rounded-lg transition-colors duration-200
                  md:px-0 md:py-0 md:bg-transparent
                  text-gray-900 hover:bg-gray-100 
                  dark:text-white dark:hover:bg-gray-700 
                  md:dark:hover:bg-transparent md:dark:hover:text-blue-500
                  md:hover:bg-transparent md:hover:text-blue-700"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
}
