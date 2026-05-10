import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 予算ヒーローで利用するstyle定義。
 */
type BudgetHeroStyles = {
  /** 強調ラベル */
  readonly label: SxProps<Theme>;
  /** 予算ヒーロー全体 */
  readonly root: SxProps<Theme>;
};

/** 予算ヒーローで利用するstyle群。 */
export const budgetHeroStyles = {
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
