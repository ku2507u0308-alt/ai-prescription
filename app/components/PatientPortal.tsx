import { useState, useEffect } from 'react';
import { QrCode, Clock, Check, AlertCircle, Users, Info, Pill, Calendar } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { Prescription, MedicineIntake, CaregiverAccess } from '../types';
import { getSafetyColor } from '../utils/validation';

export default function PatientPortal() {
  const [scannedPrescription, setScannedPrescription] = useState<Prescription | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [intakeRecords, setIntakeRecords] = useState<MedicineIntake[]>([]);
  const [caregivers, setCaregivers] = useState<CaregiverAccess[]>([]);
  const [newCaregiverName, setNewCaregiverName] = useState('');
  const [selectedView, setSelectedView] = useState<'overview' | 'reminders' | 'caregivers'>('overview');

  // Simulate QR scanning (in real app, would use camera)
  const simulateScan = () => {
    // Get the last prescription from localStorage
    const keys = Object.keys(localStorage).filter(k => k.startsWith('prescription_'));
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      const prescription = JSON.parse(localStorage.getItem(lastKey) || '{}');
      loadPrescription(prescription);
    } else {
      alert('No prescriptions found. Please generate one in the Doctor Portal first.');
    }
  };

  const loadPrescription = (prescription: Prescription) => {
    setScannedPrescription(prescription);
    setShowScanner(false);
    
    // Generate sample reminders
    const now = new Date();
    const reminders: MedicineIntake[] = [];
    
    prescription.medicines.forEach(medicine => {
      // Create sample reminder for today
      reminders.push({
        prescriptionId: prescription.id,
        medicineId: medicine.id,
        scheduledTime: new Date(now.getTime() + 3600000), // 1 hour from now
        status: 'pending',
      });
    });
    
    setIntakeRecords(reminders);
  };

  const markIntake = (medicineId: string, status: 'taken' | 'delayed' | 'skipped') => {
    setIntakeRecords(intakeRecords.map(record => 
      record.medicineId === medicineId && record.status === 'pending'
        ? { ...record, status, actualTime: new Date() }
        : record
    ));
  };

  const addCaregiver = () => {
    if (newCaregiverName && scannedPrescription) {
      const newCaregiver: CaregiverAccess = {
        patientId: scannedPrescription.patient.id,
        caregiverId: 'C' + Date.now(),
        caregiverName: newCaregiverName,
        accessGrantedAt: new Date(),
        consentGiven: true,
      };
      setCaregivers([...caregivers, newCaregiver]);
      setNewCaregiverName('');
    }
  };

  const removeCaregiver = (caregiverId: string) => {
    setCaregivers(caregivers.filter(c => c.caregiverId !== caregiverId));
  };

  if (!scannedPrescription) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <QrCode className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan Your Prescription</h2>
          <p className="text-gray-600 mb-6">
            Scan the QR code on your prescription to access medicine information, set up reminders,
            and track your medication adherence.
          </p>
          
          <button
            onClick={simulateScan}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <QrCode className="w-5 h-5" />
            Simulate QR Scan (Demo)
          </button>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Privacy Notice:</p>
                <p>Your prescription QR code contains only medicine information and instructions. 
                No personal health information or identifiers are stored in the QR code.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              selectedView === 'overview'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Pill className="w-4 h-4 inline mr-2" />
            Medicine Info
          </button>
          <button
            onClick={() => setSelectedView('reminders')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              selectedView === 'reminders'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Reminders
          </button>
          <button
            onClick={() => setSelectedView('caregivers')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              selectedView === 'caregivers'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Caregivers
          </button>
        </div>
      </div>

      {/* Overview */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Prescription Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Your Prescription</h3>
              <div className="text-right">
                <p className="text-sm text-gray-600">Safety Index</p>
                <p className={`text-2xl font-bold ${getSafetyColor(scannedPrescription.safetyIndex)}`}>
                  {scannedPrescription.safetyIndex}/100
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Prescription ID:</span> {scannedPrescription.id}
            </p>

            {scannedPrescription.doctorNotes && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm font-medium text-blue-900 mb-1">Doctor's Instructions:</p>
                <p className="text-sm text-blue-800">{scannedPrescription.doctorNotes}</p>
              </div>
            )}
          </div>

          {/* Medicines */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Medicines</h3>
            {scannedPrescription.medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
              >
                <h4 className="font-bold text-lg text-gray-900 mb-3">{medicine.name}</h4>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Dosage</p>
                    <p className="text-gray-900">{medicine.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Frequency</p>
                    <p className="text-gray-900">{medicine.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Duration</p>
                    <p className="text-gray-900">{medicine.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Instructions</p>
                    <p className="text-gray-900">{medicine.instructions || 'Take as directed'}</p>
                  </div>
                </div>

                {medicine.foodPrecautions && medicine.foodPrecautions.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-2">
                    <p className="text-sm font-medium text-yellow-900 mb-1">Food Precautions:</p>
                    <ul className="text-sm text-yellow-800 list-disc list-inside">
                      {medicine.foodPrecautions.map((precaution, idx) => (
                        <li key={idx}>{precaution}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {medicine.allergyWarnings && medicine.allergyWarnings.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-900 mb-1">Allergy Warnings:</p>
                    <ul className="text-sm text-red-800 list-disc list-inside">
                      {medicine.allergyWarnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminders */}
      {selectedView === 'reminders' && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Medicine Reminders</h3>
          
          {intakeRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No reminders set yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {intakeRecords.map((record) => {
                const medicine = scannedPrescription.medicines.find(m => m.medicineId === record.medicineId);
                if (!medicine) return null;

                return (
                  <div
                    key={`${record.medicineId}-${record.scheduledTime.toString()}`}
                    className={`p-4 rounded-lg border ${
                      record.status === 'taken'
                        ? 'bg-green-50 border-green-200'
                        : record.status === 'delayed'
                        ? 'bg-yellow-50 border-yellow-200'
                        : record.status === 'skipped'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{medicine.name}</p>
                        <p className="text-sm text-gray-600">
                          {medicine.dosage} - {medicine.frequency}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Scheduled: {record.scheduledTime.toLocaleTimeString()}
                        </p>
                        {record.actualTime && (
                          <p className="text-xs text-gray-500">
                            Recorded: {record.actualTime.toLocaleTimeString()}
                          </p>
                        )}
                      </div>

                      {record.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => markIntake(record.medicineId, 'taken')}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => markIntake(record.medicineId, 'delayed')}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => markIntake(record.medicineId, 'skipped')}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === 'taken'
                            ? 'bg-green-200 text-green-800'
                            : record.status === 'delayed'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {record.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Caregivers */}
      {selectedView === 'caregivers' && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Caregiver Access</h3>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Grant access to caregivers to help monitor your medication adherence. 
              Only adherence data (taken/delayed/skipped) will be shared. No personal health information.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Caregiver</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCaregiverName}
                onChange={(e) => setNewCaregiverName(e.target.value)}
                placeholder="Caregiver name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={addCaregiver}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>

          {caregivers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No caregivers added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {caregivers.map((caregiver) => (
                <div
                  key={caregiver.caregiverId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{caregiver.caregiverName}</p>
                    <p className="text-sm text-gray-600">
                      Access granted: {caregiver.accessGrantedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeCaregiver(caregiver.caregiverId)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
