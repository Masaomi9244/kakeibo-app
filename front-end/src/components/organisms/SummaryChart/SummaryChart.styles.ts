import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 年間サマリーグラフで利用するstyle定義。
 */
type SummaryChartStyles = {
  /** 指標列一覧 */
  readonly chartBody: SxProps<Theme>;
  /** グラフカード全体 */
  readonly root: SxProps<Theme>;
  /** 見出し */
  readonly title: SxProps<Theme>;
};

/** 年間サマリーグラフで利用するstyle群。 */
export const summaryChartStyles = {
  chartBody: {
    display: "flex",
    gap: 2,
    overflowX: "auto",
    pb: 1,
  },
  root: {
    borderRadius: 1,
    p: { sm: 3, xs: 2 },
  },
  title: {
    fontWeight: 700,
  },
} satisfies SummaryChartStyles;
