import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 固定費説明カードで利用するstyle定義。
 */
type FixedCostGuideStyles = {
  /** 説明カード全体 */
  readonly root: SxProps<Theme>;
};

/** 固定費説明カードで利用するstyle群。 */
export const fixedCostGuideStyles = {
  root: {
    bgcolor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    borderRadius: 1,
    p: { sm: 3, xs: 2.5 },
  },
} satisfies FixedCostGuideStyles;
