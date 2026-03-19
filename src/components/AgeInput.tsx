"use client";

import { useState, useMemo } from "react";

type AgeMode = "ym" | "months" | "dob";

interface AgeInputProps {
  value: number;
  onChange: (months: number) => void;
}

function calcMonthsFromDob(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let m = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) m--;
  return Math.max(0, m);
}

function fmtAge(m: number): string {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (y === 0) return `${m}ヶ月`;
  if (mo === 0) return `${y}歳`;
  return `${y}歳${mo}ヶ月`;
}

export function AgeInput({ value, onChange }: AgeInputProps) {
  const [mode, setMode] = useState<AgeMode>("ym");
  const [years, setYears] = useState(String(Math.floor(value / 12)));
  const [months, setMonths] = useState(String(value % 12));
  const [totalMonths, setTotalMonths] = useState(String(value));
  const [dob, setDob] = useState("");

  const handleModeChange = (m: AgeMode) => {
    setMode(m);
    if (m === "ym") { setYears(String(Math.floor(value / 12))); setMonths(String(value % 12)); }
    else if (m === "months") { setTotalMonths(String(value)); }
  };

  const handleYm = (y: string, m: string) => {
    setYears(y); setMonths(m);
    onChange((parseInt(y) || 0) * 12 + (parseInt(m) || 0));
  };

  const dobMonths = useMemo(() => dob ? calcMonthsFromDob(dob) : null, [dob]);

  const inputCls = "px-3 py-2.5 bg-white/[0.06] rounded-lg border border-white/10 text-slate-100 text-lg font-mono outline-none";
  const modeBtnBase = "px-2 py-0.5 text-[10px] font-semibold rounded transition-colors cursor-pointer border-none";

  return (
    <div>
      {/* Label + mode switcher in one row */}
      <div className="flex items-center gap-2 mb-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Age
        </label>
        <div className="flex gap-0.5 ml-auto">
          {(["ym", "months", "dob"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`${modeBtnBase} ${
                mode === m ? "bg-sky-500/25 text-sky-400" : "bg-transparent text-slate-600"
              }`}
            >
              {m === "ym" ? "年月" : m === "months" ? "月齢" : "生年月日"}
            </button>
          ))}
        </div>
      </div>

      {/* Year + Month mode */}
      {mode === "ym" && (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-white/[0.06] rounded-lg border border-white/10 overflow-hidden">
            <input
              type="text" inputMode="numeric" pattern="[0-9]*"
              value={years}
              onChange={(e) => { if (/^\d*$/.test(e.target.value)) handleYm(e.target.value, months); }}
              autoComplete="off"
              className="w-12 px-2 py-2.5 bg-transparent text-slate-100 text-lg font-mono outline-none text-center"
              placeholder="0"
            />
            <span className="pr-2 text-slate-500 text-[13px] font-semibold">歳</span>
          </div>
          <div className="flex items-center bg-white/[0.06] rounded-lg border border-white/10 overflow-hidden">
            <input
              type="text" inputMode="numeric" pattern="[0-9]*"
              value={months}
              onChange={(e) => { if (/^\d*$/.test(e.target.value)) handleYm(years, e.target.value); }}
              autoComplete="off"
              className="w-12 px-2 py-2.5 bg-transparent text-slate-100 text-lg font-mono outline-none text-center"
              placeholder="0"
            />
            <span className="pr-2 text-slate-500 text-[13px] font-semibold">ヶ月</span>
          </div>
          <span className="text-[10px] text-slate-500">={value}m</span>
        </div>
      )}

      {/* Months mode */}
      {mode === "months" && (
        <div className="flex items-center bg-white/[0.06] rounded-lg border border-white/10 overflow-hidden">
          <input
            type="text" inputMode="numeric" pattern="[0-9]*"
            value={totalMonths}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                setTotalMonths(e.target.value);
                const v = parseInt(e.target.value);
                if (!isNaN(v) && v >= 0) onChange(v);
              }
            }}
            autoComplete="off"
            className="flex-1 px-3 py-2.5 bg-transparent text-slate-100 text-lg font-mono outline-none w-full"
            placeholder="0"
          />
          <span className="px-3 text-slate-500 text-[13px] font-semibold whitespace-nowrap">
            ヶ月{value > 0 ? ` (${fmtAge(value)})` : ""}
          </span>
        </div>
      )}

      {/* DOB mode */}
      {mode === "dob" && (
        <div>
          <div className="flex items-center bg-white/[0.06] rounded-lg border border-white/10 overflow-hidden">
            <input
              type="date"
              value={dob}
              onChange={(e) => { setDob(e.target.value); if (e.target.value) onChange(calcMonthsFromDob(e.target.value)); }}
              max={new Date().toISOString().split("T")[0]}
              className="flex-1 px-3 py-2.5 bg-transparent text-slate-100 text-base outline-none w-full [color-scheme:dark]"
            />
          </div>
          {dobMonths !== null && (
            <div className="text-[10px] text-slate-500 mt-1 pl-1">
              = {fmtAge(dobMonths)} ({dobMonths}ヶ月)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
