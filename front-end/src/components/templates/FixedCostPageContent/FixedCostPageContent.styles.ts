import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 固定費画面テンプレートで利用するstyle定義。
 */
type FixedCostPageContentStyles = {
  /** 統計カード一覧 */
  readonly statGrid: SxProps<Theme>;
};

/** 固定費画面テンプレートで利用するstyle群。 */
export const fixedCostPageContentStyles = {
  statGrid: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
  },
} satisfies FixedCostPageContentStyles;
