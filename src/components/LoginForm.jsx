import { useState } from "react";
import LoadingWave from "./LoadingWave";
import { endPoints } from "../services/endPoints";
export default function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await endPoints.login(formData.username, formData.password);
      // If remember me is checked, store the token
      if (formData.remember && data.token) {
        localStorage.setItem("token", data.token);
      }

      // Fetch full user profile (ensures fields like `role` are present)
      // This avoids the app showing a loading state in child components
      // that rely on `user.role` immediately after login.
      try {
        const me = await endPoints.getMe();
        onLoginSuccess(me.data.user || data.user);
      } catch (fetchErr) {
        // If fetching /me fails, fall back to login response user
        console.warn("Failed to fetch full user after login:", fetchErr);
        onLoginSuccess(data.user);
      }

    } catch (err) {
      console.error("Login error:", err);

      // Axios errors contain `response`
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("فشل في تسجيل الدخول");
      }

    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-gradient-to-br from-slate-200/20 to-slate-300/20 dark:from-slate-800/20 dark:to-slate-900/20"></div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md z-10">
        {/* Main Card */}
        <div className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Card Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 via-transparent to-blue-500/10 dark:from-white/10 dark:via-transparent dark:to-blue-500/5 rounded-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-28 h-28 bg-white/80 dark:bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 transform hover:scale-105 transition-transform duration-300 border border-slate-200 dark:border-white/30">
                <img
                  src="/futureOfEgypt.jpg"
                  alt="Future of Egypt Logo"
                  className="w-20 h-20 object-contain rounded-2xl"
                />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                إدارة الحركة
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                سجل دخولك للوصول إلى نظام الإدارة
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400/30 rounded-xl text-red-700 dark:text-red-200 text-sm text-center backdrop-blur-sm animate-bounce">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200 text-right"
                >
                  اسم المستخدم
                </label>
                <div className="relative group">
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    dir="rtl"
                    placeholder="أدخل اسم المستخدم"
                    className="w-full px-4 py-3.5 pr-12 bg-white/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm text-right group-hover:border-slate-400 dark:group-hover:border-white/20"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-400 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200 text-right"
                >
                  كلمة المرور
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    dir="rtl"
                    placeholder="أدخل كلمة المرور"
                    className="w-full px-4 py-3.5 pr-12 bg-white/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm text-right group-hover:border-slate-400 dark:group-hover:border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.98 8.223A10.477 10.477 0 001 12C2.268 16.057 6.065 19 10.5 19a9.735 9.735 0 003.93-.825"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.982 18.725A10.477 10.477 0 0021 12C19.732 7.943 15.935 5 11.5 5a9.735 9.735 0 00-3.93.825M2 2l20 20"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-white/80 dark:bg-white/10 border-slate-300 dark:border-white/20 rounded focus:ring-blue-500 focus:ring-2 backdrop-blur-sm"
                  />
                  <label
                    htmlFor="remember"
                    className="mr-2 text-sm text-slate-600 dark:text-slate-300 select-none cursor-pointer"
                  >
                    تذكرني
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 disabled:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <>
                    <LoadingWave size="sm" color="#ffffff" message="" />
                    <span>جاري تسجيل الدخول...</span>
                  </>
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-300/50 dark:border-white/10 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-500">
                © 2025 جهاز مستقبل مصر. جميع الحقوق محفوظة.
              </p>
              <div className="mt-2 flex justify-center space-x-4 text-slate-500 dark:text-slate-500">
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-500/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}
