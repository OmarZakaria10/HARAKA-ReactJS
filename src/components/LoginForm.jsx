import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch(
        "https://haraka-asnt.onrender.com/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
          credentials: "include", // Important for receiving cookies
        }
      );

      const data = await response.json();

      if (response.ok) {
        // If remember me is checked, store the token
        if (formData.remember && data.token) {
          localStorage.setItem("token", data.token);
        }
        onLoginSuccess(data.data.user);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg space-y-6 sm:space-y-8 bg-gray-800 p-6 sm:p-8 lg:p-10 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white text-shadow">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-400">
            أدخل بياناتك للوصول إلى النظام
          </p>
        </div>

        <form
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="text-red-400 text-center bg-red-900/20 border border-red-400/30 rounded-lg p-3 text-sm sm:text-base animate-slide-in">
              {error}
            </div>
          )}

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="username"
                value="اسم المستخدم"
                className="text-white text-sm sm:text-base"
              />
            </div>
            <TextInput
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="ادخل اسم المستخدم"
              className="input-field"
              sizing="lg"
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password"
                value="كلمة المرور"
                className="text-white text-sm sm:text-base"
              />
            </div>
            <TextInput
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="ادخل كلمة المرور"
              className="input-field"
              sizing="lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full btn-primary text-base sm:text-lg py-3 sm:py-4"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}
