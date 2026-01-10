import { useState } from "react";
import { Prescription } from "../App";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { toast } from "sonner";

interface QRScannerScreenProps {
  onScanComplete: (prescription: Prescription) => void;
  onBack: () => void;
}

export function QRScannerScreen({ onScanComplete, onBack }: QRScannerScreenProps) {
  const [prescriptionId, setPrescriptionId] = useState("");

  const handleManualLookup = () => {
    if (!prescriptionId) {
      toast.error("Please enter a prescription ID");
      return;
    }

    // Look up prescription by ID
    const allPrescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");
    const prescription = allPrescriptions.find((p: Prescription) => p.id === prescriptionId);

    if (prescription) {
      toast.success("Prescription found!");
      onScanComplete(prescription);
    } else {
      toast.error("Prescription not found");
    }
  };

  const handleDemoScan = () => {
    // For demo purposes, just get the first available prescription
    const allPrescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");
    if (allPrescriptions.length > 0) {
      toast.success("QR Code scanned successfully!");
      onScanComplete(allPrescriptions[0]);
    } else {
      toast.error("No prescriptions available in the system");
    }
  };

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

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 animate-slide-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Scan QR Code</h2>
            <p className="text-gray-600">Verify prescription authenticity</p>
          </div>

          {/* QR Scanner Area */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 mb-6 text-center border-2 border-dashed border-gray-400">
            <div className="w-64 h-64 mx-auto bg-white rounded-xl shadow-inner flex items-center justify-center mb-4">
              <div className="text-gray-400">
                <Camera className="w-24 h-24 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm">Camera scanner would appear here</p>
              </div>
            </div>
            
            <button
              onClick={handleDemoScan}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <Camera className="w-5 h-5" />
              Demo: Scan QR Code
            </button>
          </div>

          {/* Manual Entry */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Manual Entry
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the prescription ID if QR scanning is not available
            </p>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                placeholder="Enter Prescription ID"
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleManualLookup}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Lookup
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 bg-gray-100 rounded-xl p-4 border border-gray-300">
            <p className="text-xs text-gray-600 text-center">
              🔐 QR codes ensure prescription authenticity and prevent fraud. Pharmacists can verify doctor's signature and prescription details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
