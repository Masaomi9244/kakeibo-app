import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 金額ヒーローカードで利用するstyle定義。
 */
type AmountHeroCardStyles = {
  /** 強調ラベル */
  readonly label: SxProps<Theme>;
  /** 金額ヒーローカード全体 */
  readonly root: SxProps<Theme>;
};

/** 金額ヒーローカードで利用するstyle群。 */
export const amountHeroCardStyles = {
  label: {
    fontWeight: 700,
  },
  root: {
    background: "linear-gradient(135deg, #0d9488 0%, #45b39d 100%)",
    borderRadius: 1,
    color: "common.white",
    p: { sm: 4, xs: 3 },
  },
} satisfies AmountHeroCardStyles;
