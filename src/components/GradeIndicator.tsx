"use client";

import { GRADE_INFO } from "@/lib/constants";
import type { AntralGrade } from "@/lib/types";

interface GradeIndicatorProps {
  grade: AntralGrade;
}

export function GradeIndicator({ grade }: GradeIndicatorProps) {
  const g = GRADE_INFO[grade];

  return (
    <div
      className="flex gap-3 items-center px-3.5 py-2.5 rounded-lg bg-white/[0.04]"
      style={{ border: `1px solid ${g.color}33` }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shrink-0"
        style={{
          background: `${g.color}22`,
          border: `2px solid ${g.color}`,
          color: g.color,
        }}
      >
        {grade}
      </div>
      <div>
        <div className="font-semibold text-[13px]" style={{ color: g.color }}>
          {g.label}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">{g.desc}</div>
      </div>
    </div>
  );
}
