import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 統計カードで利用するstyle定義。
 */
type StatCardStyles = {
  /** 統計カードの外枠 */
  readonly root: SxProps<Theme>;
};

/** 統計カードで利用するstyle群。 */
export const statCardStyles = {
  root: {
    borderRadius: 1,
    minHeight: 104,
    p: 2,
  },
} satisfies StatCardStyles;
