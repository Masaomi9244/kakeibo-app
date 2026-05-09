import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 画面見出しで利用するstyle定義。
 */
type PageHeaderStyles = {
  /** 見出しタイトル */
  readonly title: SxProps<Theme>;
};

/** 画面見出しで利用するstyle群。 */
export const pageHeaderStyles = {
  title: {
    fontWeight: 700,
    letterSpacing: 0,
  },
} satisfies PageHeaderStyles;
