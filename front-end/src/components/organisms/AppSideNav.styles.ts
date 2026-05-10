import type { SxProps, Theme } from "@mui/material/styles";

/**
 * PCサイドナビで利用するstyle定義。
 */
type AppSideNavStyles = {
  /** アプリ名 */
  readonly appName: SxProps<Theme>;
  /** ブランドアイコン */
  readonly brandIcon: SxProps<Theme>;
  /** アプリ名とブランドアイコンの行 */
  readonly brandRow: SxProps<Theme>;
  /** ナビリンク内のアイコン */
  readonly itemIcon: SxProps<Theme>;
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
  brandIcon: {
    alignItems: "center",
    bgcolor: "primary.main",
    borderRadius: 1.5,
    color: "primary.contrastText",
    display: "inline-flex",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  brandRow: {
    alignItems: "center",
    display: "flex",
    gap: 1.5,
  },
  itemIcon: {
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center",
    mr: 1.5,
    width: 22,
  },
  logoutArea: {
    p: 2,
  },
  logoutButton: {
    justifyContent: "flex-start",
    textTransform: "none",
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
