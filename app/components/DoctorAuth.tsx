import { useState } from "react";
import { Doctor } from "../App";
import { ArrowLeft, Lock, Mail, Eye, EyeOff, Upload, Shield, CheckCircle2 } from "lucide-react";
import { Logo } from "./Logo";
import { toast } from "sonner";

interface DoctorAuthProps {
  initialMode: "signin" | "signup" | "forgot";
  onAuthComplete: (doctor: Doctor) => void;
  onBack: () => void;
}

type AuthMode = "signin" | "signup" | "forgot" | "create-password" | "verify-otp";

export function DoctorAuth({ initialMode, onAuthComplete, onBack }: DoctorAuthProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    medicalCouncilNo: "",
    specialization: "",
    hospitalName: "",
    workEmail: "",
    licenseFile: null as File | null,
    otp: "",
  });
  const [registrationData, setRegistrationData] = useState<any>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const savedDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    const doctor = savedDoctors.find(
      (d: any) => d.email === formData.email && d.password === formData.password
    );

    if (doctor) {
      toast.success("Welcome back, Dr. " + doctor.name);
      onAuthComplete(doctor);
    } else {
      toast.error("Invalid credentials. Please check and try again.");
    }
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationData(formData);
    toast.success("Verification code sent to your email");
    setMode("verify-otp");
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp === "123456" || formData.otp.length >= 4) {
      toast.success("Email verified successfully");
      setMode("create-password");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleCreatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor: Doctor = {
      id: Date.now().toString(),
      email: registrationData.workEmail,
      password: formData.password,
      role: "doctor",
      name: registrationData.fullName,
      medicalCouncilNo: registrationData.medicalCouncilNo,
      specialization: registrationData.specialization,
      hospitalName: registrationData.hospitalName,
      licenseNumber: registrationData.medicalCouncilNo,
      verified: true,
    };

    const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    doctors.push(doctor);
    localStorage.setItem("doctors", JSON.stringify(doctors));

    toast.success("Account created successfully!");
    onAuthComplete(doctor);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("OTP sent to your email");
    setMode("verify-otp");
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

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Sign In */}
          {mode === "signin" && (
            <div className="animate-slide-in-up">
              <div className="mb-8">
                <Logo size="sm" showText={false} />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Doctor Login</h2>
              <p className="text-gray-600 mb-8">Access your medical dashboard</p>

              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email or phone"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all"
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

                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot Password?
                </button>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Login
                </button>

                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-blue-600 font-semibold hover:text-blue-700"
                  >
                    Register
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* Registration */}
          {mode === "signup" && (
            <div className="animate-slide-in-up">
              <div className="mb-6">
                <Logo size="sm" showText={false} />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Doctor Registration</h2>
              <p className="text-gray-600 mb-6">Verify your credentials</p>

              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medical Council Registration No.
                  </label>
                  <input
                    type="text"
                    value={formData.medicalCouncilNo}
                    onChange={(e) => handleInputChange("medicalCouncilNo", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="MCI-123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange("specialization", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="General Medicine"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hospital / Clinic Name
                  </label>
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="City General Hospital"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={formData.workEmail}
                    onChange={(e) => handleInputChange("workEmail", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="doctor@hospital.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Medical License
                  </label>
                  <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleInputChange("licenseFile", e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                  {formData.licenseFile && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {formData.licenseFile.name}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Verify & Continue
                </button>

                <p className="text-center text-sm text-gray-600">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-blue-600 font-semibold"
                  >
                    Login
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* Verify OTP */}
          {mode === "verify-otp" && (
            <div className="text-center animate-slide-in-up">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
              <p className="text-gray-600 mb-8">
                Enter the 6-digit code sent to your email
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-center text-3xl tracking-[0.5em] font-bold transition-all"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Verify
                </button>

                <p className="text-center text-sm text-gray-600">
                  Didn't receive code?{" "}
                  <button type="button" className="text-blue-600 font-semibold hover:text-blue-700">
                    Resend
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* Create Password */}
          {mode === "create-password" && (
            <div className="animate-slide-in-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Password</h2>
                <p className="text-gray-600">Set up your account password</p>
              </div>

              <form onSubmit={handleCreatePassword} className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Create Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 pr-12 transition-all"
                    placeholder="Enter password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[42px] text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-700">
                  <p className="font-semibold mb-2">Password Requirements:</p>
                  <ul className="space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      Min 8-12 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      Upper + Lower + Numbers
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      At least one special (@#$%^&*)
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Set Password & Continue
                </button>
              </form>
            </div>
          )}

          {/* Forgot Password */}
          {mode === "forgot" && (
            <div className="animate-slide-in-up">
              <div className="mb-8">
                <Logo size="sm" showText={false} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
              <p className="text-gray-600 mb-8">Enter your email to receive OTP</p>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Send OTP
                </button>

                <p className="text-center text-sm text-gray-600">
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-blue-600 font-semibold"
                  >
                    Back to Login
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
