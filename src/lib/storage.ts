import type { HistoryEntry, Patient, Measurement, PatientMode, RiskLevel } from "./types";
import { HISTORY_MAX } from "./constants";

const HISTORY_KEY = "gastric-us-history";
const PATIENTS_KEY = "gastric-us-patients";
const PREFS_KEY = "gastric-us-prefs";

// --- History ---

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: Omit<HistoryEntry, "id" | "timestamp">): HistoryEntry {
  const history = getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  // Dedup: skip if same inputs within 5 seconds
  const recent = history[0];
  if (
    recent &&
    Date.now() - recent.timestamp < 5000 &&
    recent.csa === entry.csa &&
    recent.age === entry.age &&
    recent.weight === entry.weight &&
    recent.mode === entry.mode
  ) {
    return recent;
  }

  const updated = [newEntry, ...history].slice(0, HISTORY_MAX);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return newEntry;
}

export function deleteHistoryEntry(id: string): void {
  const updated = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// --- Patients ---

export function getPatients(): Patient[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PATIENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function savePatients(patients: Patient[]): void {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
}

export function addPatient(patient: Omit<Patient, "id" | "measurements" | "createdAt" | "updatedAt">): Patient {
  const patients = getPatients();
  const newPatient: Patient = {
    ...patient,
    id: crypto.randomUUID(),
    measurements: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  savePatients([newPatient, ...patients]);
  return newPatient;
}

export function updatePatient(id: string, updates: Partial<Pick<Patient, "name" | "age" | "weight" | "mode">>): void {
  const patients = getPatients().map((p) =>
    p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
  );
  savePatients(patients);
}

export function deletePatient(id: string): void {
  savePatients(getPatients().filter((p) => p.id !== id));
}

export function addMeasurement(
  patientId: string,
  data: { csa: number; volume: number; volumePerKg: number | null; riskLevel: RiskLevel | null }
): Measurement {
  const measurement: Measurement = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...data,
  };
  const patients = getPatients().map((p) =>
    p.id === patientId
      ? { ...p, measurements: [measurement, ...p.measurements], updatedAt: Date.now() }
      : p
  );
  savePatients(patients);
  return measurement;
}

export function deleteMeasurement(patientId: string, measurementId: string): void {
  const patients = getPatients().map((p) =>
    p.id === patientId
      ? { ...p, measurements: p.measurements.filter((m) => m.id !== measurementId), updatedAt: Date.now() }
      : p
  );
  savePatients(patients);
}

// --- Preferences ---

export function getPrefs(): { mode: PatientMode; activeTab: number } {
  if (typeof window === "undefined") return { mode: "pediatric", activeTab: 0 };
  try {
    const data = localStorage.getItem(PREFS_KEY);
    return data ? JSON.parse(data) : { mode: "pediatric", activeTab: 0 };
  } catch {
    return { mode: "pediatric", activeTab: 0 };
  }
}

export function savePrefs(prefs: Partial<{ mode: PatientMode; activeTab: number }>): void {
  const current = getPrefs();
  localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...prefs }));
}
