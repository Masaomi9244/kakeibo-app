import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 年間サマリー画面テンプレートで利用するstyle定義。
 */
type AnnualSummaryPageContentStyles = {
  /** 年間収支内訳と補助指標の2カラム領域 */
  readonly breakdownGrid: SxProps<Theme>;
  /** 補助指標カード */
  readonly insightCard: SxProps<Theme>;
  /** 補助指標一覧 */
  readonly insightList: SxProps<Theme>;
  /** 補助指標の値 */
  readonly insightValue: SxProps<Theme>;
  /** 統計カード一覧 */
  readonly statGrid: SxProps<Theme>;
};

/** 年間サマリー画面テンプレートで利用するstyle群。 */
export const annualSummaryPageContentStyles = {
  breakdownGrid: {
    alignItems: "stretch",
    display: "grid",
    gap: 3,
    gridTemplateColumns: { md: "minmax(0, 1fr) minmax(0, 1fr)", xs: "1fr" },
  },
  insightCard: {
    bgcolor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    borderRadius: 1,
    p: { sm: 3, xs: 2.5 },
  },
  insightList: {
    display: "grid",
    gap: 2,
  },
  insightValue: {
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
