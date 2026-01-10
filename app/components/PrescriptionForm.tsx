import { useState } from "react";
import { PatientData, Medicine } from "../App";
import { Plus, Trash2, Pill, Clock } from "lucide-react";

interface PrescriptionFormProps {
  patientData: PatientData;
  onSubmit: (medicines: Medicine[]) => void;
  onBack: () => void;
}

export function PrescriptionForm({ patientData, onSubmit, onBack }: PrescriptionFormProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: "1", name: "", dosage: "", frequency: "" },
  ]);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { id: Date.now().toString(), name: "", dosage: "", frequency: "" },
    ]);
  };

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const updateMedicine = (id: string, field: keyof Medicine, value: string) => {
    setMedicines(
      medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validMedicines = medicines.filter((m) => m.name && m.dosage && m.frequency);
    if (validMedicines.length > 0) {
      onSubmit(validMedicines);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Prescription Entry</h2>
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Patient:</span> {patientData.age} years old,{" "}
            {patientData.gender}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {patientData.symptoms.substring(0, 100)}
            {patientData.symptoms.length > 100 && "..."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {medicines.map((medicine, index) => (
            <div
              key={medicine.id}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">Medicine {index + 1}</h3>
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(medicine.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Medicine Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Medicine Name <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={medicine.name}
                    onChange={(e) =>
                      updateMedicine(medicine.id, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Aspirin"
                    required
                  />
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={medicine.dosage}
                    onChange={(e) =>
                      updateMedicine(medicine.id, "dosage", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 500mg"
                    required
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Frequency <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <select
                    value={medicine.frequency}
                    onChange={(e) =>
                      updateMedicine(medicine.id, "frequency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="Every 4 hours">Every 4 hours</option>
                    <option value="Every 6 hours">Every 6 hours</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addMedicine}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Another Medicine
        </button>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Validate Prescription
          </button>
        </div>
      </form>
    </div>
  );
}
