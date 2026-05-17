import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 年間サマリー画面テンプレートで利用するstyle定義。
 */
type AnnualSummaryPageContentStyles = {
  /** 年間収入の使い道と補助指標の2カラム領域 */
  readonly breakdownGrid: SxProps<Theme>;
  /** 補助指標カード */
  readonly insightCard: SxProps<Theme>;
  /** 補助指標カードの注記 */
  readonly insightLabel: SxProps<Theme>;
  /** 補助指標一覧 */
  readonly insightList: SxProps<Theme>;
  /** 補助指標カードの見出し */
  readonly insightTitle: SxProps<Theme>;
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
    borderColor: "rgba(245, 158, 11, 0.32)",
    borderRadius: 1,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    justifyContent: "center",
    p: 3,
  },
  insightLabel: {
    color: "text.primary",
    fontSize: { sm: "0.95rem", xs: "0.85rem" },
  },
  insightList: {
    display: "grid",
    gap: 2,
  },
  insightTitle: {
    fontSize: { sm: "1.15rem", xs: "1.05rem" },
    fontWeight: 700,
    lineHeight: 1.2,
  },
  insightValue: {
    fontSize: { sm: "1.5rem", xs: "1.5rem" },
    fontWeight: 700,
    lineHeight: 1.1,
  },
  statGrid: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: {
      md: "repeat(4, 1fr)",
      sm: "repeat(2, 1fr)",
      xs: "repeat(2, minmax(0, 1fr))",
    },
    "@media (max-width: 389px)": {
      gridTemplateColumns: "1fr",
    },
  },
} satisfies AnnualSummaryPageContentStyles;
