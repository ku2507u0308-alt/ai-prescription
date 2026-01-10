import { Prescription } from "../App";
import { ArrowLeft, Calendar, User } from "lucide-react";

interface PatientPrescriptionListProps {
  prescriptions: Prescription[];
  onSelectPrescription: (prescription: Prescription) => void;
  onBack: () => void;
}

export function PatientPrescriptionList({
  prescriptions,
  onSelectPrescription,
  onBack,
}: PatientPrescriptionListProps) {
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
          <h2 className="text-3xl font-bold text-gray-800 mb-6">All Prescriptions</h2>

          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No prescriptions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <button
                  key={prescription.id}
                  onClick={() => onSelectPrescription(prescription)}
                  className="w-full p-5 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl border-2 border-blue-200 hover:shadow-lg hover:scale-[1.02] transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-gray-800">
                        {new Date(prescription.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      prescription.safetyScore! >= 85
                        ? "bg-green-100 text-green-700"
                        : prescription.safetyScore! >= 70
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {prescription.safetyScore}% Safe
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Dr. {prescription.doctorName}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{prescription.hospitalName}</p>
                  
                  <div className="bg-white rounded-xl p-3 border border-blue-200">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      {prescription.medicines.length} Medicine(s):
                    </p>
                    <div className="space-y-1">
                      {prescription.medicines.slice(0, 3).map((med) => (
                        <p key={med.id} className="text-sm text-gray-700">
                          • {med.name} - {med.dose} for {med.days} days
                        </p>
                      ))}
                      {prescription.medicines.length > 3 && (
                        <p className="text-sm text-blue-600 font-medium">
                          +{prescription.medicines.length - 3} more...
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
