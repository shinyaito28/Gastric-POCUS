"use client";

import type { RiskInfo } from "@/lib/types";

interface RiskBadgeProps {
  risk: RiskInfo;
}

const BADGE_STYLES: Record<string, { bg: string; border: string }> = {
  Low: { bg: "bg-green-950", border: "border-green-500/25" },
  Borderline: { bg: "bg-yellow-950", border: "border-yellow-500/25" },
  High: { bg: "bg-red-950", border: "border-red-500/25" },
};

const RISK_TEXT_COLOR: Record<string, string> = {
  Low: "text-green-500",
  Borderline: "text-yellow-500",
  High: "text-red-500",
};

const RISK_DESC: Record<string, string> = {
  Low: "(≤ 1.2 mL/kg — fasting baseline)",
  Borderline: "(1.2–1.5 mL/kg)",
  High: "(> 1.5 mL/kg — non-fasting)",
};

export function RiskBadge({ risk }: RiskBadgeProps) {
  const style = BADGE_STYLES[risk.level];
  const textColor = RISK_TEXT_COLOR[risk.level];

  return (
    <div className={`text-center px-4 py-2 rounded-lg ${style.bg} border ${style.border}`}>
      <span className={`text-[13px] font-bold ${textColor}`}>
        Aspiration Risk: {risk.level}
      </span>
      <span className="text-[11px] text-slate-400 ml-2">
        {RISK_DESC[risk.level]}
      </span>
    </div>
  );
}
