import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 統計カードで利用するstyle定義。
 */
type StatCardStyles = {
  /** 強調表示する統計カードの外枠 */
  readonly emphasizedRoot: SxProps<Theme>;
  /** 統計カードの外枠 */
  readonly root: SxProps<Theme>;
};

/** 統計カードで利用するstyle群。 */
export const statCardStyles = {
  emphasizedRoot: {
    bgcolor: "#ecfdf5",
    borderColor: "#bbf7d0",
  },
  root: {
    borderRadius: 1,
    minHeight: 104,
    p: 2,
  },
} satisfies StatCardStyles;
