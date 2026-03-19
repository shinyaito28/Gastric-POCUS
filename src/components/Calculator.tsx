"use client";

import { useState, useMemo, useCallback } from "react";
import { calcPediatricVolume, calcAdultVolume, getRiskLevel, getRiskColorHex } from "@/lib/calculations";
import { addHistoryEntry, addMeasurement } from "@/lib/storage";
import type { PatientMode, Patient } from "@/lib/types";
import { InputField } from "./InputField";
import { AgeInput } from "./AgeInput";
import { GradeIndicator } from "./GradeIndicator";
import { RiskBadge } from "./RiskBadge";

interface CalculatorProps {
  mode: PatientMode;
  onModeChange: (mode: PatientMode) => void;
  selectedPatient: Patient | null;
  onHistoryUpdated?: () => void;
  onPatientUpdated?: () => void;
}

export function Calculator({ mode, onModeChange, selectedPatient, onHistoryUpdated, onPatientUpdated }: CalculatorProps) {
  const [csa, setCsa] = useState("3.0");
  const [ageMonths, setAgeMonths] = useState(60);
  const [ageYears, setAgeYears] = useState("30");
  const [weight, setWeight] = useState(selectedPatient ? String(selectedPatient.weight) : "20");
  const [saved, setSaved] = useState(false);

  const result = useMemo(() => {
    const csaVal = parseFloat(csa);
    const wt = parseFloat(weight);
    if (isNaN(csaVal) || csaVal <= 0) return null;

    if (mode === "pediatric") {
      if (ageMonths < 0) return null;
      const vol = calcPediatricVolume(csaVal, ageMonths);
      const volPerKg = wt > 0 ? vol / wt : null;
      return { vol: Math.max(0, vol), volPerKg };
    } else {
      const ay = parseFloat(ageYears);
      if (isNaN(ay) || ay < 0) return null;
      const vol = calcAdultVolume(csaVal, ay);
      const volPerKg = wt > 0 ? vol / wt : null;
      return { vol: Math.max(0, vol), volPerKg };
    }
  }, [mode, csa, ageMonths, ageYears, weight]);

  const risk = result?.volPerKg != null ? getRiskLevel(result.volPerKg) : null;

  const handleSave = useCallback(() => {
    if (!result) return;
    const csaVal = parseFloat(csa);
    const age = mode === "pediatric" ? ageMonths : parseFloat(ageYears);
    const wt = parseFloat(weight);

    addHistoryEntry({
      mode,
      csa: csaVal,
      age,
      weight: wt,
      volume: result.vol,
      volumePerKg: result.volPerKg,
      riskLevel: risk?.level ?? null,
      patientId: selectedPatient?.id,
    });
    onHistoryUpdated?.();

    if (selectedPatient) {
      addMeasurement(selectedPatient.id, {
        csa: csaVal,
        volume: result.vol,
        volumePerKg: result.volPerKg,
        riskLevel: risk?.level ?? null,
      });
      onPatientUpdated?.();
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [result, csa, ageMonths, ageYears, weight, mode, risk, selectedPatient, onHistoryUpdated, onPatientUpdated]);

  return (
    <div className="w-full min-w-0 overflow-hidden">
      {/* Selected patient indicator */}
      {selectedPatient && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
          <span className="text-xs text-sky-400 font-semibold">
            Patient: {selectedPatient.name}
          </span>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex mb-6 rounded-[10px] overflow-hidden border border-white/10">
        {(["pediatric", "adult"] as const).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`flex-1 py-3 border-none cursor-pointer font-semibold text-[13px] uppercase tracking-wide transition-all duration-200 ${
              mode === m
                ? m === "pediatric"
                  ? "bg-sky-500 text-white"
                  : "bg-violet-500 text-white"
                : "bg-transparent text-slate-500"
            }`}
          >
            {m === "pediatric" ? "Pediatric (Spencer)" : "Adult (Perlas)"}
          </button>
        ))}
      </div>

      {/* Formula display */}
      <div className="px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-5 font-mono text-xs text-slate-400 text-center">
        {mode === "pediatric"
          ? "Vol (mL) = −7.8 + (3.5 × CSA) + (0.127 × Age_months)"
          : "Vol (mL) = 27.0 + (14.6 × CSA) − (1.28 × Age_years)"}
      </div>

      {/* Inputs */}
      <div className="flex flex-wrap gap-3 mb-3">
        <InputField label="Antral CSA (RLD)" value={csa} onChange={setCsa} unit="cm²" min={0} max={30} step={0.1} />
        {mode === "adult" && (
          <InputField label="Age" value={ageYears} onChange={setAgeYears} unit="years" min={18} max={100} />
        )}
        <InputField label="Body Weight" value={weight} onChange={setWeight} unit="kg" min={1} max={200} step={0.5} />
      </div>
      {mode === "pediatric" && (
        <div className="mb-5">
          <AgeInput value={ageMonths} onChange={setAgeMonths} />
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-xl p-5 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/[0.08]">
          <div className="flex flex-wrap gap-5 justify-center mb-4">
            <div className="text-center">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Predicted Volume
              </div>
              <div className="text-4xl font-bold text-slate-100 font-mono">
                {result.vol.toFixed(1)}
                <span className="text-base text-slate-400 ml-1">mL</span>
              </div>
            </div>
            {result.volPerKg != null && (
              <div className="text-center">
                <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
                  Per kg
                </div>
                <div className="text-4xl font-bold font-mono" style={{ color: risk ? getRiskColorHex(risk.level) : "#f1f5f9" }}>
                  {result.volPerKg.toFixed(2)}
                  <span className="text-base text-slate-400 ml-1">mL/kg</span>
                </div>
              </div>
            )}
          </div>

          {risk && <RiskBadge risk={risk} />}

          {/* Save button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                saved
                  ? "bg-green-600 text-white"
                  : "bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white"
              }`}
            >
              {saved ? "Saved!" : selectedPatient ? "Save to Patient" : "Save to History"}
            </button>
          </div>
        </div>
      )}

      {/* Grading system */}
      <div className="mt-6">
        <h3 className="text-[13px] font-bold text-slate-300 uppercase tracking-wider mb-3">
          Antral Grading System
        </h3>
        <div className="flex flex-col gap-2">
          {([0, 1, 2] as const).map((g) => (
            <GradeIndicator key={g} grade={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
