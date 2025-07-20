import React from "react";
import { Label } from "flowbite-react";

const DatePicker = ({ label, value, onChange, className }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
      <Label
        htmlFor="date-picker"
        className="text-sm sm:text-base font-medium text-white whitespace-nowrap"
      >
        {label}
      </Label>
      <input
        type="date"
        id="date-picker"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 sm:p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 ${className}`}
      />
    </div>
  );
};

export default DatePicker;
