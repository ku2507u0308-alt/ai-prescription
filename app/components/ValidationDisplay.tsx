import { useEffect } from "react";
import { PatientData, Medicine, ValidationWarning } from "../App";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";

interface ValidationDisplayProps {
  patientData: PatientData;
  medicines: Medicine[];
  onValidationComplete: (warnings: ValidationWarning[]) => void;
  onApprove: () => void;
  onBack: () => void;
}

export function ValidationDisplay({
  patientData,
  medicines,
  onValidationComplete,
  onApprove,
  onBack,
}: ValidationDisplayProps) {
  useEffect(() => {
    const warnings = validatePrescription(patientData, medicines);
    onValidationComplete(warnings);
  }, [patientData, medicines, onValidationComplete]);

  const warnings = validatePrescription(patientData, medicines);
  const criticalCount = warnings.filter((w) => w.severity === "critical").length;
  const warningCount = warnings.filter((w) => w.severity === "warning").length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Safety Validation</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-800">Critical Warnings</span>
          </div>
          <p className="text-3xl font-bold text-red-600 mt-2">{criticalCount}</p>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">Moderate Warnings</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{warningCount}</p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Info Messages</span>
          </div>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {warnings.filter((w) => w.severity === "info").length}
          </p>
        </div>
      </div>

      {/* Warnings List */}
      <div className="space-y-4 mb-6">
        {warnings.length === 0 ? (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              All Safety Checks Passed
            </h3>
            <p className="text-green-700">
              No issues detected in the prescription. All medicines are suitable for this
              patient.
            </p>
          </div>
        ) : (
          warnings.map((warning, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                warning.severity === "critical"
                  ? "bg-red-50 border-red-300"
                  : warning.severity === "warning"
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-blue-50 border-blue-300"
              }`}
            >
              <div className="flex items-start gap-3">
                {warning.severity === "critical" && (
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                {warning.severity === "warning" && (
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                )}
                {warning.severity === "info" && (
                  <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        warning.severity === "critical"
                          ? "bg-red-200 text-red-800"
                          : warning.severity === "warning"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {warning.type.toUpperCase().replace("-", " ")}
                    </span>
                    <span className="font-semibold text-gray-800">{warning.medicine}</span>
                  </div>
                  <p
                    className={`${
                      warning.severity === "critical"
                        ? "text-red-800"
                        : warning.severity === "warning"
                        ? "text-yellow-800"
                        : "text-blue-800"
                    } mb-2`}
                  >
                    {warning.message}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Reason:</span> {warning.reason}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg mb-6">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Important:</span> These warnings are generated
          by an automated system based on standard medical references. They are meant to
          assist, not replace, clinical judgment. The prescribing physician is responsible
          for all final decisions.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Back to Edit
        </button>
        <button
          onClick={onApprove}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Approve & Generate Prescription
        </button>
      </div>
    </div>
  );
}

// Validation logic - Mock medical database checks
function validatePrescription(
  patient: PatientData,
  medicines: Medicine[]
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Mock drug database with contraindications
  const drugDatabase: Record<
    string,
    {
      minAge?: number;
      maxAge?: number;
      contraindications?: string[];
      interactsWith?: string[];
      standardDosages?: string[];
    }
  > = {
    aspirin: {
      minAge: 12,
      contraindications: ["Pregnancy not recommended"],
      interactsWith: ["warfarin", "ibuprofen"],
      standardDosages: ["75mg", "100mg", "325mg"],
    },
    warfarin: {
      contraindications: ["Pregnancy contraindicated"],
      interactsWith: ["aspirin", "ibuprofen", "vitamin k"],
      standardDosages: ["1mg", "2mg", "2.5mg", "5mg"],
    },
    ibuprofen: {
      minAge: 6,
      contraindications: [],
      interactsWith: ["aspirin", "warfarin"],
      standardDosages: ["200mg", "400mg", "600mg", "800mg"],
    },
    metformin: {
      minAge: 18,
      contraindications: [],
      interactsWith: [],
      standardDosages: ["500mg", "850mg", "1000mg"],
    },
    amoxicillin: {
      minAge: 3,
      contraindications: [],
      interactsWith: ["warfarin"],
      standardDosages: ["250mg", "500mg"],
    },
  };

  medicines.forEach((medicine) => {
    const medicineLower = medicine.name.toLowerCase();
    const drugInfo = drugDatabase[medicineLower];

    // Age/Gender suitability check
    if (drugInfo?.minAge && patient.age < drugInfo.minAge) {
      warnings.push({
        type: "age-gender",
        severity: "critical",
        medicine: medicine.name,
        message: `Not recommended for patients under ${drugInfo.minAge} years old.`,
        reason: `Patient is ${patient.age} years old. This medication may have adverse effects in pediatric patients.`,
      });
    }

    if (drugInfo?.maxAge && patient.age > drugInfo.maxAge) {
      warnings.push({
        type: "age-gender",
        severity: "warning",
        medicine: medicine.name,
        message: `Caution advised for patients over ${drugInfo.maxAge} years old.`,
        reason: `Patient is ${patient.age} years old. Dosage adjustment or closer monitoring may be required.`,
      });
    }

    // Check gender-specific contraindications
    if (patient.gender === "female" && drugInfo?.contraindications) {
      drugInfo.contraindications.forEach((contraindication) => {
        warnings.push({
          type: "age-gender",
          severity: "warning",
          medicine: medicine.name,
          message: contraindication,
          reason: "This medication may have special considerations for female patients.",
        });
      });
    }

    // Drug-drug interaction check
    if (drugInfo?.interactsWith) {
      medicines.forEach((otherMed) => {
        const otherLower = otherMed.name.toLowerCase();
        if (
          otherMed.id !== medicine.id &&
          drugInfo.interactsWith?.includes(otherLower)
        ) {
          warnings.push({
            type: "drug-interaction",
            severity: "critical",
            medicine: `${medicine.name} + ${otherMed.name}`,
            message: "Potentially harmful drug interaction detected.",
            reason: `${medicine.name} and ${otherMed.name} may interact, increasing risk of bleeding, reducing efficacy, or causing other adverse effects.`,
          });
        }
      });
    }

    // Dosage validation
    if (drugInfo?.standardDosages) {
      const dosageMatch = drugInfo.standardDosages.some((std) =>
        medicine.dosage.toLowerCase().includes(std.toLowerCase())
      );
      if (!dosageMatch) {
        warnings.push({
          type: "dosage",
          severity: "warning",
          medicine: medicine.name,
          message: "Dosage deviates from standard recommendations.",
          reason: `Standard dosages are: ${drugInfo.standardDosages.join(", ")}. Prescribed: ${
            medicine.dosage
          }. Verify this is appropriate for the patient's condition.`,
        });
      }
    } else if (!drugInfo) {
      // Unknown medication
      warnings.push({
        type: "dosage",
        severity: "info",
        medicine: medicine.name,
        message: "Medication not found in standard database.",
        reason: "Please verify dosage and contraindications manually from appropriate medical references.",
      });
    }
  });

  return warnings;
}
