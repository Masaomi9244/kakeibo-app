import type { SxProps, Theme } from "@mui/material/styles";

/**
 * PCサイドナビで利用するstyle定義。
 */
type AppSideNavStyles = {
  /** アプリ名 */
  readonly appName: SxProps<Theme>;
  /** ナビリンク内の記号 */
  readonly itemMark: SxProps<Theme>;
  /** ログアウト領域 */
  readonly logoutArea: SxProps<Theme>;
  /** ログアウトボタン */
  readonly logoutButton: SxProps<Theme>;
  /** ナビリンク一覧 */
  readonly navList: SxProps<Theme>;
  /** サイドナビ全体 */
  readonly root: SxProps<Theme>;
  /** サイドナビ上部のユーザー情報 */
  readonly userBlock: SxProps<Theme>;
};

/** PCサイドナビで利用するstyle群。 */
export const appSideNavStyles = {
  appName: {
    fontWeight: 700,
  },
  itemMark: {
    display: "inline-flex",
    fontWeight: 700,
    mr: 1.5,
    width: 20,
  },
  logoutArea: {
    p: 2,
  },
  logoutButton: {
    justifyContent: "flex-start",
  },
  navList: {
    flex: 1,
    p: 2,
  },
  root: {
    bgcolor: "background.paper",
    borderRight: 1,
    borderColor: "divider",
    bottom: 0,
    display: { md: "flex", xs: "none" },
    flexDirection: "column",
    left: 0,
    position: "fixed",
    top: 0,
    width: 248,
  },
  userBlock: {
    p: 3,
  },
} satisfies AppSideNavStyles;

/**
 * @description PCサイドナビのリンク状態に応じたstyleを作成する。
 * @param isActive - 現在表示中の画面に対応するリンクか。
 * @returns サイドナビリンクへ渡すsx。
 * @example
 * getSideNavItemSx(true);
 */
export const getSideNavItemSx = (isActive: boolean): SxProps<Theme> => ({
  color: isActive ? "primary.contrastText" : "text.primary",
  justifyContent: "flex-start",
  minHeight: 48,
  px: 2,
});
