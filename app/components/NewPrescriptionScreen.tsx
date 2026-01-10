import { useState } from "react";
import { Doctor, Medicine, Prescription } from "../App";
import { ArrowLeft, Plus, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PrescriptionDetailsScreen } from "./PrescriptionDetailsScreen";

interface NewPrescriptionScreenProps {
  doctor: Doctor;
  onBack: () => void;
}

type PrescriptionView = "form" | "details";

export function NewPrescriptionScreen({ doctor, onBack }: NewPrescriptionScreenProps) {
  const [currentView, setCurrentView] = useState<PrescriptionView>("form");
  const [generatedPrescription, setGeneratedPrescription] = useState<Prescription | null>(null);
  
  const [formData, setFormData] = useState({
    patientPhone: "",
    patientAge: "",
    patientGender: "male" as "male" | "female" | "other",
    symptoms: "",
  });

  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "",
      dose: "1-0-1",
      days: 5,
      timing: "after" as const,
      precautions: "",
    },
  ]);

  const [warnings, setWarnings] = useState<Prescription["warnings"]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMedicineChange = (id: string, field: keyof Medicine, value: any) => {
    setMedicines(medicines.map((med) => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: Date.now().toString(),
        name: "",
        dose: "1-0-1",
        days: 5,
        timing: "after",
        precautions: "",
      },
    ]);
  };

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  const validatePrescription = () => {
    const detectedWarnings: Prescription["warnings"] = [];

    // Mock AI validation logic
    medicines.forEach((med) => {
      const medName = med.name.toLowerCase();
      const age = parseInt(formData.patientAge);

      // Age risk detection
      if (medName.includes("aspirin") && age < 12) {
        detectedWarnings.push({
          type: "age-risk",
          severity: "high",
          message: `Aspirin is not recommended for children under 12 years old due to risk of Reye's syndrome.`,
          medicine: med.name,
        });
      }

      // Drug interaction detection
      if (medName.includes("warfarin") && medicines.some((m) => m.name.toLowerCase().includes("aspirin"))) {
        detectedWarnings.push({
          type: "interaction",
          severity: "high",
          message: `Warfarin and Aspirin together may increase bleeding risk. Monitor INR closely.`,
          medicine: med.name,
        });
      }

      // Symptom mismatch detection
      if (formData.symptoms.toLowerCase().includes("fever") && medName.includes("antacid")) {
        detectedWarnings.push({
          type: "mismatch",
          severity: "medium",
          message: `Antacids are typically not prescribed for fever. Please verify if this is intentional.`,
          medicine: med.name,
        });
      }

      // Allergy warning for common allergens
      if (medName.includes("penicillin")) {
        detectedWarnings.push({
          type: "age-risk",
          severity: "medium",
          message: `Penicillin: Check patient for penicillin allergy before administration.`,
          medicine: med.name,
        });
      }
    });

    setWarnings(detectedWarnings);
    return detectedWarnings;
  };

  const handleGeneratePrescription = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientPhone || !formData.patientAge || !formData.symptoms) {
      toast.error("Please fill all required fields");
      return;
    }

    if (medicines.some((med) => !med.name)) {
      toast.error("Please enter all medicine names");
      return;
    }

    // Validate and get warnings
    const detectedWarnings = validatePrescription();

    // Calculate safety score
    const safetyScore = Math.max(0, 100 - detectedWarnings.length * 15);

    // Generate prescription
    const prescription: Prescription = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      doctorId: doctor.id,
      doctorName: doctor.name,
      hospitalName: doctor.hospitalName,
      patientPhone: formData.patientPhone,
      patientAge: parseInt(formData.patientAge),
      patientGender: formData.patientGender,
      symptoms: formData.symptoms,
      medicines: medicines,
      warnings: detectedWarnings,
      safetyScore: safetyScore,
    };

    // Save to localStorage
    const prescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");
    prescriptions.push(prescription);
    localStorage.setItem("prescriptions", JSON.stringify(prescriptions));

    if (detectedWarnings.length > 0) {
      toast.warning(`${detectedWarnings.length} safety warning(s) detected`);
    } else {
      toast.success("Prescription generated successfully!");
    }

    setGeneratedPrescription(prescription);
    setCurrentView("details");
  };

  if (currentView === "details" && generatedPrescription) {
    return (
      <PrescriptionDetailsScreen
        prescription={generatedPrescription}
        onBack={() => {
          setCurrentView("form");
          onBack();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">New Prescription</h2>
          <p className="text-gray-600 mb-2">{doctor.hospitalName}</p>
          <p className="text-sm text-gray-500 mb-6">Date: {new Date().toLocaleDateString()}</p>

          <form onSubmit={handleGeneratePrescription} className="space-y-6">
            {/* Patient Mobile Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Patient Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.patientPhone}
                onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Symptoms <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.symptoms}
                onChange={(e) => handleInputChange("symptoms", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                rows={3}
                placeholder="Describe patient symptoms..."
                required
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.patientAge}
                  onChange={(e) => handleInputChange("patientAge", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="25"
                  required
                  min="0"
                  max="150"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.patientGender}
                  onChange={(e) => handleInputChange("patientGender", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Medicines */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Medicines <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Medicine
                </button>
              </div>

              <div className="space-y-4">
                {medicines.map((medicine, index) => (
                  <div key={medicine.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Medicine {index + 1}</span>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(medicine.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) => handleMedicineChange(medicine.id, "name", e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Medicine name"
                        required
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Dose</label>
                          <input
                            type="text"
                            value={medicine.dose}
                            onChange={(e) => handleMedicineChange(medicine.id, "dose", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            placeholder="1-0-1"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Days</label>
                          <input
                            type="number"
                            value={medicine.days}
                            onChange={(e) => handleMedicineChange(medicine.id, "days", parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            min="1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Timing</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleMedicineChange(medicine.id, "timing", "before")}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                              medicine.timing === "before"
                                ? "bg-blue-500 text-white"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Before Food
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMedicineChange(medicine.id, "timing", "after")}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                              medicine.timing === "after"
                                ? "bg-blue-500 text-white"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            After Food
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Precautions (Optional)</label>
                        <textarea
                          value={medicine.precautions}
                          onChange={(e) => handleMedicineChange(medicine.id, "precautions", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm"
                          rows={2}
                          placeholder="E.g., Avoid alcohol, dairy products..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Safety Warnings */}
            {warnings.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-yellow-900 mb-1">AI Safety Warnings</h3>
                    <p className="text-sm text-yellow-700">
                      {warnings.length} potential issue(s) detected. Review before proceeding.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {warnings.map((warning, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 ${
                        warning.severity === "high"
                          ? "bg-red-50 border-red-300"
                          : warning.severity === "medium"
                          ? "bg-orange-50 border-orange-300"
                          : "bg-yellow-50 border-yellow-300"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            warning.severity === "high"
                              ? "bg-red-200 text-red-800"
                              : warning.severity === "medium"
                              ? "bg-orange-200 text-orange-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {warning.severity.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 mb-1">{warning.medicine}</p>
                          <p className="text-sm text-gray-700">{warning.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-yellow-700 mt-4 italic">
                  ⚠️ Non-blocking warnings - Doctor retains final decision authority
                </p>
              </div>
            )}

            {/* Generate Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Generate Prescription
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
