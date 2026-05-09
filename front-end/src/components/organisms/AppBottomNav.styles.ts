import type { SxProps, Theme } from "@mui/material/styles";

/**
 * SP下部ナビで利用するstyle定義。
 */
type AppBottomNavStyles = {
  /** ナビ項目の中身 */
  readonly itemContent: SxProps<Theme>;
  /** ナビ項目の記号 */
  readonly itemMark: SxProps<Theme>;
  /** ナビ一覧 */
  readonly navGrid: SxProps<Theme>;
  /** 下部ナビ全体 */
  readonly root: SxProps<Theme>;
};

/** SP下部ナビで利用するstyle群。 */
export const appBottomNavStyles = {
  itemContent: {
    alignItems: "center",
  },
  itemMark: {
    border: 1,
    borderColor: "currentColor",
    borderRadius: 1,
    fontSize: 12,
    fontWeight: 700,
    height: 22,
    lineHeight: "20px",
    width: 22,
  },
  navGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    minHeight: 72,
  },
  root: {
    borderTop: 1,
    borderColor: "divider",
    bottom: 0,
    display: { md: "none", xs: "block" },
    left: 0,
    position: "fixed",
    right: 0,
    zIndex: "appBar",
  },
} satisfies AppBottomNavStyles;

/**
 * @description SP下部ナビのリンク状態に応じたButtonBase用sxを作成する。
 * @param isActive - 現在表示中の画面に対応するリンクか。
 * @returns ButtonBaseへ渡すsx。
 * @example
 * getBottomNavItemSx(true);
 */
export const getBottomNavItemSx = (isActive: boolean): SxProps<Theme> => ({
  color: isActive ? "primary.main" : "text.secondary",
  px: 0.5,
});

/**
 * @description SP下部ナビのリンク状態に応じたラベル用sxを作成する。
 * @param isActive - 現在表示中の画面に対応するリンクか。
 * @returns Typographyへ渡すsx。
 * @example
 * getBottomNavLabelSx(true);
 */
export const getBottomNavLabelSx = (isActive: boolean): SxProps<Theme> => ({
  fontSize: 12,
  fontWeight: isActive ? 700 : 500,
  letterSpacing: 0,
  lineHeight: 1.2,
});
