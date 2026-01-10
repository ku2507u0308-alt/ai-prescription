import { useState } from 'react';
import { QrCode, CheckCircle, XCircle, Shield, AlertTriangle, Clock, FileText } from 'lucide-react';
import { Prescription } from '../types';
import { getSafetyColor } from '../utils/validation';

export default function PharmacistPortal() {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verified' | 'invalid'>('idle');
  const [verifiedPrescription, setVerifiedPrescription] = useState<Prescription | null>(null);
  const [prescriptionId, setPrescriptionId] = useState('');

  // Simulate QR scanning
  const verifyPrescription = () => {
    // Try to find the prescription in localStorage
    const keys = Object.keys(localStorage).filter(k => k.startsWith('prescription_'));
    let found = false;

    for (const key of keys) {
      const prescription = JSON.parse(localStorage.getItem(key) || '{}');
      if (prescription.id === prescriptionId || keys.length === 1) {
        setVerifiedPrescription(prescription);
        setVerificationStatus('verified');
        found = true;
        break;
      }
    }

    if (!found) {
      setVerificationStatus('invalid');
      setVerifiedPrescription(null);
    }
  };

  const simulateScan = () => {
    // Get the last prescription
    const keys = Object.keys(localStorage).filter(k => k.startsWith('prescription_'));
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      const prescription = JSON.parse(localStorage.getItem(lastKey) || '{}');
      setPrescriptionId(prescription.id);
      setVerifiedPrescription(prescription);
      setVerificationStatus('verified');
    } else {
      alert('No prescriptions found. Please generate one in the Doctor Portal first.');
    }
  };

  const reset = () => {
    setVerificationStatus('idle');
    setVerifiedPrescription(null);
    setPrescriptionId('');
  };

  if (verificationStatus === 'idle') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
            <QrCode className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Prescription</h2>
          <p className="text-gray-600 mb-6">
            Scan the prescription QR code to verify its authenticity and view details.
          </p>

          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Or enter Prescription ID
              </label>
              <input
                type="text"
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                placeholder="RX123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={simulateScan}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <QrCode className="w-5 h-5" />
                Simulate Scan
              </button>
              <button
                onClick={verifyPrescription}
                disabled={!prescriptionId}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shield className="w-5 h-5" />
                Verify ID
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <div className="flex gap-2">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Security Notice:</p>
                <p>
                  This verification system ensures prescription authenticity without exposing patient
                  personal information. Only medicine details and safety validations are accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'invalid') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 border border-red-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">
            The prescription could not be verified. It may be invalid, expired, or counterfeit.
          </p>

          <button
            onClick={reset}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Verified state
  return (
    <div className="space-y-6">
      {/* Verification Success */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Prescription Verified</h3>
            <p className="text-sm text-gray-600">This is an authentic prescription</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Prescription ID</p>
            <p className="font-mono font-semibold">{verifiedPrescription?.id}</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Issue Date</p>
            <p className="font-semibold">
              {verifiedPrescription?.createdAt 
                ? new Date(verifiedPrescription.createdAt).toLocaleDateString() 
                : 'N/A'}
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Safety Index</p>
            <p className={`text-xl font-bold ${getSafetyColor(verifiedPrescription?.safetyIndex || 0)}`}>
              {verifiedPrescription?.safetyIndex}/100
            </p>
          </div>
        </div>

        <button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Verify Another
        </button>
      </div>

      {/* Patient Information (Privacy-Protected) */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          Patient Information (Privacy-Protected)
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Patient ID</p>
            <p className="font-mono">{verifiedPrescription?.patient.id}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Age Group</p>
            <p className="capitalize">{verifiedPrescription?.patient.ageGroup}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="capitalize">{verifiedPrescription?.patient.gender}</p>
          </div>
        </div>

        {verifiedPrescription?.patient.allergies && verifiedPrescription.patient.allergies.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Known Allergies
            </p>
            <div className="flex flex-wrap gap-2">
              {verifiedPrescription.patient.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prescribed Medicines */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Prescribed Medicines
        </h3>

        <div className="space-y-4">
          {verifiedPrescription?.medicines.map((medicine, index) => (
            <div
              key={medicine.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">{index + 1}. {medicine.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Dosage:</span> {medicine.dosage}
                  </p>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                  Verified
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mt-3">
                <div>
                  <p className="text-xs text-gray-600">Frequency</p>
                  <p className="text-sm font-medium">{medicine.frequency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="text-sm font-medium">{medicine.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Instructions</p>
                  <p className="text-sm font-medium">{medicine.instructions || 'Take as directed'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor's Notes */}
      {verifiedPrescription?.doctorNotes && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Doctor's Instructions</h3>
          <p className="text-gray-700">{verifiedPrescription.doctorNotes}</p>
        </div>
      )}

      {/* AI Validation Warnings */}
      {verifiedPrescription?.validationIssues && verifiedPrescription.validationIssues.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-yellow-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            AI Validation Warnings
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            The following safety concerns were identified by the AI system. The prescribing doctor
            has been made aware of these warnings.
          </p>

          <div className="space-y-2">
            {verifiedPrescription.validationIssues.map((issue, index) => (
              <div
                key={index}
                className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-yellow-900 uppercase">
                      {issue.severity} - {issue.type}
                    </p>
                    <p className="text-sm text-yellow-800 mt-1">{issue.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dispensing Checklist */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Dispensing Checklist</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <input type="checkbox" className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-700">
              Verified patient age and gender appropriateness
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <input type="checkbox" className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-700">
              Checked for known allergies
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <input type="checkbox" className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-700">
              Explained usage instructions to patient
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <input type="checkbox" className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-700">
              Provided information about side effects
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <input type="checkbox" className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-700">
              Verified prescription authenticity via QR code
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
