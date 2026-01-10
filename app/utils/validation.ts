import { Patient, Medicine, ValidationIssue } from '../types';

// Mock drug interaction database
const drugInteractions: Record<string, string[]> = {
  'Aspirin': ['Warfarin', 'Ibuprofen'],
  'Warfarin': ['Aspirin', 'Vitamin K'],
  'Metformin': ['Alcohol'],
  'Lisinopril': ['Potassium supplements'],
};

// Mock age/gender restrictions
const ageRestrictions: Record<string, string[]> = {
  'Aspirin': ['child'], // Not for children
  'Tetracycline': ['child'],
  'Finasteride': ['female'],
};

// Mock dosage limits
const dosageLimits: Record<string, { max: number; unit: string }> = {
  'Aspirin': { max: 4000, unit: 'mg' },
  'Paracetamol': { max: 4000, unit: 'mg' },
  'Ibuprofen': { max: 3200, unit: 'mg' },
};

export function validatePrescription(
  patient: Patient,
  medicines: Medicine[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check age/gender suitability
  medicines.forEach(medicine => {
    const restrictions = ageRestrictions[medicine.name];
    if (restrictions?.includes(patient.ageGroup)) {
      issues.push({
        severity: 'critical',
        type: 'age',
        message: `${medicine.name} is not recommended for ${patient.ageGroup} patients`,
        medicine: medicine.name,
      });
    }

    if (medicine.name === 'Finasteride' && patient.gender === 'female') {
      issues.push({
        severity: 'high',
        type: 'gender',
        message: `${medicine.name} is contraindicated for female patients`,
        medicine: medicine.name,
      });
    }
  });

  // Check drug interactions
  for (let i = 0; i < medicines.length; i++) {
    for (let j = i + 1; j < medicines.length; j++) {
      const med1 = medicines[i].name;
      const med2 = medicines[j].name;
      
      if (drugInteractions[med1]?.includes(med2)) {
        issues.push({
          severity: 'high',
          type: 'interaction',
          message: `Potential interaction between ${med1} and ${med2}`,
          medicine: `${med1}, ${med2}`,
        });
      }
    }
  }

  // Check dosage
  medicines.forEach(medicine => {
    const limit = dosageLimits[medicine.name];
    if (limit) {
      const dosageValue = parseInt(medicine.dosage);
      if (dosageValue > limit.max) {
        issues.push({
          severity: 'critical',
          type: 'dosage',
          message: `Dosage of ${medicine.name} (${medicine.dosage}) exceeds maximum safe limit (${limit.max}${limit.unit})`,
          medicine: medicine.name,
        });
      }
    }
  });

  // Check allergies
  medicines.forEach(medicine => {
    if (patient.allergies.some(allergy => 
      medicine.name.toLowerCase().includes(allergy.toLowerCase()) ||
      allergy.toLowerCase().includes(medicine.name.toLowerCase())
    )) {
      issues.push({
        severity: 'critical',
        type: 'allergy',
        message: `Patient is allergic to ${medicine.name}`,
        medicine: medicine.name,
      });
    }
  });

  return issues;
}

export function calculateSafetyIndex(issues: ValidationIssue[]): number {
  let score = 100;
  
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'critical':
        score -= 30;
        break;
      case 'high':
        score -= 20;
        break;
      case 'medium':
        score -= 10;
        break;
      case 'low':
        score -= 5;
        break;
    }
  });

  return Math.max(0, score);
}

export function getSafetyColor(index: number): string {
  if (index >= 80) return 'text-green-600';
  if (index >= 60) return 'text-yellow-600';
  if (index >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}
