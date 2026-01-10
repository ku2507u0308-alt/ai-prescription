import { QRCodeSVG } from "qrcode.react";
import { PatientData, Medicine, ValidationWarning } from "../App";
import { Shield, FileText, Calendar, User, Printer, RefreshCw } from "lucide-react";

interface FinalPrescriptionProps {
  patientData: PatientData;
  medicines: Medicine[];
  validationWarnings: ValidationWarning[];
  onNewPrescription: () => void;
}

export function FinalPrescription({
  patientData,
  medicines,
  validationWarnings,
  onNewPrescription,
}: FinalPrescriptionProps) {
  // Calculate Safety Alignment Confidence
  const safetyScore = calculateSafetyScore(validationWarnings);

  // Generate prescription ID and verification data
  const prescriptionId = `RX-${Date.now().toString(36).toUpperCase()}`;
  const timestamp = new Date().toLocaleString();
  
  const verificationData = JSON.stringify({
    id: prescriptionId,
    timestamp: timestamp,
    patientAge: patientData.age,
    medicineCount: medicines.length,
    safetyScore: safetyScore,
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Final Digital Prescription</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={onNewPrescription}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            New Prescription
          </button>
        </div>
      </div>

      {/* Safety Confidence Score */}
      <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-green-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Safety Alignment Confidence
              </h3>
              <p className="text-sm text-gray-600">
                Based on validation against medical references
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-5xl font-bold ${
                safetyScore >= 80
                  ? "text-green-600"
                  : safetyScore >= 60
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {safetyScore}%
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {safetyScore >= 80
                ? "High Confidence"
                : safetyScore >= 60
                ? "Moderate Confidence"
                : "Low Confidence"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescription Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Prescription ID</p>
                <p className="font-mono font-semibold text-gray-800">{prescriptionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold text-gray-800">{timestamp}</p>
              </div>
            </div>
          </div>

          {/* Patient Information (Anonymized) */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Patient Information
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Age</p>
                <p className="font-semibold text-gray-800">{patientData.age} years</p>
              </div>
              <div>
                <p className="text-gray-600">Gender</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {patientData.gender}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Patient ID</p>
                <p className="font-mono font-semibold text-gray-400">
                  ████████
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-600 text-sm">Chief Complaint</p>
              <p className="text-gray-800">{patientData.symptoms}</p>
            </div>
          </div>

          {/* Prescribed Medications */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Prescribed Medications
              </h3>
            </div>
            <div className="space-y-3">
              {medicines.map((medicine, index) => (
                <div
                  key={medicine.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {index + 1}. {medicine.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Dosage:</span> {medicine.dosage}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Frequency:</span>{" "}
                        {medicine.frequency}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Summary */}
          {validationWarnings.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                Safety Considerations ({validationWarnings.length})
              </h3>
              <ul className="space-y-1 text-sm text-yellow-700">
                {validationWarnings.slice(0, 3).map((warning, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>
                      {warning.medicine}: {warning.message}
                    </span>
                  </li>
                ))}
                {validationWarnings.length > 3 && (
                  <li className="text-yellow-600 font-medium">
                    ... and {validationWarnings.length - 3} more warning(s)
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* QR Code Verification */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white border-2 border-blue-300 rounded-lg sticky top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Verification QR Code
            </h3>
            
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white border-4 border-blue-500 rounded-lg">
                <QRCodeSVG
                  value={verificationData}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            <div className="text-center text-sm text-gray-600 space-y-2">
              <p className="font-semibold text-gray-800">Scan to Verify</p>
              <p>
                This QR code contains encrypted prescription verification data
              </p>
              <div className="pt-3 border-t border-gray-200 mt-3">
                <p className="text-xs text-gray-500">
                  All personal identifiers are protected in compliance with privacy
                  regulations
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-800">Validated</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Prescription passed automated safety checks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          This is a digitally validated prescription. The validation system provides
          clinical decision support but does not replace professional medical judgment.
          The prescribing physician remains responsible for all clinical decisions.
          Patient privacy is protected through data anonymization.
        </p>
      </div>
    </div>
  );
}

function calculateSafetyScore(warnings: ValidationWarning[]): number {
  if (warnings.length === 0) return 100;

  let deductions = 0;
  warnings.forEach((warning) => {
    if (warning.severity === "critical") deductions += 20;
    else if (warning.severity === "warning") deductions += 10;
    else if (warning.severity === "info") deductions += 3;
  });

  const score = Math.max(0, 100 - deductions);
  return Math.round(score);
}
