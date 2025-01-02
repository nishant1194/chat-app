import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";



function LoginPage() {
  const { login } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
     email: "",
    password: "",
  });
  
  const handleChange = (e) => {
     const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
        login(formData);

   };

  return (
    <div className="min-h-screen bg-[#075e54] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-[#075e54] mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
       

          {/* Email Field */}
          <div className="flex items-center border-2 border-[#075e54] rounded-full px-4 py-3">
            <Mail size={20} color="#075e54" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="ml-3 w-full focus:outline-none text-lg"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center border-2 border-[#075e54] rounded-full px-4 py-3">
            <Lock size={20} color="#075e54" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="ml-3 w-full focus:outline-none text-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="size-5 text-base-content/40" />
              ) : (
                <Eye className="size-5 text-base-content/40" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#25d366] text-white py-3 rounded-full text-xl font-semibold hover:bg-[#128C7E] transition"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-500">
          Create a new account?{" "}
          <a href="/signup" className="text-[#128C7E]">
            SignUp
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
