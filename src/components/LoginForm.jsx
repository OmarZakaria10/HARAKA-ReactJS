import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://haraka-asnt.onrender.com/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
        credentials: 'include' // Important for receiving cookies
      });

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
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-6">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white">
            تسجيل الدخول
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center bg-red-100 border border-red-400 rounded p-2">
              {error}
            </div>
          )}
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="اسم المستخدم" className="text-white"/>
            </div>
            <TextInput
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="ادخل اسم المستخدم"
            />
          </div>
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="كلمة المرور" className="text-white"/>
            </div>
            <TextInput
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="ادخل كلمة المرور"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <Label htmlFor="remember" value="تذكرني" className="text-white"/>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}