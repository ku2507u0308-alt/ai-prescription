import { Info, Shield, Bot, QrCode, Users, Bell } from 'lucide-react';

export default function SystemInfo() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200 my-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">About MediGuard AI</h3>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-600" />
            AI-Powered Validation
          </h4>
          <p>
            Our autonomous AI agent validates prescriptions for age/gender suitability, 
            unsafe drug interactions, dosage errors, and allergy risks. The AI provides 
            severity-based warnings without overriding the doctor's decision.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            Prescription Safety Alignment Index
          </h4>
          <p>
            Every prescription receives a Safety Index (0-100) calculated from AI validation results. 
            This transparent metric helps doctors, pharmacists, and patients understand prescription safety.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-purple-600" />
            QR-Verified Digital Prescription
          </h4>
          <p>
            Prescriptions are secured with QR codes containing no personal identifiers. 
            Patients can scan to access medicine information, and pharmacists can verify authenticity.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-600" />
            Smart Reminder System
          </h4>
          <p>
            Patients can track medicine intake (taken/delayed/skipped) with a simple interface. 
            The system helps prevent missed doses without intrusive notifications.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-600" />
            Consent-Based Caregiver Access
          </h4>
          <p>
            Patients can grant caregivers access to adherence data only. Children can monitor 
            elderly patients' medication compliance while respecting privacy.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>Privacy-First Design:</strong> This system does not store personal health information. 
            All data uses anonymous identifiers. The system is designed for demonstration purposes and 
            is not intended for collecting PII or sensitive medical data.
          </p>
        </div>
      </div>
    </div>
  );
}
