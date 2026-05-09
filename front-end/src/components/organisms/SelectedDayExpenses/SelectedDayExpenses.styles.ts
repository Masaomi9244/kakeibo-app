import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 選択日の出費一覧で利用するstyle定義。
 */
type SelectedDayExpensesStyles = {
  /** 合計エリア */
  readonly amountSummary: SxProps<Theme>;
  /** 区切り線 */
  readonly divider: SxProps<Theme>;
  /** 見出しエリア */
  readonly header: SxProps<Theme>;
  /** 出費1件の行 */
  readonly item: SxProps<Theme>;
  /** カード全体 */
  readonly root: SxProps<Theme>;
  /** 強調値 */
  readonly value: SxProps<Theme>;
};

/** 選択日の出費一覧で利用するstyle群。 */
export const selectedDayExpensesStyles = {
  amountSummary: {
    bgcolor: "rgba(220, 38, 38, 0.06)",
    p: { sm: 2.5, xs: 2 },
  },
  divider: {
    borderColor: "divider",
    borderTop: 1,
  },
  header: {
    p: { sm: 3, xs: 2.5 },
  },
  item: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    p: { sm: 2.5, xs: 2 },
  },
  root: {
    borderRadius: 1,
    overflow: "hidden",
  },
  value: {
    fontWeight: 700,
  },
} satisfies SelectedDayExpensesStyles;
