import React, { useState } from "react";
import LoadingWave from "./LoadingWave";

/**
 * Example component demonstrating different LoadingWave configurations
 * This can be used as a reference for implementing loading states throughout your app
 */
const LoadingExamples = () => {
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">أمثلة على مكون التحميل</h2>
        <button
          onClick={simulateLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "جاري التحميل..." : "محاكاة التحميل"}
        </button>
      </div>

      {loading && (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">حالة التحميل النشطة</h3>
          <LoadingWave
            size="lg"
            color="#10B981"
            message="جاري معالجة البيانات..."
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Small Size */}
        <div className="text-center p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">حجم صغير</h3>
          <LoadingWave size="sm" color="#3498db" message="تحميل سريع..." />
        </div>

        {/* Medium Size (Default) */}
        <div className="text-center p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">حجم متوسط</h3>
          <LoadingWave size="md" color="#e74c3c" message="جاري التحميل..." />
        </div>

        {/* Large Size */}
        <div className="text-center p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">حجم كبير</h3>
          <LoadingWave size="lg" color="#f39c12" message="تحميل مفصل..." />
        </div>

        {/* Custom Colors */}
        <div className="text-center p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">لون مخصص - بنفسجي</h3>
          <LoadingWave size="md" color="#9b59b6" message="تحميل بنفسجي..." />
        </div>

        <div className="text-center p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">لون مخصص - أخضر</h3>
          <LoadingWave size="md" color="#2ecc71" message="تحميل أخضر..." />
        </div>

        {/* Without Message */}
        <div className="text-center p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">بدون رسالة</h3>
          <LoadingWave size="md" color="#34495e" message="" />
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">أمثلة الاستخدام:</h3>
        <pre className="text-sm bg-white p-4 rounded border overflow-x-auto">
          {`// Basic usage
<LoadingWave />

// With custom size and color
<LoadingWave size="lg" color="#10B981" />

// With custom message
<LoadingWave message="جاري تحميل البيانات..." />

// Full customization
<LoadingWave 
  size="md" 
  color="#3498db" 
  message="جاري المعالجة..."
  className="my-custom-class"
/>`}
        </pre>
      </div>
    </div>
  );
};

export default LoadingExamples;
