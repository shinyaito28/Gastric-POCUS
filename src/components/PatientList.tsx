"use client";

import { useState, useEffect } from "react";
import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
  deleteMeasurement,
} from "@/lib/storage";
import { getRiskColorHex } from "@/lib/calculations";
import type { Patient, PatientMode } from "@/lib/types";
import { AgeInput } from "./AgeInput";

interface PatientListProps {
  refreshKey: number;
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient | null) => void;
}

type View = "list" | "add" | "detail" | "edit";

export function PatientList({ refreshKey, selectedPatient, onSelectPatient }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [view, setView] = useState<View>("list");
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Add form
  const [name, setName] = useState("");
  const [mode, setMode] = useState<PatientMode>("pediatric");
  const [age, setAge] = useState("");
  const [ageMonths, setAgeMonths] = useState(60);
  const [weight, setWeight] = useState("");

  useEffect(() => {
    setPatients(getPatients());
  }, [refreshKey]);

  const refreshPatients = () => {
    setPatients(getPatients());
  };

  const handleAdd = () => {
    if (!name.trim() || !weight) return;
    const ageVal = mode === "pediatric" ? ageMonths : parseFloat(age);
    if (isNaN(ageVal)) return;
    const newPatient = addPatient({
      name: name.trim(),
      mode,
      age: ageVal,
      weight: parseFloat(weight),
    });
    setName("");
    setAge("");
    setAgeMonths(60);
    setWeight("");
    refreshPatients();
    setView("list");
  };

  const handleUpdate = () => {
    if (!detailPatient || !name.trim() || !weight) return;
    const ageVal = mode === "pediatric" ? ageMonths : parseFloat(age);
    if (isNaN(ageVal)) return;
    updatePatient(detailPatient.id, {
      name: name.trim(),
      mode,
      age: ageVal,
      weight: parseFloat(weight),
    });
    refreshPatients();
    const updated = getPatients().find((p) => p.id === detailPatient.id);
    if (updated) setDetailPatient(updated);
    setView("detail");
  };

  const handleDelete = (id: string) => {
    deletePatient(id);
    if (selectedPatient?.id === id) onSelectPatient(null);
    if (detailPatient?.id === id) {
      setDetailPatient(null);
      setView("list");
    }
    setShowDeleteConfirm(null);
    refreshPatients();
  };

  const handleDeleteMeasurement = (patientId: string, measurementId: string) => {
    deleteMeasurement(patientId, measurementId);
    refreshPatients();
    const updated = getPatients().find((p) => p.id === patientId);
    if (updated) setDetailPatient(updated);
  };

  const handleSelect = (patient: Patient) => {
    if (selectedPatient?.id === patient.id) {
      onSelectPatient(null);
    } else {
      onSelectPatient(patient);
    }
  };

  const openDetail = (patient: Patient) => {
    setDetailPatient(patient);
    setView("detail");
  };

  const openEdit = (patient: Patient) => {
    setDetailPatient(patient);
    setName(patient.name);
    setMode(patient.mode);
    if (patient.mode === "pediatric") {
      setAgeMonths(patient.age);
    } else {
      setAge(String(patient.age));
    }
    setWeight(String(patient.weight));
    setView("edit");
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- Detail View ---
  if (view === "detail" && detailPatient) {
    const p = getPatients().find((pt) => pt.id === detailPatient.id) || detailPatient;
    return (
      <div>
        <button
          onClick={() => { setView("list"); setDetailPatient(null); }}
          className="text-xs text-sky-400 mb-4 flex items-center gap-1"
        >
          &#8592; 一覧に戻る
        </button>

        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-200">{p.name}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(p)}
                className="text-xs text-sky-400 px-2 py-1"
              >
                編集
              </button>
              <button
                onClick={() => handleSelect(p)}
                className={`text-xs px-3 py-1 rounded-md font-semibold transition-colors ${
                  selectedPatient?.id === p.id
                    ? "bg-sky-600 text-white"
                    : "bg-white/[0.06] text-slate-400"
                }`}
              >
                {selectedPatient?.id === p.id ? "選択中" : "選択"}
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            {p.mode === "pediatric" ? (p.age >= 12 ? `${Math.floor(p.age / 12)}歳${p.age % 12 ? `${p.age % 12}ヶ月` : ""}` : `${p.age}ヶ月`) : `${p.age}歳`} ・ {p.weight} kg ・ {p.mode === "pediatric" ? "小児" : "成人"}
          </div>
        </div>

        <h4 className="text-sm font-bold text-slate-300 mb-3">
          計測履歴 ({p.measurements.length})
        </h4>

        {p.measurements.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            計測データはまだありません<br />
            この患者を選択してCalculatorで計算を保存してください
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {p.measurements.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: m.riskLevel ? getRiskColorHex(m.riskLevel) : "#64748b" }}
                />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-300">
                    {m.volume.toFixed(1)} mL
                    {m.volumePerKg != null && (
                      <span
                        className="ml-2 font-bold"
                        style={{ color: m.riskLevel ? getRiskColorHex(m.riskLevel) : "#94a3b8" }}
                      >
                        {m.volumePerKg.toFixed(2)} mL/kg
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">CSA {m.csa} cm²</div>
                </div>
                <span className="text-[10px] text-slate-600">{formatTime(m.timestamp)}</span>
                <button
                  onClick={() => handleDeleteMeasurement(p.id, m.id)}
                  className="text-slate-600 hover:text-red-400 p-1 text-xs"
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Add / Edit Form ---
  if (view === "add" || view === "edit") {
    return (
      <div>
        <button
          onClick={() => { setView("list"); setName(""); setAge(""); setAgeMonths(60); setWeight(""); }}
          className="text-xs text-sky-400 mb-4 flex items-center gap-1"
        >
          &#8592; 一覧に戻る
        </button>

        <h3 className="text-sm font-bold text-slate-300 mb-4">
          {view === "add" ? "患者を追加" : "患者情報を編集"}
        </h3>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Name / ID
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="患者名または識別子"
              className="w-full px-3 py-2.5 bg-white/[0.06] rounded-lg border border-white/10 text-slate-100 text-base outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Mode
              </label>
              <div className="flex rounded-lg overflow-hidden border border-white/10">
                {(["pediatric", "adult"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                      mode === m
                        ? m === "pediatric" ? "bg-sky-500 text-white" : "bg-violet-500 text-white"
                        : "bg-transparent text-slate-500"
                    }`}
                  >
                    {m === "pediatric" ? "小児" : "成人"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {mode === "pediatric" ? (
            <AgeInput value={ageMonths} onChange={setAgeMonths} />
          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Age (years)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/[0.06] rounded-lg border border-white/10 text-slate-100 text-base font-mono outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Weight (kg)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/[0.06] rounded-lg border border-white/10 text-slate-100 text-base font-mono outline-none"
            />
          </div>

          <button
            onClick={view === "add" ? handleAdd : handleUpdate}
            disabled={!name.trim() || (mode === "adult" && !age) || !weight}
            className="mt-2 w-full py-3 rounded-lg bg-sky-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:bg-sky-700 transition-colors"
          >
            {view === "add" ? "追加する" : "更新する"}
          </button>
        </div>
      </div>
    );
  }

  // --- List View ---
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-300">
          患者リスト ({patients.length})
        </h3>
        <button
          onClick={() => {
            setName("");
            setMode("pediatric");
            setAge("");
            setWeight("");
            setView("add");
          }}
          className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-md font-semibold active:bg-sky-700 transition-colors"
        >
          + 追加
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-3xl mb-3 opacity-30">&#128100;</div>
          <div className="text-slate-500 text-sm">患者リストは空です</div>
          <div className="text-slate-600 text-xs mt-1">
            「+ 追加」から患者を登録してください
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {patients.map((p) => {
            const lastM = p.measurements[0];
            const isSelected = selectedPatient?.id === p.id;

            return (
              <div
                key={p.id}
                className={`rounded-lg border overflow-hidden transition-colors ${
                  isSelected
                    ? "bg-sky-500/10 border-sky-500/30"
                    : "bg-white/[0.03] border-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Risk dot from last measurement */}
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      background: lastM?.riskLevel
                        ? getRiskColorHex(lastM.riskLevel)
                        : "#334155",
                    }}
                  />

                  {/* Patient info - tap to open detail */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => openDetail(p)}
                  >
                    <div className="text-sm font-semibold text-slate-200 truncate">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {p.mode === "pediatric" ? `${p.age}m` : `${p.age}y`} ・ {p.weight} kg ・ 計測 {p.measurements.length}件
                    </div>
                  </div>

                  {/* Select button */}
                  <button
                    onClick={() => handleSelect(p)}
                    className={`text-[10px] px-2.5 py-1 rounded-md font-semibold shrink-0 transition-colors ${
                      isSelected
                        ? "bg-sky-600 text-white"
                        : "bg-white/[0.06] text-slate-400 active:bg-white/10"
                    }`}
                  >
                    {isSelected ? "選択中" : "選択"}
                  </button>

                  {/* Delete */}
                  {showDeleteConfirm === p.id ? (
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-[10px] bg-red-600 text-white px-2 py-1 rounded"
                      >
                        削除
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="text-[10px] text-slate-500 px-2 py-1"
                      >
                        &#10005;
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(p.id)}
                      className="text-slate-600 hover:text-red-400 p-1 text-xs shrink-0"
                    >
                      &#128465;
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPatient && (
        <div className="mt-4 text-center text-xs text-sky-400">
          「{selectedPatient.name}」が選択中 — Calculatorの結果がこの患者に紐付けされます
        </div>
      )}
    </div>
  );
}
