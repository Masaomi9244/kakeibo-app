import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 年間サマリー画面テンプレートで利用するstyle定義。
 */
type AnnualSummaryPageContentStyles = {
  /** PC幅で横並びにする年間グラフ一覧 */
  readonly chartGrid: SxProps<Theme>;
  /** 最多支出月カード */
  readonly highlightCard: SxProps<Theme>;
  /** 最多支出月の値 */
  readonly highlightValue: SxProps<Theme>;
  /** 統計カード一覧 */
  readonly statGrid: SxProps<Theme>;
};

/** 年間サマリー画面テンプレートで利用するstyle群。 */
export const annualSummaryPageContentStyles = {
  chartGrid: {
    alignItems: "stretch",
    display: "grid",
    gap: 3,
    gridTemplateColumns: { md: "minmax(0, 1fr) minmax(0, 1fr)", xs: "1fr" },
  },
  highlightCard: {
    bgcolor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    borderRadius: 1,
    p: { sm: 3, xs: 2.5 },
  },
  highlightValue: {
    fontWeight: 700,
  },
  statGrid: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: {
      md: "repeat(4, 1fr)",
      sm: "repeat(2, 1fr)",
      xs: "1fr 1fr",
    },
  },
} satisfies AnnualSummaryPageContentStyles;
