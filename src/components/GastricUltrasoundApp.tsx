"use client";

import { useState, useEffect, useCallback } from "react";
import { TABS } from "@/lib/constants";
import { getPrefs, savePrefs } from "@/lib/storage";
import type { PatientMode, Patient, HistoryEntry } from "@/lib/types";
import { Calculator } from "./Calculator";
import { VolumeTable } from "./VolumeTable";
import { ScanProtocol } from "./ScanProtocol";
import { History } from "./History";
import { PatientList } from "./PatientList";

const TAB_ICONS = [
  // Calculator
  <svg key="calc" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="12" y2="18.01"/><line x1="16" y1="18" x2="16" y2="18.01"/><line x1="8" y1="10" x2="16" y2="10"/></svg>,
  // Volume Table
  <svg key="table" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  // Scan Protocol
  <svg key="scan" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  // History
  <svg key="history" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  // Patients
  <svg key="patients" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
];

export function GastricUltrasoundApp() {
  const [activeTab, setActiveTab] = useState(0);
  const [mode, setMode] = useState<PatientMode>("pediatric");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [patientRefreshKey, setPatientRefreshKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load prefs on mount
  useEffect(() => {
    const prefs = getPrefs();
    setMode(prefs.mode);
    setActiveTab(prefs.activeTab);
    setMounted(true);
  }, []);

  const handleTabChange = useCallback((i: number) => {
    setActiveTab(i);
    savePrefs({ activeTab: i });
  }, []);

  const handleModeChange = useCallback((m: PatientMode) => {
    setMode(m);
    savePrefs({ mode: m });
  }, []);

  const handleHistoryRestore = useCallback((entry: HistoryEntry) => {
    setMode(entry.mode);
    savePrefs({ mode: entry.mode });
    setActiveTab(0);
    savePrefs({ activeTab: 0 });
  }, []);

  if (!mounted) {
    // SSR placeholder
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 text-slate-200 font-['-apple-system','Helvetica_Neue',sans-serif] pb-[calc(70px+env(safe-area-inset-bottom))]">
      {/* Header */}
      <div
        className="bg-gradient-to-br from-navy-deep to-navy-800 border-b border-white/[0.06]"
        style={{ paddingTop: "calc(12px + env(safe-area-inset-top))" }}
      >
        <div className="max-w-[700px] mx-auto px-5 pb-0">
          <div className="flex items-center gap-3 mb-1">
            <img src="/icons/icon-192x192.png" alt="GUS" width={40} height={40} className="rounded-[10px] shrink-0" />
            <div>
              <h1 className="text-lg font-extrabold text-slate-100 tracking-tight leading-tight">
                Gastric Ultrasound
              </h1>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Point-of-Care Volume Assessment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[700px] mx-auto px-5 pt-5 pb-6">
        <div className="tab-content" key={activeTab}>
          {activeTab === 0 && (
            <Calculator
              mode={mode}
              onModeChange={handleModeChange}
              selectedPatient={selectedPatient}
              onHistoryUpdated={() => setHistoryRefreshKey((k) => k + 1)}
              onPatientUpdated={() => setPatientRefreshKey((k) => k + 1)}
            />
          )}
          {activeTab === 1 && <VolumeTable />}
          {activeTab === 2 && <ScanProtocol />}
          {activeTab === 3 && (
            <History
              refreshKey={historyRefreshKey}
              onRestore={handleHistoryRestore}
            />
          )}
          {activeTab === 4 && (
            <PatientList
              refreshKey={patientRefreshKey}
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
            />
          )}
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-700 leading-relaxed">
          For educational / clinical decision support only. Not a substitute for clinical judgment.<br />
          Data source: gastricultrasound.org
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-navy-900/95 backdrop-blur-md border-t border-white/[0.08] z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="max-w-[700px] mx-auto flex">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => handleTabChange(i)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 pt-2.5 border-none cursor-pointer transition-colors duration-200 ${
                activeTab === i ? "text-sky-400" : "text-slate-500"
              }`}
            >
              {TAB_ICONS[i]}
              <span className="text-[9px] font-semibold tracking-wide">
                {t === "Volume Table" ? "Table" : t === "Scan Protocol" ? "Protocol" : t}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
