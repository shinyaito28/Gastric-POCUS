"use client";

import { useState, useEffect, useMemo } from "react";

type AgeMode = "ym" | "months" | "dob";

interface AgeInputProps {
  value: number; // total months
  onChange: (months: number) => void;
}

function calcMonthsFromDob(dob: string): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
  months += today.getMonth() - birthDate.getMonth();
  if (today.getDate() < birthDate.getDate()) months--;
  return Math.max(0, months);
}

function formatAgeLabel(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${totalMonths} ヶ月`;
  if (months === 0) return `${years} 歳`;
  return `${years} 歳 ${months} ヶ月`;
}

const MODE_LABELS: Record<AgeMode, string> = {
  ym: "年・月",
  months: "月齢",
  dob: "生年月日",
};

export function AgeInput({ value, onChange }: AgeInputProps) {
  const [mode, setMode] = useState<AgeMode>("ym");
  const [years, setYears] = useState(String(Math.floor(value / 12)));
  const [months, setMonths] = useState(String(value % 12));
  const [totalMonths, setTotalMonths] = useState(String(value));
  const [dob, setDob] = useState("");

  // Sync internal state when mode changes
  const handleModeChange = (newMode: AgeMode) => {
    setMode(newMode);
    if (newMode === "ym") {
      setYears(String(Math.floor(value / 12)));
      setMonths(String(value % 12));
    } else if (newMode === "months") {
      setTotalMonths(String(value));
    }
    // dob keeps its own state
  };

  // Year+Month mode handler
  const handleYmChange = (y: string, m: string) => {
    setYears(y);
    setMonths(m);
    const yVal = parseInt(y) || 0;
    const mVal = parseInt(m) || 0;
    onChange(yVal * 12 + mVal);
  };

  // Months mode handler
  const handleMonthsChange = (val: string) => {
    setTotalMonths(val);
    const v = parseInt(val);
    if (!isNaN(v) && v >= 0) onChange(v);
  };

  // DOB mode handler
  const handleDobChange = (val: string) => {
    setDob(val);
    if (val) {
      const m = calcMonthsFromDob(val);
      onChange(m);
    }
  };

  const dobMonths = useMemo(() => (dob ? calcMonthsFromDob(dob) : null), [dob]);

  return (
    <div className="flex-1 min-w-[200px]">
      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        Age (小児)
      </label>

      {/* Mode tabs */}
      <div className="flex rounded-t-lg overflow-hidden border border-b-0 border-white/10">
        {(["ym", "months", "dob"] as const).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`flex-1 py-1.5 text-[10px] font-semibold transition-colors border-none cursor-pointer ${
              mode === m
                ? "bg-sky-500/20 text-sky-400"
                : "bg-transparent text-slate-500"
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="bg-white/[0.06] rounded-b-lg border border-white/10 p-2.5">
        {mode === "ym" && (
          <div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={years}
                onChange={(e) => {
                  if (e.target.value === "" || /^\d*$/.test(e.target.value)) {
                    handleYmChange(e.target.value, months);
                  }
                }}
                autoComplete="off"
                className="w-16 px-2.5 py-2 bg-white/[0.08] rounded-md border border-white/10 text-slate-100 text-lg font-mono outline-none text-center"
                placeholder="0"
              />
              <span className="text-slate-400 text-sm font-semibold">歳</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={months}
                onChange={(e) => {
                  if (e.target.value === "" || /^\d*$/.test(e.target.value)) {
                    handleYmChange(years, e.target.value);
                  }
                }}
                autoComplete="off"
                className="w-16 px-2.5 py-2 bg-white/[0.08] rounded-md border border-white/10 text-slate-100 text-lg font-mono outline-none text-center"
                placeholder="0"
              />
              <span className="text-slate-400 text-sm font-semibold">ヶ月</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1.5 pl-0.5">
              = {value} ヶ月
            </div>
          </div>
        )}

        {mode === "months" && (
          <div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={totalMonths}
                onChange={(e) => {
                  if (e.target.value === "" || /^\d*$/.test(e.target.value)) {
                    handleMonthsChange(e.target.value);
                  }
                }}
                autoComplete="off"
                className="flex-1 px-3 py-2 bg-white/[0.08] rounded-md border border-white/10 text-slate-100 text-lg font-mono outline-none"
                placeholder="0"
              />
              <span className="text-slate-400 text-sm font-semibold whitespace-nowrap">ヶ月</span>
            </div>
            {value > 0 && (
              <div className="text-[10px] text-slate-500 mt-1.5 pl-0.5">
                = {formatAgeLabel(value)}
              </div>
            )}
          </div>
        )}

        {mode === "dob" && (
          <div>
            <input
              type="date"
              value={dob}
              onChange={(e) => handleDobChange(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 bg-white/[0.08] rounded-md border border-white/10 text-slate-100 text-base outline-none [color-scheme:dark]"
            />
            {dobMonths !== null && (
              <div className="text-[10px] text-slate-500 mt-1.5 pl-0.5">
                = {formatAgeLabel(dobMonths)} ({dobMonths} ヶ月)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
