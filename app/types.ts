export interface Patient {
  id: string;
  ageGroup: 'child' | 'adult' | 'elderly';
  gender: 'male' | 'female' | 'other';
  allergies: string[];
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  sideEffects?: string[];
  foodPrecautions?: string[];
  allergyWarnings?: string[];
}

export interface ValidationIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'age' | 'gender' | 'interaction' | 'dosage' | 'allergy';
  message: string;
  medicine?: string;
}

export interface Prescription {
  id: string;
  patient: Patient;
  medicines: Medicine[];
  doctorNotes: string;
  createdAt: Date;
  validationIssues: ValidationIssue[];
  safetyIndex: number; // 0-100
  qrCode?: string;
}

export interface MedicineIntake {
  prescriptionId: string;
  medicineId: string;
  scheduledTime: Date;
  status: 'pending' | 'taken' | 'delayed' | 'skipped';
  actualTime?: Date;
}

export interface CaregiverAccess {
  patientId: string;
  caregiverId: string;
  caregiverName: string;
  accessGrantedAt: Date;
  consentGiven: boolean;
}
