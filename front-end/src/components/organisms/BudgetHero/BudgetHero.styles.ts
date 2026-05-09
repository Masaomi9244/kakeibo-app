import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 予算ヒーローで利用するstyle定義。
 */
type BudgetHeroStyles = {
  /** 今日使える目安を表示する下部行 */
  readonly footer: SxProps<Theme>;
  /** 強調ラベル */
  readonly label: SxProps<Theme>;
  /** 予算ヒーロー全体 */
  readonly root: SxProps<Theme>;
};

/** 予算ヒーローで利用するstyle群。 */
export const budgetHeroStyles = {
  footer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: 700,
  },
  root: {
    background: "linear-gradient(135deg, #0d9488 0%, #45b39d 100%)",
    borderRadius: 1,
    color: "common.white",
    p: { sm: 4, xs: 3 },
  },
} satisfies BudgetHeroStyles;
