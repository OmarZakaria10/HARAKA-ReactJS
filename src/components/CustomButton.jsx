import React from "react";

const CustomButton = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-[#1C64F2] hover:bg-[#1557D0] active:bg-[#1047B8] border-[#1C64F2] hover:border-[#1557D0] focus:ring-[#1C64F2]/30 text-white";
      case "danger":
        return "bg-[#E02424] hover:bg-[#C81E1E] active:bg-[#B91919] border-[#E02424] hover:border-[#C81E1E] focus:ring-[#E02424]/30 text-white";
      case "success":
        return "bg-[#0E9F6E] hover:bg-[#057A55] active:bg-[#046C4E] border-[#0E9F6E] hover:border-[#057A55] focus:ring-[#0E9F6E]/30 text-white";
      case "secondary":
        return "bg-[#6B7280] hover:bg-[#4B5563] active:bg-[#374151] border-[#6B7280] hover:border-[#4B5563] focus:ring-[#6B7280]/30 text-white";
      default:
        return "bg-[#1C64F2] hover:bg-[#1557D0] active:bg-[#1047B8] border-[#1C64F2] hover:border-[#1557D0] focus:ring-[#1C64F2]/30 text-white";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1.5 text-xs sm:px-3 min-w-[60px] sm:min-w-[80px]";
      case "md":
        return "px-3 py-2 text-xs sm:text-sm min-w-[70px] sm:min-w-[90px]";
      case "lg":
        return "px-3 py-2.5 text-sm sm:px-4 min-w-[80px] sm:min-w-[100px]";
      default:
        return "px-3 py-2 text-xs sm:text-sm min-w-[70px] sm:min-w-[90px]";
    }
  };

  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 border";

  const disabledStyles =
    "disabled:bg-[#374151] disabled:border-[#374151] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#374151] disabled:hover:border-[#374151] disabled:text-gray-400";

  const combinedClassName =
    `${baseStyles} ${getVariantStyles()} ${getSizeStyles()} ${disabledStyles} ${className}`.trim();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
