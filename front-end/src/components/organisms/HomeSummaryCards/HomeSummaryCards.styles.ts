import type { SxProps, Theme } from "@mui/material/styles";

/**
 * ホーム画面の収支カード一覧で利用するstyle定義。
 */
type HomeSummaryCardsStyles = {
  /** PC幅で常時表示するカード一覧 */
  readonly desktopGrid: SxProps<Theme>;
  /** SP幅で開閉するカード領域 */
  readonly mobileCollapse: SxProps<Theme>;
  /** SP幅で開閉表示するカード一覧 */
  readonly mobileGrid: SxProps<Theme>;
  /** SP幅で表示する開閉ボタン */
  readonly toggleButton: SxProps<Theme>;
};

/** ホーム画面の収支カード一覧で利用するstyle群。 */
export const homeSummaryCardsStyles = {
  desktopGrid: {
    display: { sm: "grid", xs: "none" },
    gap: 2,
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
  mobileCollapse: {
    display: { sm: "none", xs: "block" },
  },
  mobileGrid: {
    display: "grid",
    gap: 1.5,
    gridTemplateColumns: "minmax(0, 1fr)",
    pt: 1.5,
  },
  toggleButton: {
    alignSelf: "flex-start",
    display: { sm: "none", xs: "inline-flex" },
  },
} satisfies HomeSummaryCardsStyles;
