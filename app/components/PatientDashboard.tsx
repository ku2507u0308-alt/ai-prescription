import { useState, useEffect } from "react";
import { Patient, Prescription } from "../App";
import { LogOut, FileText, QrCode, Bell, BarChart3, Info } from "lucide-react";
import { Logo } from "./Logo";
import { PatientPrescriptionList } from "./PatientPrescriptionList";
import { PatientPrescriptionDetail } from "./PatientPrescriptionDetail";
import { AboutMedicinesScreen } from "./AboutMedicinesScreen";
import { RemindersScreen } from "./RemindersScreen";
import { AnalysisScreen } from "./AnalysisScreen";
import { QRScannerScreen } from "./QRScannerScreen";

interface PatientDashboardProps {
  user: Patient;
  onLogout: () => void;
}

type PatientView = 
  | "dashboard"
  | "prescriptions"
  | "prescription-detail"
  | "about-medicines"
  | "reminders"
  | "analysis"
  | "qr-scanner";

export function PatientDashboard({ user, onLogout }: PatientDashboardProps) {
  const [currentView, setCurrentView] = useState<PatientView>("dashboard");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    // Load prescriptions for this user
    const allPrescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");
    const userPrescriptions = allPrescriptions.filter(
      (p: Prescription) => p.patientPhone === user.phone
    );
    setPrescriptions(userPrescriptions);
  }, [user.phone]);

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setCurrentView("prescription-detail");
  };

  // Render different views
  if (currentView === "prescriptions") {
    return (
      <PatientPrescriptionList
        prescriptions={prescriptions}
        onSelectPrescription={handleViewPrescription}
        onBack={() => setCurrentView("dashboard")}
      />
    );
  }

  if (currentView === "prescription-detail" && selectedPrescription) {
    return (
      <PatientPrescriptionDetail
        prescription={selectedPrescription}
        onBack={() => setCurrentView("prescriptions")}
        onSetupReminders={() => setCurrentView("reminders")}
        onViewAnalysis={() => setCurrentView("analysis")}
        onAboutMedicines={() => setCurrentView("about-medicines")}
      />
    );
  }

  if (currentView === "about-medicines" && selectedPrescription) {
    return (
      <AboutMedicinesScreen
        prescription={selectedPrescription}
        onBack={() => setCurrentView("prescription-detail")}
      />
    );
  }

  if (currentView === "reminders") {
    return (
      <RemindersScreen
        prescription={selectedPrescription}
        onBack={() => setCurrentView(selectedPrescription ? "prescription-detail" : "dashboard")}
      />
    );
  }

  if (currentView === "analysis") {
    return (
      <AnalysisScreen
        prescription={selectedPrescription}
        onBack={() => setCurrentView(selectedPrescription ? "prescription-detail" : "dashboard")}
      />
    );
  }

  if (currentView === "qr-scanner") {
    return (
      <QRScannerScreen
        onScanComplete={handleViewPrescription}
        onBack={() => setCurrentView("dashboard")}
      />
    );
  }

  // Dashboard View
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
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h1>
            <p className="text-gray-600 capitalize">{user.role}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setCurrentView("prescriptions")}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all border border-white/20 text-center group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-800">My Prescriptions</p>
            <p className="text-sm text-gray-600 mt-1">{prescriptions.length} total</p>
          </button>

          <button
            onClick={() => setCurrentView("qr-scanner")}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all border border-white/20 text-center group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-800">Scan QR Code</p>
            <p className="text-sm text-gray-600 mt-1">Verify prescription</p>
          </button>

          <button
            onClick={() => setCurrentView("reminders")}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all border border-white/20 text-center group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-800">Reminders</p>
            <p className="text-sm text-gray-600 mt-1">Medication alerts</p>
          </button>

          <button
            onClick={() => setCurrentView("analysis")}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all border border-white/20 text-center group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-800">Analysis</p>
            <p className="text-sm text-gray-600 mt-1">Adherence tracking</p>
          </button>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Prescriptions</h2>
          
          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">No prescriptions yet</p>
              <p className="text-sm text-gray-500">Your prescriptions will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {prescriptions.slice(0, 3).map((prescription) => (
                <button
                  key={prescription.id}
                  onClick={() => handleViewPrescription(prescription)}
                  className="w-full p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-200 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">
                      {new Date(prescription.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-600">Dr. {prescription.doctorName}</span>
                  </div>
                  <p className="text-sm text-gray-700">{prescription.hospitalName}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {prescription.medicines.length} medicine(s) prescribed
                  </p>
                </button>
              ))}
              
              {prescriptions.length > 3 && (
                <button
                  onClick={() => setCurrentView("prescriptions")}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  View All Prescriptions
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
