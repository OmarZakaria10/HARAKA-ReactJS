const arabicToEnglish = {
    "الكود": "code",
    "رقم الشاسية": "chassis_number",
    "نوع المركبة": "vehicle_type",
    "تجهيزة المركبة": "vehicle_equipment",
    "مخابرات": "plate_number_mokhabrat",
    "جيش": "plate_number_gesh",
    "ملاكي": "plate_number_malaky", // trimmed the leading space
    "رقم المحرك": "engine_number",
    "اللون": "color",
    "رقم GPS": "gps_device_number",
    "رقم الخط": "line_number",
    "القطاع": "sector",
    "الموديل": "model_year",
    "نوع الوقود": "fuel_type",
    "الإدارة": "administration",
    "المسئول": "responsible_person",
    "جهة التوريد": "supply_source",
    "حالة التأمين": "insurance_status",
    "الملاحظات": "notes",
  };
  
  const englishToArabic = Object.fromEntries(
    Object.entries(arabicToEnglish).map(([arabic, english]) => [english, arabic])
  );