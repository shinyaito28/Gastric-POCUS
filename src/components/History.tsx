"use client";

import { useState, useEffect } from "react";
import { getHistory, deleteHistoryEntry, clearHistory } from "@/lib/storage";
import { getRiskColorHex } from "@/lib/calculations";
import type { HistoryEntry } from "@/lib/types";

interface HistoryProps {
  refreshKey: number;
  onRestore?: (entry: HistoryEntry) => void;
}

export function History({ refreshKey, onRestore }: HistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
  }, [refreshKey]);

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setEntries(getHistory());
  };

  const handleClearAll = () => {
    clearHistory();
    setEntries([]);
    setShowConfirm(false);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-3xl mb-3 opacity-30">&#128203;</div>
        <div className="text-slate-500 text-sm">計算履歴はまだありません</div>
        <div className="text-slate-600 text-xs mt-1">
          Calculatorタブで計算を保存すると、ここに表示されます
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with clear button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-300">
          計算履歴 ({entries.length})
        </h3>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors px-3 py-1.5"
          >
            すべて削除
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-md font-semibold"
            >
              削除する
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-xs text-slate-400 px-3 py-1.5"
            >
              キャンセル
            </button>
          </div>
        )}
      </div>

      {/* Entry list */}
      <div className="flex flex-col gap-2.5">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-hidden"
          >
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-white/[0.04]"
              onClick={() => onRestore?.(entry)}
            >
              {/* Risk indicator */}
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: entry.riskLevel ? getRiskColorHex(entry.riskLevel) : "#64748b" }}
              />

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">
                    {entry.volume.toFixed(1)} mL
                  </span>
                  {entry.volumePerKg != null && (
                    <span
                      className="text-xs font-bold"
                      style={{ color: entry.riskLevel ? getRiskColorHex(entry.riskLevel) : "#94a3b8" }}
                    >
                      ({entry.volumePerKg.toFixed(2)} mL/kg)
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  CSA {entry.csa} cm² ・ {entry.mode === "pediatric" ? `${entry.age}m` : `${entry.age}y`} ・ {entry.weight} kg
                </div>
              </div>

              {/* Time & delete */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-600">{formatTime(entry.timestamp)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  className="text-slate-600 hover:text-red-400 transition-colors p-1 text-sm"
                  aria-label="Delete"
                >
                  &#10005;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-[10px] text-slate-600 mt-4">
        タップで値を復元 ・ 最大{entries.length}/50件
      </div>
    </div>
  );
}
