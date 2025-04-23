import React, { useState, useEffect, useRef } from "react";

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

export default function UpdateButton({ selectedRows, onSubmit }) {
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => setShowForm(true);
  const handleFormSubmit = (updatedRows) => {
    setShowForm(false);
    if (onSubmit) onSubmit(updatedRows);
  };
  const handleFormClose = () => setShowForm(false);

  return (
    <>
      <button
        onClick={handleClick}
        disabled={!selectedRows || selectedRows.length === 0}
        style={{
          padding: "8px 16px",
          backgroundColor: "#FF9800",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: selectedRows && selectedRows.length > 0 ? "pointer" : "not-allowed",
          fontSize: "14px",
          marginRight: "10px",
          transition: "background 0.2s"
        }}
      >
        تعديل المحدد
      </button>
      <FormUpdate
        visible={showForm}
        rows={selectedRows}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </>
  );
}

function FormUpdate({ visible, rows, onSubmit, onClose }) {
  const [show, setShow] = useState(visible);
  const [forms, setForms] = useState(() =>
    (rows || []).map(row => ({ ...row }))
  );
  const firstInputRef = useRef(null);

  useEffect(() => {
    setForms((rows || []).map(row => ({ ...row })));
  }, [rows]);

  useEffect(() => {
    if (visible) setShow(true);
    else {
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [visible]);

  const handleChange = (idx, e) => {
    const updated = forms.map((f, i) =>
      i === idx ? { ...f, [e.target.name]: e.target.value } : f
    );
    setForms(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(forms);
  };

  if (!show && !visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
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
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          minWidth: 400,
          maxWidth: 1200,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          padding: 24,
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
            right: 12,
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
            flexDirection: "column",
            gap: "24px",
            width: "100%",
            direction: "rtl",
            marginBottom: 8,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {(forms || []).map((form, idx) => (
            <div
              key={form.code || idx}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                background: "#f7f7f7",
                borderRadius: 10,
                padding: "12px 8px",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {vehicleFields.map((field, fidx) => (
                <div
                  key={field.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 120,
                    marginLeft: 8,
                  }}
                >
                  <label
                    htmlFor={`${field.name}_${idx}`}
                    style={{ marginBottom: 2, fontWeight: 500, fontSize: 13 }}
                  >
                    {field.label}
                  </label>
                  <input
                    ref={idx === 0 && fidx === 0 ? firstInputRef : undefined}
                    id={`${field.name}_${idx}`}
                    name={field.name}
                    type="text"
                    value={form[field.name] || ""}
                    onChange={e => handleChange(idx, e)}
                    style={{
                      padding: "6px",
                      borderRadius: 5,
                      border: "1px solid #ccc",
                      fontSize: 14,
                    }}
                    autoComplete="off"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ width: "100%", textAlign: "center", marginTop: 8 }}>
          <button
            type="submit"
            style={{
              padding: "10px 32px",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
}
