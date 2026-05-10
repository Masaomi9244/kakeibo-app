import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 固定費フォームで利用するstyle定義。
 */
type FixedCostFormStyles = {
  /** 開始月入力欄と補足文言 */
  readonly startMonthField: SxProps<Theme>;
  /** 開始月入力欄の補足文言 */
  readonly startMonthHelpText: SxProps<Theme>;
  /** 入力欄一覧 */
  readonly inputGrid: SxProps<Theme>;
  /** フォーム全体 */
  readonly root: SxProps<Theme>;
  /** 見出し */
  readonly title: SxProps<Theme>;
};

/** 固定費フォームで利用するstyle群。 */
export const fixedCostFormStyles = {
  inputGrid: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: { sm: "1fr 1fr", xs: "1fr" },
  },
  root: {
    borderRadius: 1,
    p: { sm: 3, xs: 2.5 },
  },
  startMonthField: {
    display: "grid",
    gap: 0.75,
  },
  startMonthHelpText: {
    pl: { sm: 1.75, xs: 1.5 },
  },
  title: {
    fontWeight: 700,
  },
} satisfies FixedCostFormStyles;
