import React, { useState, useRef, useEffect } from "react";

// Vehicle fields as per columnsMap.js and VehicleGrid.js
const vehicleFields = [
  { name: "code", label: "الكود" },
  { name: "chassis_number", label: "رقم الشاسية" },
  { name: "vehicle_type", label: "نوع المركبة" },
  { name: "vehicle_equipment", label: "تجهيزة المركبة" },
  { name: "plate_number_mokhabrat", label: "مخابرات" },
  { name: "plate_number_gesh", label: "جيش" },
  { name: "plate_number_malaky", label: "ملاكي" },
  { name: "engine_number", label: "رقم المحرك" },
  { name: "color", label: "اللون" },
  { name: "gps_device_number", label: "رقم GPS" },
  { name: "line_number", label: "رقم الخط" },
  { name: "sector", label: "القطاع" },
  { name: "model_year", label: "الموديل" },
  { name: "fuel_type", label: "نوع الوقود" },
  { name: "administration", label: "الإدارة" },
  { name: "responsible_person", label: "المسئول" },
  { name: "supply_source", label: "جهة التوريد" },
  { name: "notes", label: "الملاحظات" },
];

export default function AddButton({ onSubmit, name }) {
  const [showForm, setShowForm] = useState(false);

  const handleAddClick = () => setShowForm(true);
  const handleFormSubmit = (vehicle) => {
    setShowForm(false);
    if (onSubmit) onSubmit(vehicle);
  };
  const handleFormClose = () => setShowForm(false);

  return (
    <>
      {!showForm && (
        <button
          onClick={handleAddClick}
          style={{
            width: "5rem", // Tailwind w-20 = 5rem
            padding: "8px 16px", // Tailwind py-2 px-4 = 0.5rem 1rem = 8px 16px
            backgroundColor: "#60a5fa", // Tailwind bg-blue-400
            color: "white", // text-white
            border: "none",
            borderRadius: "4px", // Tailwind rounded = 4px
            fontSize: "14px", // Tailwind text-sm = 0.875rem = 14px
            cursor: "pointer",
            transition: "background-color 150ms ease-in-out", // Tailwind transition-colors
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")} // hover:bg-blue-600
          onMouseOut={(e) => (e.target.style.backgroundColor = "#60a5fa")}
        >
          {name || "إضافة"}
        </button>
      )}
      <Form
        visible={showForm}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </>
  );
}

function Form({ visible, onSubmit, onClose }) {
  const [form, setForm] = useState(() =>
    Object.fromEntries(vehicleFields.map((f) => [f.name, ""]))
  );
  const [show, setShow] = useState(visible);
  const firstInputRef = useRef(null);

  // Animate in/out
  useEffect(() => {
    if (visible) setShow(true);
    else {
      // Wait for animation before unmounting
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  // Focus first input when shown
  useEffect(() => {
    if (visible && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [visible]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allFieldsValid = Object.values(form).every(
      (value) => typeof value === "string" && value.trim() !== ""
    );
    if (allFieldsValid && onSubmit) {
      onSubmit(form);
    } else {
      alert("Please fill out all fields with valid strings.");
    }
  };

  if (!show && !visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: visible ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: visible ? "auto" : "none",
        transition: "background 0.3s",
      }}
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          minWidth: 400,
          maxWidth: 900,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-40px)",
          transition: "opacity 0.3s, transform 0.3s",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12, // ensure close button is at top right
            background: "none",
            border: "none",
            fontSize: 22,
            color: "#888",
            cursor: "pointer",
          }}
          aria-label="إغلاق"
        >
          ×
        </button>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px 24px",
            width: "100%",
            overflowX: "auto",
            paddingBottom: 8,
            marginBottom: 16,
            scrollbarWidth: "thin",
            scrollbarColor: "#bbb #eee",
            direction: "rtl", // RTL for right-to-left order
          }}
        >
          {vehicleFields.map((field, idx) => (
            <div
              key={field.name}
              style={{
                flex: "1 1 220px",
                minWidth: 180,
                display: "flex",
                flexDirection: "column",
                marginBottom: 8,
              }}
            >
              <label
                htmlFor={field.name}
                style={{ marginBottom: 4, fontWeight: 500 }}
              >
                {field.label}
              </label>
              <input
                ref={idx === 0 ? firstInputRef : undefined}
                id={field.name}
                name={field.name}
                type="text"
                value={form[field.name]}
                onChange={handleChange}
                style={{
                  padding: "8px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: 15,
                }}
                autoComplete="off"
              />
            </div>
          ))}
        </div>
        <div style={{ flexBasis: "100%", textAlign: "center", marginTop: 8 }}>
          <button
            type="submit"
            style={{
              padding: "10px 32px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            إضافة
          </button>
        </div>
      </form>
    </div>
  );
}
