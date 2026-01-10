import { useState } from 'react';
import { Plus, Trash2, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { Patient, Medicine, Prescription, ValidationIssue } from '../types';
import { validatePrescription, calculateSafetyIndex, getSafetyColor, getSeverityColor } from '../utils/validation';

export default function DoctorPortal() {
  const [patient, setPatient] = useState<Patient>({
    id: 'P' + Date.now(),
    ageGroup: 'adult',
    gender: 'male',
    allergies: [],
  });

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [currentMedicine, setCurrentMedicine] = useState<Partial<Medicine>>({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  const [doctorNotes, setDoctorNotes] = useState('');
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [safetyIndex, setSafetyIndex] = useState<number>(100);
  const [showValidation, setShowValidation] = useState(false);
  const [generatedPrescription, setGeneratedPrescription] = useState<Prescription | null>(null);
  const [allergyInput, setAllergyInput] = useState('');

  const addMedicine = () => {
    if (currentMedicine.name && currentMedicine.dosage) {
      const newMedicine: Medicine = {
        id: 'M' + Date.now(),
        name: currentMedicine.name,
        dosage: currentMedicine.dosage,
        frequency: currentMedicine.frequency || '',
        duration: currentMedicine.duration || '',
        instructions: currentMedicine.instructions || '',
        sideEffects: ['Consult package insert'],
        foodPrecautions: ['Take as directed'],
        allergyWarnings: [],
      };

      setMedicines([...medicines, newMedicine]);
      setCurrentMedicine({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      });
    }
  };

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const runValidation = () => {
    const issues = validatePrescription(patient, medicines);
    const index = calculateSafetyIndex(issues);
    setValidationIssues(issues);
    setSafetyIndex(index);
    setShowValidation(true);
  };

  const generatePrescription = async () => {
    const issues = validatePrescription(patient, medicines);
    const index = calculateSafetyIndex(issues);

    const prescription: Prescription = {
      id: 'RX' + Date.now(),
      patient,
      medicines,
      doctorNotes,
      createdAt: new Date(),
      validationIssues: issues,
      safetyIndex: index,
    };

    // Generate QR code
    try {
      const qrData = JSON.stringify({
        id: prescription.id,
        medicines: prescription.medicines.map(m => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
        })),
        safetyIndex: index,
      });
      const qrCode = await QRCode.toDataURL(qrData);
      prescription.qrCode = qrCode;
    } catch (error) {
      console.error('QR code generation failed', error);
    }

    setGeneratedPrescription(prescription);
    localStorage.setItem(`prescription_${prescription.id}`, JSON.stringify(prescription));
  };

  const addAllergy = () => {
    if (allergyInput && !patient.allergies.includes(allergyInput)) {
      setPatient({
        ...patient,
        allergies: [...patient.allergies, allergyInput],
      });
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setPatient({
      ...patient,
      allergies: patient.allergies.filter(a => a !== allergy),
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Prescription</h2>

        {/* Patient Information */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-lg text-gray-800">Patient Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
              <select
                value={patient.ageGroup}
                onChange={(e) => setPatient({ ...patient, ageGroup: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="child">Child (0-12)</option>
                <option value="adult">Adult (13-64)</option>
                <option value="elderly">Elderly (65+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={patient.gender}
                onChange={(e) => setPatient({ ...patient, gender: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
              <input
                type="text"
                value={patient.id}
                onChange={(e) => setPatient({ ...patient, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Anonymous ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add allergy (e.g., Penicillin)"
              />
              <button
                onClick={addAllergy}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {patient.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {allergy}
                  <button onClick={() => removeAllergy(allergy)} className="hover:text-red-900">
                    <XCircle className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Add Medicine */}
        <div className="space-y-4 mb-6 border-t pt-6">
          <h3 className="font-semibold text-lg text-gray-800">Add Medicines</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
              <input
                type="text"
                value={currentMedicine.name}
                onChange={(e) => setCurrentMedicine({ ...currentMedicine, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Aspirin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
              <input
                type="text"
                value={currentMedicine.dosage}
                onChange={(e) => setCurrentMedicine({ ...currentMedicine, dosage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 500mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <input
                type="text"
                value={currentMedicine.frequency}
                onChange={(e) => setCurrentMedicine({ ...currentMedicine, frequency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Twice daily"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={currentMedicine.duration}
                onChange={(e) => setCurrentMedicine({ ...currentMedicine, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 7 days"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <input
                type="text"
                value={currentMedicine.instructions}
                onChange={(e) => setCurrentMedicine({ ...currentMedicine, instructions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Take after meals"
              />
            </div>
          </div>

          <button
            onClick={addMedicine}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </button>
        </div>

        {/* Medicine List */}
        {medicines.length > 0 && (
          <div className="space-y-3 mb-6 border-t pt-6">
            <h3 className="font-semibold text-lg text-gray-800">Prescribed Medicines</h3>
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Dosage:</span> {medicine.dosage} | 
                    <span className="font-medium"> Frequency:</span> {medicine.frequency} | 
                    <span className="font-medium"> Duration:</span> {medicine.duration}
                  </p>
                  {medicine.instructions && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Instructions:</span> {medicine.instructions}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeMedicine(medicine.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Doctor Notes */}
        <div className="mb-6 border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor's Notes</label>
          <textarea
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional instructions or notes for the patient..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={runValidation}
            disabled={medicines.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AlertTriangle className="w-5 h-5" />
            Run AI Validation
          </button>

          <button
            onClick={generatePrescription}
            disabled={medicines.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5" />
            Generate Prescription
          </button>
        </div>
      </div>

      {/* Validation Results */}
      {showValidation && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">AI Validation Results</h3>
            <div className="text-right">
              <p className="text-sm text-gray-600">Prescription Safety Alignment Index</p>
              <p className={`text-3xl font-bold ${getSafetyColor(safetyIndex)}`}>
                {safetyIndex}/100
              </p>
            </div>
          </div>

          {validationIssues.length === 0 ? (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">No safety concerns detected. Prescription is safe to proceed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {validationIssues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    {issue.severity === 'critical' ? (
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : issue.severity === 'high' ? (
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold uppercase text-xs mb-1">{issue.severity} - {issue.type}</p>
                      <p className="text-sm">{issue.message}</p>
                      {issue.medicine && (
                        <p className="text-xs mt-1 opacity-75">Affected: {issue.medicine}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> These are AI-generated warnings to assist your decision. 
                  The final prescription decision remains with you as the medical professional.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generated Prescription */}
      {generatedPrescription && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Prescription Generated</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Prescription ID</p>
              <p className="font-mono font-semibold text-lg">{generatedPrescription.id}</p>
              
              <p className="text-sm text-gray-600 mt-4 mb-1">Safety Index</p>
              <p className={`text-2xl font-bold ${getSafetyColor(generatedPrescription.safetyIndex)}`}>
                {generatedPrescription.safetyIndex}/100
              </p>

              <p className="text-sm text-gray-600 mt-4">
                This prescription has been saved and can be verified by pharmacists via QR code.
                Patients can scan the QR code to access medicine information and reminders.
              </p>
            </div>

            {generatedPrescription.qrCode && (
              <div className="flex flex-col items-center justify-center">
                <img
                  src={generatedPrescription.qrCode}
                  alt="Prescription QR Code"
                  className="w-48 h-48 border-4 border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  QR Code contains prescription details<br />
                  (No personal identifiers included)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
