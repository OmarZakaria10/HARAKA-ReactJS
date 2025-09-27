import ExcelJS from "exceljs";

const CONFIG = {
  colors: {
    primary: "#4472C4",
    headerText: "#FFFFFF",
    bodyText: "#000000",
    alternateRow: "#F2F2F2",
    border: "#000000",
  },
  fonts: {
    headerSize: 12,
    bodySize: 11,
    titleSize: 16,
  },
  layout: {
    rowHeight: 25,
  },
};

// Utility functions
function validateData(headers, data) {
  if (!Array.isArray(headers) || headers.length === 0) {
    throw new Error("Headers must be a non-empty array");
  }
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Data must be a non-empty array");
  }

  if (!headers.every((h) => h.field && h.headerName)) {
    throw new Error("Headers must have field and headerName properties");
  }
}

function containsArabic(text) {
  if (!text) return false;
  const arabicRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

function formatArabicText(text) {
  if (!text) return "";
  const textStr = text.toString();
  return containsArabic(textStr) ? "\u202E" + textStr + "\u202C" : textStr;
}

// Helper function to get nested property value
function getNestedValue(obj, path) {
  if (!obj || !path) return "";

  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : "";
  }, obj);
}

export const generateExcel = async (headers, data, title = "تقرير") => {
  try {
    validateData(headers, data);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title, {
      views: [
        {
          rightToLeft: true,
          showGridLines: false,
          state: "normal",
        },
      ],
    });

    // Header style
    const headerStyle = {
      font: {
        name: "Arial Unicode MS",
        size: CONFIG.fonts.headerSize,
        bold: true,
        color: { argb: "FF" + CONFIG.colors.headerText.replace("#", "") },
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF" + CONFIG.colors.primary.replace("#", "") },
      },
      alignment: { horizontal: "center", vertical: "middle", readingOrder: 2 },
      border: {
        top: { style: "thick", color: { argb: "FF000000" } },
        left: { style: "thick", color: { argb: "FF000000" } },
        bottom: { style: "thick", color: { argb: "FF000000" } },
        right: { style: "thick", color: { argb: "FF000000" } },
      },
    };

    // Data style
    const dataStyle = {
      font: { name: "Arial Unicode MS", size: CONFIG.fonts.bodySize },
      alignment: { horizontal: "center", vertical: "middle", readingOrder: 2 },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      },
    };

    // Add headers with proper Arabic formatting
    const headerRow = worksheet.addRow(
      headers.map((h) => formatArabicText(h.headerName))
    );
    headerRow.eachCell((cell) => {
      Object.assign(cell, headerStyle);
    });
    headerRow.height = CONFIG.layout.rowHeight;

    // Add data rows
    data.forEach((row, index) => {
      const formattedRow = headers.map((header) => {
        const value = getNestedValue(row, header.field);
        return formatArabicText(value || "");
      });

      const dataRow = worksheet.addRow(formattedRow);

      dataRow.eachCell((cell) => {
        const rowStyle =
          index % 2 === 0
            ? {
                ...dataStyle,
                fill: {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: {
                    argb: "FF" + CONFIG.colors.alternateRow.replace("#", ""),
                  },
                },
              }
            : dataStyle;

        Object.assign(cell, rowStyle);
      });

      dataRow.height = CONFIG.layout.rowHeight;
    });

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: false }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = Math.max(maxLength + 5, 15);
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    console.error("❌ Error generating Excel:", error);
    throw error;
  }
};
