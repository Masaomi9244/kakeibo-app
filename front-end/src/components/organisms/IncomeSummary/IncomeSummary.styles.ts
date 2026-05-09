import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 収入サマリーで利用するstyle定義。
 */
type IncomeSummaryStyles = {
  /** 収入ヒーローカード */
  readonly incomeHero: SxProps<Theme>;
  /** 収入ヒーロー内のラベル */
  readonly incomeHeroLabel: SxProps<Theme>;
  /** サマリーカード一覧 */
  readonly summaryGrid: SxProps<Theme>;
};

/** 収入サマリーで利用するstyle群。 */
export const incomeSummaryStyles = {
  incomeHero: {
    background: "linear-gradient(135deg, #059669 0%, #45b39d 100%)",
    borderRadius: 1,
    color: "common.white",
    p: 3,
  },
  incomeHeroLabel: {
    fontWeight: 700,
  },
  summaryGrid: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
  },
} satisfies IncomeSummaryStyles;
