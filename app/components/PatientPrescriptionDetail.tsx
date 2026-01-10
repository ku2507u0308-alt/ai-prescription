import { Prescription } from "../App";
import { ArrowLeft, Info, Bell, BarChart3, Shield } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PatientPrescriptionDetailProps {
  prescription: Prescription;
  onBack: () => void;
  onSetupReminders: () => void;
  onViewAnalysis: () => void;
  onAboutMedicines: () => void;
}

export function PatientPrescriptionDetail({
  prescription,
  onBack,
  onSetupReminders,
  onViewAnalysis,
  onAboutMedicines,
}: PatientPrescriptionDetailProps) {
  const qrData = JSON.stringify({
    id: prescription.id,
    doctorName: prescription.doctorName,
    hospital: prescription.hospitalName,
    date: prescription.date,
    medicines: prescription.medicines.map((m) => ({
      name: m.name,
      dose: m.dose,
      days: m.days,
    })),
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Prescriptions</span>
        </button>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 animate-slide-in-up">
          {/* Safety Score */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${
              prescription.safetyScore! >= 85
                ? "bg-green-100 text-green-700"
                : prescription.safetyScore! >= 70
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}>
              <Shield className="w-4 h-4" />
              Safety Alignment: {prescription.safetyScore}%
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Prescription Details</h2>
            <p className="text-gray-600">{new Date(prescription.date).toLocaleDateString()}</p>
          </div>

          {/* Doctor & Hospital */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Prescribed By</h3>
            <p className="text-sm text-gray-700">Dr. {prescription.doctorName}</p>
            <p className="text-sm text-gray-600">{prescription.hospitalName}</p>
          </div>

          {/* Medicines */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Prescribed Medicines</h3>
            <div className="space-y-3">
              {prescription.medicines.map((medicine) => (
                <div key={medicine.id} className="bg-white border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-bold text-gray-800 text-lg">{medicine.name}</p>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600">{medicine.days} days</p>
                      <p className="text-xs text-gray-600 capitalize">{medicine.timing} food</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Dose: {medicine.dose}</p>
                  {medicine.precautions && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Precautions:</span> {medicine.precautions}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center border-2 border-gray-200 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Prescription QR Code</h3>
            <div className="bg-white p-4 rounded-xl inline-block shadow-md">
              <QRCodeSVG value={qrData} size={180} level="H" />
            </div>
            <p className="text-xs text-gray-500 mt-3">Show this to pharmacist for verification</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onAboutMedicines}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Info className="w-5 h-5" />
              About Medicines
            </button>

            <button
              onClick={onSetupReminders}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Bell className="w-5 h-5" />
              Setup Reminders
            </button>

            <button
              onClick={onViewAnalysis}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
