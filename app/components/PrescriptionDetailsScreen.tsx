import { useState } from "react";
import { Prescription } from "../App";
import { ArrowLeft, Send, Shield, AlertTriangle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

interface PrescriptionDetailsScreenProps {
  prescription: Prescription;
  onBack: () => void;
}

export function PrescriptionDetailsScreen({
  prescription,
  onBack,
}: PrescriptionDetailsScreenProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSendToPatient = () => {
    setIsSending(true);
    
    // Simulate sending
    setTimeout(() => {
      toast.success(`Prescription sent to ${prescription.patientPhone}`);
      setIsSending(false);
      
      // After sending, go back
      setTimeout(() => {
        onBack();
      }, 1500);
    }, 1000);
  };

  const qrData = JSON.stringify({
    id: prescription.id,
    doctorName: prescription.doctorName,
    hospital: prescription.hospitalName,
    date: prescription.date,
    patientPhone: prescription.patientPhone,
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
          <span className="font-medium">Back</span>
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
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Prescription Generated</h2>
            <p className="text-gray-600">Review and send to patient</p>
          </div>

          {/* Prescription Details */}
          <div className="space-y-6">
            {/* Doctor & Hospital Info */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">Doctor Information</h3>
              <p className="text-sm text-gray-700">Dr. {prescription.doctorName}</p>
              <p className="text-sm text-gray-600">{prescription.hospitalName}</p>
              <p className="text-sm text-gray-600">Date: {new Date(prescription.date).toLocaleDateString()}</p>
            </div>

            {/* Patient Info */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">Patient Information</h3>
              <p className="text-sm text-gray-700">Phone: {prescription.patientPhone}</p>
              <p className="text-sm text-gray-700">Age: {prescription.patientAge} years</p>
              <p className="text-sm text-gray-700 capitalize">Gender: {prescription.patientGender}</p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold">Symptoms:</span> {prescription.symptoms}
              </p>
            </div>

            {/* Medicines */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Prescribed Medicines</h3>
              <div className="space-y-3">
                {prescription.medicines.map((medicine, index) => (
                  <div key={medicine.id} className="bg-white border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{medicine.name}</p>
                        <p className="text-sm text-gray-600">Dose: {medicine.dose}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-600">{medicine.days} days</p>
                        <p className="text-xs text-gray-600 capitalize">{medicine.timing} food</p>
                      </div>
                    </div>
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

            {/* Warnings */}
            {prescription.warnings && prescription.warnings.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-bold text-yellow-900">Safety Warnings</h3>
                </div>
                <div className="space-y-2">
                  {prescription.warnings.map((warning, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-semibold text-gray-800">{warning.medicine}</p>
                      <p className="text-gray-700">{warning.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QR Code */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center border-2 border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3">Verification QR Code</h3>
              <div className="bg-white p-4 rounded-xl inline-block shadow-md">
                <QRCodeSVG value={qrData} size={200} level="H" />
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Scan to verify authenticity
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Prescription ID: {prescription.id}
              </p>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendToPatient}
              disabled={isSending}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {isSending ? "Sending..." : "Send to Patient"}
            </button>

            <p className="text-xs text-center text-gray-500">
              Patient will receive prescription details via SMS to {prescription.patientPhone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
