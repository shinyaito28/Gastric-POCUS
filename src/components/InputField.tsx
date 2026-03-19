"use client";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
}

export function InputField({ label, value, onChange, unit, min, max, step = 1 }: InputFieldProps) {
  return (
    <div className="flex-1 min-w-[140px]">
      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="flex items-center bg-white/[0.06] rounded-lg border border-white/10 overflow-hidden">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*\.?[0-9]*"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || /^\d*\.?\d*$/.test(v)) {
              onChange(v);
            }
          }}
          className="flex-1 px-3 py-2.5 bg-transparent border-none text-slate-100 text-lg font-medium outline-none font-mono w-full"
        />
        <span className="px-3 text-slate-500 text-[13px] font-semibold whitespace-nowrap">
          {unit}
        </span>
      </div>
    </div>
  );
}
