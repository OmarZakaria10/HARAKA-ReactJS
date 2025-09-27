const expiredLicensesHeaders = [
  { field: "serial_number", headerName: "مسلسل بالأرشيف" },
  { field: "plate_number", headerName: "رقم اللوحة" },
  { field: "license_type", headerName: "ترخيص" },
  { field: "vehicle_type", headerName: "نوع العربة" },
  { field: "chassis_number", headerName: "رقم الشاسية" },
  { field: "license_start_date", headerName: "بداية الترخيص" },
  { field: "license_end_date", headerName: "نهاية الترخيص" },
  { field: "vehicle.administration", headerName: "الإدارة" },
  { field: "vehicle.sector", headerName: "القطاع" },
  { field: "recipient", headerName: "مستلم الرخصة" },
  { field: "notes", headerName: "ملاحظات" },
  { field: "validity_status", headerName: "صلاحية الرخصة" },
  { field: "violations", headerName: "مخالفات" },
];

export default expiredLicensesHeaders;
