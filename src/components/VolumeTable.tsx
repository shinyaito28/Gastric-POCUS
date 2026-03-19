"use client";

import { calcPediatricVolume, calcAdultVolume } from "@/lib/calculations";
import { CSA_VALUES, AGE_GROUPS_MONTHS, AGE_GROUPS_YEARS } from "@/lib/constants";

export function VolumeTable() {
  return (
    <div>
      {/* Pediatric table */}
      <h3 className="text-sm font-bold text-slate-300 mb-1">
        Pediatric Volume Reference Table
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Spencer model: Vol = −7.8 + (3.5 × CSA) + (0.127 × age_months). Values in mL.
      </p>
      <div className="table-scroll-container">
        <div className="overflow-x-auto rounded-[10px] border border-white/[0.08] table-scroll">
          <table className="w-full border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-white/[0.06]">
                <th className="px-2.5 py-2 text-left text-slate-400 font-bold text-[10px] uppercase tracking-wider border-b border-white/[0.08] sticky left-0 bg-navy-900 z-[1] min-w-[70px]">
                  CSA \ Age
                </th>
                {AGE_GROUPS_MONTHS.map((am) => (
                  <th key={am} className="px-1.5 py-2 text-center text-slate-400 font-semibold border-b border-white/[0.08] text-[10px] whitespace-nowrap">
                    {am >= 12 ? `${Math.floor(am / 12)}y` : `${am}m`}
                    <br />
                    <span className="text-slate-600 text-[9px]">({am}m)</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CSA_VALUES.map((csa, ri) => (
                <tr key={csa} className={ri % 2 === 0 ? "" : "bg-white/[0.02]"}>
                  <td className={`px-2.5 py-[7px] font-bold text-sky-500 border-b border-white/[0.04] sticky left-0 z-[1] ${ri % 2 === 0 ? "bg-navy-900" : "bg-[#111827]"}`}>
                    {csa} cm²
                  </td>
                  {AGE_GROUPS_MONTHS.map((am) => {
                    const vol = Math.max(0, calcPediatricVolume(csa, am));
                    return (
                      <td key={am} className={`px-1.5 py-[7px] text-center border-b border-white/[0.04] ${vol < 5 ? "text-slate-500" : "text-slate-200"}`}>
                        {vol.toFixed(1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adult table */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-slate-300 mb-1">
          Adult Volume Reference Table
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Perlas model: Vol = 27.0 + (14.6 × CSA) − (1.28 × age_years). Values in mL.
        </p>
        <div className="table-scroll-container">
          <div className="overflow-x-auto rounded-[10px] border border-white/[0.08] table-scroll">
            <table className="w-full border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-white/[0.06]">
                  <th className="px-2.5 py-2 text-left text-slate-400 font-bold text-[10px] uppercase tracking-wider border-b border-white/[0.08] sticky left-0 bg-navy-900 z-[1] min-w-[70px]">
                    CSA \ Age
                  </th>
                  {AGE_GROUPS_YEARS.map((ay) => (
                    <th key={ay} className="px-2.5 py-2 text-center text-slate-400 font-semibold border-b border-white/[0.08] text-[11px]">
                      {ay}y
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CSA_VALUES.map((csa, ri) => (
                  <tr key={csa} className={ri % 2 === 0 ? "" : "bg-white/[0.02]"}>
                    <td className={`px-2.5 py-[7px] font-bold text-violet-500 border-b border-white/[0.04] sticky left-0 z-[1] ${ri % 2 === 0 ? "bg-navy-900" : "bg-[#111827]"}`}>
                      {csa} cm²
                    </td>
                    {AGE_GROUPS_YEARS.map((ay) => {
                      const vol = Math.max(0, calcAdultVolume(csa, ay));
                      return (
                        <td key={ay} className="px-2.5 py-[7px] text-center text-slate-200 border-b border-white/[0.04]">
                          {vol.toFixed(1)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
