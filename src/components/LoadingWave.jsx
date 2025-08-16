import React from "react";
import "./LoadingWave.css";

const LoadingWave = ({
  size = "md",
  color = "#3498db",
  className = "",
  message = "جاري التحميل...",
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      width: "150px",
      height: "50px",
      barWidth: "10px",
      barHeight: "5px",
      maxHeight: "25px",
      margin: "0 2px",
    },
    md: {
      width: "300px",
      height: "100px",
      barWidth: "20px",
      barHeight: "10px",
      maxHeight: "50px",
      margin: "0 5px",
    },
    lg: {
      width: "400px",
      height: "120px",
      barWidth: "30px",
      barHeight: "15px",
      maxHeight: "60px",
      margin: "0 8px",
    },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  const containerStyle = {
    width: config.width,
    height: config.height,
    "--bar-width": config.barWidth,
    "--bar-height": config.barHeight,
    "--bar-max-height": config.maxHeight,
    "--bar-margin": config.margin,
    "--bar-color": color,
  };

  return (
    <div className="loading-wave-container">
      <div className={`loading-wave ${className}`} style={containerStyle}>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
      </div>
      {message && <div className="loading-message">{message}</div>}
    </div>
  );
};

export default LoadingWave;
