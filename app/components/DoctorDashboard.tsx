import { useState } from "react";
import { Doctor } from "../App";
import { LogOut, Plus } from "lucide-react";
import { Logo } from "./Logo";
import { NewPrescriptionScreen } from "./NewPrescriptionScreen";

interface DoctorDashboardProps {
  user: Doctor;
  onLogout: () => void;
}

type DoctorView = "dashboard" | "new-prescription";

export function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [currentView, setCurrentView] = useState<DoctorView>("dashboard");

  if (currentView === "new-prescription") {
    return (
      <NewPrescriptionScreen
        doctor={user}
        onBack={() => setCurrentView("dashboard")}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <Logo size="sm" showText={false} />
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, Dr. {user.name}</h1>
            <p className="text-gray-600">{user.specialization}</p>
            <p className="text-sm text-gray-500">{user.hospitalName}</p>
          </div>
        </div>

        {/* Main Action Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl p-8 text-white text-center mb-6 animate-slide-in-up">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">Generate New Prescription</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Create AI-validated prescriptions with safety warnings and QR verification
          </p>
          
          <button
            onClick={() => setCurrentView("new-prescription")}
            className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
          >
            Start New Prescription
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
            <p className="text-3xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-600">Prescriptions Today</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
            <p className="text-3xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-600">Total Patients</p>
          </div>
        </div>
      </div>
    </div>
  );
}
