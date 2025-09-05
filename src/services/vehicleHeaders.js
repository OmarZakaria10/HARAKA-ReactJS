// Role-based column definitions
const vehiclesRoleColumns = {
  user: [
    "id",
    "code",
    "chassis_number",
    "vehicle_type",
    "vehicle_equipment",
    "plate_number_malaky",
    "plate_number_gesh",
    "plate_number_mokhabrat",
    "engine_number",
    "color",
    "gps_device_number",
    "line_number",
    "sector",
    "model_year",
    "fuel_type",
    "administration",
    "responsible_person",
    "supply_source",
    "insurance_status",
    "insurance_policy",
    "customs_clearance",
    "insurance_document",
    "license_status",
    "notes",
  ],
  admin: [
    "id",
    "code",
    "chassis_number",
    "vehicle_type",
    "vehicle_equipment",
    "plate_number_malaky",
    "plate_number_gesh",
    "plate_number_mokhabrat",
    "engine_number",
    "color",
    "gps_device_number",
    "line_number",
    "sector",
    "model_year",
    "fuel_type",
    "administration",
    "responsible_person",
    "supply_source",
    "insurance_status",
    "insurance_policy",
    "customs_clearance",
    "insurance_document",
    "license_status",
    "notes",
  ],
  viewer: [
    "id",
    "code",
    "chassis_number",
    "vehicle_type",
    "vehicle_equipment",
    "plate_number_malaky",
    "plate_number_gesh",
    "plate_number_mokhabrat",
    "engine_number",
    "color",
    "gps_device_number",
    "line_number",
    "sector",
    "model_year",
    "fuel_type",
    "administration",
    "responsible_person",
    "supply_source",
    "insurance_status",
    "insurance_policy",
    "customs_clearance",
    "insurance_document",
    "license_status",
    "notes",
  ],
  GPS: [
    "id",
    "code",
    "chassis_number",
    "vehicle_type",
    "vehicle_equipment",
    "plate_number_malaky",
    "plate_number_gesh",
    "plate_number_mokhabrat",
    "engine_number",
    "color",
    "gps_device_number",
    "line_number",
    "sector",
    "model_year",
    "fuel_type",
    "administration",
    "responsible_person",
    "license_status",
    "notes",
  ],
  license: [
    // License role has restricted columns focused on licensing
    "id",
    "code",
    "chassis_number",
    "vehicle_type",
    "vehicle_equipment",
    "plate_number_malaky",
    "engine_number",
    "color",
    "sector",
    "model_year",
    "fuel_type",
    "administration",
    "responsible_person",
    "supply_source",
    "insurance_status",
    "license_status",
    "notes",
  ],
};

// Arabic header mappings for all possible fields
const fieldHeaderMappings = {
  id: "المعرف",
  code: "الكود",
  chassis_number: "رقم الشاسية",
  vehicle_type: "نوع المركبة",
  vehicle_equipment: "تجهيزة المركبة",
  plate_number_malaky: "ملاكي",
  plate_number_gesh: "جيش",
  plate_number_mokhabrat: "مخابرات",
  engine_number: "رقم المحرك",
  color: "اللون",
  gps_device_number: "رقم GPS",
  line_number: "رقم الخط",
  sector: "القطاع",
  model_year: "الموديل",
  fuel_type: "نوع الوقود",
  administration: "الإدارة",
  responsible_person: "المسئول",
  supply_source: "جهة التوريد",
  insurance_status: "حالة التأمين",
  insurance_policy: "بوليصة",
  customs_clearance: "إفراج جمركي",
  insurance_document: "وثيقة التأمين",
  license_status: "موقف الترخيص",
  notes: "الملاحظات",
};

// Function to generate headers based on user role
const getHeadersByRole = (userRole) => {
  // Default to 'user' role if role is not found or is null/undefined
  const effectiveRole = userRole || "user";
  const columns =
    vehiclesRoleColumns[effectiveRole] || vehiclesRoleColumns.user;

  const headers = columns
    .filter((field) => field !== "id") // Exclude id from display
    .map((field) => ({
      field,
      headerName: fieldHeaderMappings[field] || field,
    }));

  return headers;
};

// Legacy exports for backward compatibility
const Headers = getHeadersByRole("admin");
const LicensesRoleHeaders = getHeadersByRole("license");
const GPSRoleHeaders = getHeadersByRole("GPS");

export {
  Headers,
  GPSRoleHeaders,
  LicensesRoleHeaders,
  getHeadersByRole,
  vehiclesRoleColumns,
  fieldHeaderMappings,
};
