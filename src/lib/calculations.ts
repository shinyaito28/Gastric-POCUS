import type { RiskInfo } from "./types";

/** Spencer et al. 2014 pediatric model */
export function calcPediatricVolume(csaCm2: number, ageMonths: number): number {
  return -7.8 + 3.5 * csaCm2 + 0.127 * ageMonths;
}

/** Perlas et al. 2013 adult model */
export function calcAdultVolume(csaCm2: number, ageYears: number): number {
  return 27.0 + 14.6 * csaCm2 - 1.28 * ageYears;
}

const RISK_MAP: Record<string, RiskInfo> = {
  Low: { level: "Low", color: "text-green-500", bg: "bg-green-950" },
  Borderline: { level: "Borderline", color: "text-yellow-500", bg: "bg-yellow-950" },
  High: { level: "High", color: "text-red-500", bg: "bg-red-950" },
};

export function getRiskLevel(volumeMlPerKg: number): RiskInfo {
  if (volumeMlPerKg <= 1.2) return RISK_MAP.Low;
  if (volumeMlPerKg <= 1.5) return RISK_MAP.Borderline;
  return RISK_MAP.High;
}

export function getRiskColorHex(level: string): string {
  switch (level) {
    case "Low": return "#22c55e";
    case "Borderline": return "#eab308";
    case "High": return "#ef4444";
    default: return "#94a3b8";
  }
}
