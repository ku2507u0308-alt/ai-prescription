import { useState } from "react";
import { UserRole } from "../App";
import { Logo } from "./Logo";
import { ChevronRight } from "lucide-react";

interface WelcomePageProps {
  onRoleSelect: (role: UserRole) => void;
}

export function WelcomePage({ onRoleSelect }: WelcomePageProps) {
  const [selectedUserType, setSelectedUserType] = useState<"patient" | "pharmacist" | "caregiver">("patient");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-slide-in-up">
        {/* Logo */}
        <div className="mb-12">
          <Logo size="lg" showText={true} animated={true} />
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          {/* Doctor Card */}
          <button
            onClick={() => onRoleSelect("doctor")}
            className="w-full group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-blue-100"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">DOCTOR</h3>
                <p className="text-sm text-gray-600">Healthcare Professional</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChevronRight className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
            </div>
          </button>

          {/* User Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-teal-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">USER</h3>
                <p className="text-sm text-gray-600">Select your role</p>
              </div>
            </div>

            {/* User Type Radio Options */}
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="patient"
                  checked={selectedUserType === "patient"}
                  onChange={(e) => setSelectedUserType(e.target.value as any)}
                  className="w-5 h-5 text-teal-600 focus:ring-teal-500"
                />
                <span className="font-medium text-gray-800">Patient</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="pharmacist"
                  checked={selectedUserType === "pharmacist"}
                  onChange={(e) => setSelectedUserType(e.target.value as any)}
                  className="w-5 h-5 text-teal-600 focus:ring-teal-500"
                />
                <span className="font-medium text-gray-800">Pharmacist</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="caregiver"
                  checked={selectedUserType === "caregiver"}
                  onChange={(e) => setSelectedUserType(e.target.value as any)}
                  className="w-5 h-5 text-teal-600 focus:ring-teal-500"
                />
                <span className="font-medium text-gray-800">Caregiver</span>
              </label>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => onRoleSelect(selectedUserType)}
              className="w-full group bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Secure</span>
            <span>•</span>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Verified</span>
            <span>•</span>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
