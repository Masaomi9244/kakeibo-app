import type { SxProps, Theme } from "@mui/material/styles";

/**
 * ホーム画面テンプレートで利用するstyle定義。
 */
type HomePageContentStyles = {
  /** 読み込み中表示カード */
  readonly loadingCard: SxProps<Theme>;
};

/** ホーム画面テンプレートで利用するstyle群。 */
export const homePageContentStyles = {
  loadingCard: {
    borderRadius: 1,
    p: { sm: 3, xs: 2.5 },
  },
} satisfies HomePageContentStyles;
