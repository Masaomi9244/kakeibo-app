import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 今日の出費カードで利用するstyle定義。
 */
type TodayExpensesCardStyles = {
  /** カード見出し */
  readonly heading: SxProps<Theme>;
  /** カード上部 */
  readonly header: SxProps<Theme>;
  /** 出費1件の行 */
  readonly item: SxProps<Theme>;
  /** 出費一覧 */
  readonly list: SxProps<Theme>;
  /** カード全体 */
  readonly root: SxProps<Theme>;
  /** 合計行 */
  readonly total: SxProps<Theme>;
};

/** 今日の出費カードで利用するstyle群。 */
export const todayExpensesCardStyles = {
  heading: {
    fontWeight: 700,
  },
  header: {
    p: { sm: 3, xs: 2.5 },
    pb: 1,
  },
  item: {
    alignItems: "center",
    bgcolor: "rgba(13, 148, 136, 0.04)",
    borderRadius: 1,
    display: "flex",
    justifyContent: "space-between",
    minHeight: 64,
    px: 2,
  },
  list: {
    p: { sm: 3, xs: 2.5 },
    pt: 1,
  },
  root: {
    borderRadius: 1,
    overflow: "hidden",
  },
  total: {
    alignItems: "center",
    borderColor: "divider",
    borderTop: 1,
    display: "flex",
    justifyContent: "space-between",
    pt: 2,
  },
} satisfies TodayExpensesCardStyles;
