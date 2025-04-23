import React from "react";

export default function DeleteButton({ selectedRows, onDelete }) {
  const handleDelete = async () => {
    if (!selectedRows || selectedRows.length === 0) return;
    if (window.confirm("هل أنت متأكد من حذف العناصر المحددة؟")) {
      if (onDelete) onDelete(selectedRows);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={!selectedRows || selectedRows.length === 0}
      style={{
        padding: "8px 16px",
        backgroundColor: "#F44336",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: selectedRows && selectedRows.length > 0 ? "pointer" : "not-allowed",
        fontSize: "14px",
        marginRight: "10px",
        transition: "background 0.2s"
      }}
    >
      حذف المحدد
    </button>
  );
}
