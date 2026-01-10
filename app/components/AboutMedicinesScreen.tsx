import { Prescription } from "../App";
import { ArrowLeft, AlertCircle, Utensils, Pill } from "lucide-react";

interface AboutMedicinesScreenProps {
  prescription: Prescription | null;
  onBack: () => void;
}

// Mock medicine information database
const medicineInfo: Record<string, {
  foodToAvoid: string[];
  allergyWarnings: string[];
  sideEffects: string[];
}> = {
  aspirin: {
    foodToAvoid: ["Alcohol", "Citrus fruits", "Spicy foods"],
    allergyWarnings: ["People with bleeding disorders", "Asthma patients", "Children under 12"],
    sideEffects: ["Stomach upset", "Heartburn", "Nausea"],
  },
  paracetamol: {
    foodToAvoid: ["Alcohol"],
    allergyWarnings: ["Liver disease patients", "Alcohol dependence"],
    sideEffects: ["Rare: Skin rash", "Liver damage (overdose)"],
  },
  amoxicillin: {
    foodToAvoid: ["Grapefruit juice"],
    allergyWarnings: ["Penicillin allergy", "Kidney disease"],
    sideEffects: ["Diarrhea", "Nausea", "Skin rash"],
  },
  ibuprofen: {
    foodToAvoid: ["Alcohol", "Coffee (excessive)"],
    allergyWarnings: ["Asthma", "Heart disease", "High blood pressure"],
    sideEffects: ["Stomach pain", "Heartburn", "Dizziness"],
  },
  default: {
    foodToAvoid: ["Alcohol", "Grapefruit juice"],
    allergyWarnings: ["Check with your doctor if you have any allergies"],
    sideEffects: ["May vary - consult your doctor"],
  },
};

function getMedicineInfo(medicineName: string) {
  const name = medicineName.toLowerCase();
  for (const [key, info] of Object.entries(medicineInfo)) {
    if (name.includes(key)) {
      return info;
    }
  }
  return medicineInfo.default;
}

export function AboutMedicinesScreen({ prescription, onBack }: AboutMedicinesScreenProps) {
  if (!prescription) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 text-center">
            <p className="text-gray-600">No prescription selected</p>
          </div>
        </div>
      </div>
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
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 animate-slide-in-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">About Medicines</h2>
          <p className="text-gray-600 mb-8">Detailed information about your prescribed medicines</p>

          {/* Medicine Cards */}
          <div className="space-y-6">
            {prescription.medicines.map((medicine) => {
              const info = getMedicineInfo(medicine.name);
              
              return (
                <div key={medicine.id} className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border-2 border-blue-200">
                  {/* Medicine Name & Dose */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{medicine.name}</h3>
                      <p className="text-sm text-gray-600">Dose: {medicine.dose} | {medicine.days} days</p>
                    </div>
                  </div>

                  {/* Food to Avoid */}
                  <div className="bg-white rounded-xl p-4 mb-3 border border-orange-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Utensils className="w-5 h-5 text-orange-600" />
                      <h4 className="font-bold text-gray-800">Foods to Avoid</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {info.foodToAvoid.map((food, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Allergy Warnings */}
                  <div className="bg-white rounded-xl p-4 mb-3 border border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h4 className="font-bold text-gray-800">Allergy Warnings</h4>
                    </div>
                    <ul className="space-y-2">
                      {info.allergyWarnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Side Effects */}
                  <div className="bg-white rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-bold text-gray-800">Possible Side Effects</h4>
                    </div>
                    <ul className="space-y-2">
                      {info.sideEffects.map((effect, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0"></div>
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Precautions from prescription */}
                  {medicine.precautions && (
                    <div className="mt-3 bg-blue-100 rounded-xl p-4 border border-blue-300">
                      <p className="text-sm font-semibold text-gray-800 mb-1">Doctor's Note:</p>
                      <p className="text-sm text-gray-700">{medicine.precautions}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 bg-gray-100 rounded-xl p-4 border border-gray-300">
            <p className="text-xs text-gray-600 text-center">
              ⚠️ This information is for educational purposes only. Always consult your doctor or pharmacist for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
