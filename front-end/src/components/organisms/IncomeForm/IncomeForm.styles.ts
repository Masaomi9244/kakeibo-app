import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 収入フォームで利用するstyle定義。
 */
type IncomeFormStyles = {
  /** 予算対象チェック欄 */
  readonly includedCard: SxProps<Theme>;
  /** 予算対象チェック欄の中身 */
  readonly includedRow: SxProps<Theme>;
  /** 入力欄一覧 */
  readonly inputGrid: SxProps<Theme>;
  /** フォーム全体 */
  readonly root: SxProps<Theme>;
  /** フォーム上部 */
  readonly titleRow: SxProps<Theme>;
  /** 見出し */
  readonly title: SxProps<Theme>;
};

/** 収入フォームで利用するstyle群。 */
export const incomeFormStyles = {
  includedCard: {
    bgcolor: "rgba(17, 24, 39, 0.04)",
    borderRadius: 1,
    p: 2,
  },
  includedRow: {
    alignItems: "center",
  },
  inputGrid: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: { sm: "1fr 1fr", xs: "1fr" },
  },
  root: {
    borderRadius: 1,
    p: { sm: 3, xs: 2.5 },
  },
  title: {
    fontWeight: 700,
  },
  titleRow: {
    alignItems: "center",
    justifyContent: "space-between",
  },
} satisfies IncomeFormStyles;
