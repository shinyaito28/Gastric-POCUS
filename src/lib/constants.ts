import type { GradeInfo, ProtocolStep } from "./types";

export const TABS = ["Calculator", "Volume Table", "Scan Protocol", "History", "Patients"] as const;

export const TAB_ICONS: Record<string, string> = {
  Calculator: "calc",
  "Volume Table": "table",
  "Scan Protocol": "scan",
  History: "history",
  Patients: "patients",
};

export const GRADE_INFO: Record<number, GradeInfo> = {
  0: {
    label: "Grade 0 — Empty",
    desc: "Flat/collapsed antrum. No content in supine or RLD.",
    color: "#22c55e",
  },
  1: {
    label: "Grade 1 — Low Volume Fluid",
    desc: "Content visible only in RLD. Compatible with fasting.",
    color: "#eab308",
  },
  2: {
    label: "Grade 2 — Distended",
    desc: "Content visible in both supine and RLD. Suggestive of non-fasting.",
    color: "#ef4444",
  },
};

export const PROTOCOL_STEPS: ProtocolStep[] = [
  {
    num: "1",
    title: "Patient Position & Probe Selection",
    details: [
      "体位：仰臥位 → 右側臥位（RLD）の順でスキャン",
      "プローブ：体重 < 30 kg → リニアプローブ（5–12 MHz）",
      "プローブ：体重 ≥ 30 kg → コンベックスプローブ（2–5 MHz）",
      "設定：腹部モード（Abdominal preset）",
    ],
  },
  {
    num: "2",
    title: "Scanning Plane & Landmarks",
    details: [
      "心窩部を矢状断面（Sagittal plane）でスキャン",
      "左肋弓下から右肋弓下へプローブをスイープ",
      "胃前庭部（Antrum）を同定する",
      "ランドマーク：肝左葉（前方）、膵体部（後方）、大動脈（深部）",
      "SMA（上腸間膜動脈）レベルで前庭部を同定",
    ],
  },
  {
    num: "3",
    title: "Qualitative Assessment (Grade 0–2)",
    details: [
      "Grade 0：仰臥位・RLD共に内容物なし（空虚 / bull's eye pattern）",
      "Grade 1：RLDでのみ液体が確認される（少量の基礎分泌と一致）",
      "Grade 2：仰臥位・RLD共に液体で拡張（非絶食状態を示唆）",
      "固形物：frosted-glass pattern、heterogeneous content",
    ],
  },
  {
    num: "4",
    title: "CSA Measurement (Quantitative)",
    details: [
      "RLD体位で大動脈レベルの前庭部を描出",
      "蠕動収縮の間（静止時）にフリーズ画像を取得",
      "Free-tracing tool でCSAを計測（漿膜から漿膜まで胃壁全層を含む）",
      "代替法：2径計測 → CSA = (AP × CC × π) / 4",
      "必ず蠕動間（antrum at rest）で計測すること",
    ],
  },
  {
    num: "5",
    title: "Volume Calculation & Risk Stratification",
    details: [
      "小児：Vol = −7.8 + (3.5 × CSA) + (0.127 × 月齢)  [Spencer 2014]",
      "成人：Vol = 27.0 + (14.6 × CSA) − (1.28 × 年齢)  [Perlas 2013]",
      "体重あたり ≤ 1.2 mL/kg → 正常絶食範囲（Low risk）",
      "体重あたり > 1.5 mL/kg → 非絶食状態（High risk）",
      "⚠ 固形・混合内容物が見られた場合 → Full stomach → CSA計測不要",
    ],
  },
];

export const CSA_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const AGE_GROUPS_MONTHS = [12, 24, 36, 48, 60, 72, 96, 120, 144, 180, 204];
export const AGE_GROUPS_YEARS = [20, 30, 40, 50, 60, 70, 80];

export const HISTORY_MAX = 50;
