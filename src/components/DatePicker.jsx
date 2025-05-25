import React from "react";
import { Label } from "flowbite-react";

const DatePicker = ({ label, value, onChange, className }) => {
  return (
    <div className="flex flex-row items-end space-x-2">
      <Label
        htmlFor="date-picker"
        className="mb-2 text-sm font-medium"
      >
        {label}
      </Label>
      <input
        type="date"
        id="date-picker"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
      />
    </div>
  );
};

export default DatePicker;
