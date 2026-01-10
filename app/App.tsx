import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { WelcomePage } from "./components/WelcomePage";
import { DoctorAuth } from "./components/DoctorAuth";
import { UserAuth } from "./components/UserAuth";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { PatientDashboard } from "./components/PatientDashboard";

export type UserRole = "doctor" | "patient" | "pharmacist" | "caregiver" | null;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  password?: string;
}

export interface Doctor extends User {
  role: "doctor";
  medicalCouncilNo: string;
  specialization: string;
  hospitalName: string;
  licenseNumber: string;
  verified: boolean;
}

export interface Patient extends User {
  role: "patient" | "pharmacist" | "caregiver";
  dateOfBirth?: string;
  allergies?: string[];
}

export interface Medicine {
  id: string;
  name: string;
  dose: string;
  days: number;
  timing: "before" | "after";
  precautions?: string;
}

export interface Prescription {
  id: string;
  date: string;
  doctorId: string;
  doctorName: string;
  hospitalName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: "male" | "female" | "other";
  symptoms: string;
  medicines: Medicine[];
  warnings?: Array<{
    type: "age-risk" | "interaction" | "mismatch";
    severity: "low" | "medium" | "high";
    message: string;
    medicine?: string;
  }>;
  safetyScore?: number;
  qrCode?: string;
}

export interface MedicineReminder {
  prescriptionId: string;
  medicineId: string;
  medicineName: string;
  dose: string;
  time: string;
  status: "pending" | "taken" | "delayed" | "missed";
  date: string;
}

type AppState = 
  | { screen: "welcome" }
  | { screen: "doctor-auth"; mode: "signin" | "signup" | "forgot" }
  | { screen: "user-auth"; mode: "signin" | "signup" }
  | { screen: "doctor-dashboard"; user: Doctor }
  | { screen: "patient-dashboard"; user: Patient };

export default function App() {
  const [appState, setAppState] = useState<AppState>({ screen: "welcome" });

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.role === "doctor") {
        setAppState({ screen: "doctor-dashboard", user });
      } else {
        setAppState({ screen: "patient-dashboard", user });
      }
    }
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    if (role === "doctor") {
      setAppState({ screen: "doctor-auth", mode: "signin" });
    } else {
      setAppState({ screen: "user-auth", mode: "signin" });
    }
  };

  const handleDoctorAuthComplete = (doctor: Doctor) => {
    localStorage.setItem("currentUser", JSON.stringify(doctor));
    setAppState({ screen: "doctor-dashboard", user: doctor });
  };

  const handleUserAuthComplete = (user: Patient) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    setAppState({ screen: "patient-dashboard", user });
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setAppState({ screen: "welcome" });
  };

  const handleBackToWelcome = () => {
    setAppState({ screen: "welcome" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Toaster position="top-center" richColors />
      
      {appState.screen === "welcome" && (
        <WelcomePage onRoleSelect={handleRoleSelect} />
      )}

      {appState.screen === "doctor-auth" && (
        <DoctorAuth
          initialMode={appState.mode}
          onAuthComplete={handleDoctorAuthComplete}
          onBack={handleBackToWelcome}
        />
      )}

      {appState.screen === "user-auth" && (
        <UserAuth
          initialMode={appState.mode}
          onAuthComplete={handleUserAuthComplete}
          onBack={handleBackToWelcome}
        />
      )}

      {appState.screen === "doctor-dashboard" && (
        <DoctorDashboard user={appState.user} onLogout={handleLogout} />
      )}

      {appState.screen === "patient-dashboard" && (
        <PatientDashboard user={appState.user} onLogout={handleLogout} />
      )}
    </div>
  );
}
