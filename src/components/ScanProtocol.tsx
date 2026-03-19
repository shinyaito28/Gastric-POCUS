"use client";

import { PROTOCOL_STEPS } from "@/lib/constants";

export function ScanProtocol() {
  return (
    <div>
      {/* Header */}
      <div className="px-4 py-3.5 rounded-[10px] bg-gradient-to-br from-[#0c4a6e] to-[#1e3a5f] border border-sky-500/30 mb-6">
        <div className="text-[15px] font-bold text-sky-400 mb-1.5">
          Gastric Point-of-Care Ultrasound (PoCUS)
        </div>
        <div className="text-xs text-slate-400 leading-relaxed">
          標準的な胃エコー検査プロトコル — gastricultrasound.org に基づく。
          Clear fluid の胃内容量評価に適用。固形内容物には容量計算は不適用。
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-4">
        {PROTOCOL_STEPS.map((s) => (
          <div
            key={s.num}
            className="flex gap-3.5 px-4 py-3.5 rounded-[10px] bg-white/[0.03] border border-white/[0.06]"
          >
            <div className="w-8 h-8 rounded-full bg-sky-500/[0.13] border-2 border-sky-500 flex items-center justify-center font-extrabold text-sky-500 text-sm shrink-0 mt-0.5">
              {s.num}
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-200 text-sm mb-2">{s.title}</div>
              <div className="flex flex-col gap-1">
                {s.details.map((d, i) => (
                  <div
                    key={i}
                    className="text-xs text-slate-400 leading-relaxed pl-2.5 border-l-2 border-white/[0.06]"
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Reminders */}
      <div className="mt-6 px-4 py-3.5 rounded-[10px] bg-yellow-500/[0.06] border border-yellow-500/20">
        <div className="text-[13px] font-bold text-yellow-500 mb-1.5">
          Clinical Reminders
        </div>
        <div className="text-xs text-slate-400 leading-[1.7]">
          ・仰臥位のみで「空胃」と判断しないこと → 必ずRLDで確認<br />
          ・固形・thick fluid → CSA計測不要、Full stomach として管理<br />
          ・小児の正常絶食容量上限: 1.1–1.2 mL/kg<br />
          ・計算式は clear fluid にのみ適用可能<br />
          ・解剖学的異常（胃手術後等）がある場合は精度が低下する可能性あり
        </div>
      </div>

      {/* References */}
      <div className="mt-5 px-4 py-3.5 rounded-[10px] bg-white/[0.02] border border-white/[0.06]">
        <div className="text-[13px] font-bold text-slate-300 mb-2">References</div>
        <div className="text-[11px] text-slate-500 leading-[1.8]">
          1. Spencer AO, et al. <em>Paediatr Anaesth</em>. 2015;25:301-308.<br />
          2. Perlas A, et al. <em>Anesth Analg</em>. 2009;109:536-543.<br />
          3. Van de Putte P, Perlas A. <em>Br J Anaesth</em>. 2014;113(1):12-22.<br />
          4. Moser JJ, et al. <em>Br J Anaesth</em>. 2017;119(5):943-947.<br />
          5. gastricultrasound.org — Pediatric Patients & Image Acquisition
        </div>
      </div>
    </div>
  );
}
