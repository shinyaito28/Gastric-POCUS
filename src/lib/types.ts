export type PatientMode = "pediatric" | "adult";
export type RiskLevel = "Low" | "Borderline" | "High";
export type AntralGrade = 0 | 1 | 2;

export interface CalculationResult {
  volume: number;
  volumePerKg: number | null;
}

export interface RiskInfo {
  level: RiskLevel;
  color: string;
  bg: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  mode: PatientMode;
  csa: number;
  age: number; // months for pediatric, years for adult
  weight: number;
  volume: number;
  volumePerKg: number | null;
  riskLevel: RiskLevel | null;
  patientId?: string; // linked patient
}

export interface Measurement {
  id: string;
  timestamp: number;
  csa: number;
  volume: number;
  volumePerKg: number | null;
  riskLevel: RiskLevel | null;
}

export interface Patient {
  id: string;
  name: string;
  mode: PatientMode;
  age: number; // months for pediatric, years for adult
  weight: number;
  measurements: Measurement[];
  createdAt: number;
  updatedAt: number;
}

export interface GradeInfo {
  label: string;
  desc: string;
  color: string;
}

export interface ProtocolStep {
  num: string;
  title: string;
  details: string[];
}
