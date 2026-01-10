import { useState } from "react";
import { Patient } from "../App";
import { ArrowLeft, Eye, EyeOff, Smartphone } from "lucide-react";
import { Logo } from "./Logo";
import { toast } from "sonner";

interface UserAuthProps {
  initialMode: "signin" | "signup";
  onAuthComplete: (user: Patient) => void;
  onBack: () => void;
}

export function UserAuth({ initialMode, onAuthComplete, onBack }: UserAuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    name: "",
    role: "patient" as "patient" | "pharmacist" | "caregiver",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user exists
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = savedUsers.find((u: any) => u.phone === formData.phone);

    if (existingUser) {
      // Sign in flow
      if (formData.password === existingUser.password) {
        toast.success("Welcome back, " + existingUser.name);
        onAuthComplete(existingUser);
      } else {
        toast.error("Invalid password. Please try again.");
      }
    } else {
      // Auto sign up - create new user
      if (!formData.name) {
        toast.error("Please enter your name to create an account");
        return;
      }
      
      const user: Patient = {
        id: Date.now().toString(),
        email: formData.email,
        password: formData.password || "default123",
        role: formData.role,
        name: formData.name,
        phone: formData.phone,
      };

      savedUsers.push(user);
      localStorage.setItem("users", JSON.stringify(savedUsers));

      toast.success("Account created successfully!");
      onAuthComplete(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-in-up">
          <div className="mb-8">
            <Logo size="sm" showText={false} />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">User Login</h2>
          <p className="text-gray-600 mb-8">Access your prescriptions & health data</p>

          <form onSubmit={handleContinue} className="space-y-5">
            {/* Mobile Number - Mandatory */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Required for prescription delivery</p>
            </div>

            {/* Name - For new users */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="John Doe"
              />
              <p className="text-xs text-gray-500 mt-1">Required for new accounts</p>
            </div>

            {/* Email - Optional */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-12 transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange("role", "patient")}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    formData.role === "patient"
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("role", "pharmacist")}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    formData.role === "pharmacist"
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pharmacist
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("role", "caregiver")}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    formData.role === "caregiver"
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Caregiver
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              Continue
            </button>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-700">
              <p className="font-medium mb-1">🔐 Auto Sign-in/Sign-up</p>
              <p className="text-xs text-gray-600">
                New users will be auto-registered. Existing users will be signed in.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
