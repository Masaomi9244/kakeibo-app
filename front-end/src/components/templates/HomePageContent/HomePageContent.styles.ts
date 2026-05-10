import type { SxProps, Theme } from "@mui/material/styles";

/**
 * ホーム画面テンプレートで利用するstyle定義。
 */
type HomePageContentStyles = {
  /** 読み込み中表示カード */
  readonly loadingCard: SxProps<Theme>;
  /** 統計カード一覧 */
  readonly statGrid: SxProps<Theme>;
};

/** ホーム画面テンプレートで利用するstyle群。 */
export const homePageContentStyles = {
  loadingCard: {
    borderRadius: 1,
    p: { sm: 3, xs: 2.5 },
  },
  statGrid: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: {
      md: "repeat(3, 1fr)",
      sm: "repeat(3, minmax(0, 1fr))",
      xs: "repeat(2, minmax(0, 1fr))",
    },
  },
} satisfies HomePageContentStyles;
