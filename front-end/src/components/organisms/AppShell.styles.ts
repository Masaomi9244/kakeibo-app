import type { SxProps, Theme } from "@mui/material/styles";

/**
 * アプリ共通レイアウトで利用するstyle定義。
 */
type AppShellStyles = {
  /** SPヘッダーのブランド表示 */
  readonly mobileHeaderBrand: SxProps<Theme>;
  /** SPヘッダーのブランドアイコン */
  readonly mobileHeaderIcon: SxProps<Theme>;
  /** SPヘッダーのログアウトボタン */
  readonly mobileHeaderLogoutButton: SxProps<Theme>;
  /** SPヘッダー */
  readonly mobileHeader: SxProps<Theme>;
  /** SPヘッダーのアプリ名 */
  readonly mobileHeaderTitle: SxProps<Theme>;
  /** 画面本体 */
  readonly pageMain: SxProps<Theme>;
  /** レイアウト全体 */
  readonly root: SxProps<Theme>;
};

/** アプリ共通レイアウトで利用するstyle群。 */
export const appShellStyles = {
  mobileHeader: {
    alignItems: "center",
    bgcolor: "background.paper",
    borderBottom: 1,
    borderColor: "divider",
    display: { md: "none", xs: "flex" },
    height: 64,
    justifyContent: "space-between",
    px: 2,
  },
  mobileHeaderBrand: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 1.25,
  },
  mobileHeaderIcon: {
    alignItems: "center",
    bgcolor: "primary.main",
    borderRadius: 1.25,
    color: "primary.contrastText",
    display: "inline-flex",
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  mobileHeaderLogoutButton: {
    minWidth: 40,
    px: 1,
  },
  mobileHeaderTitle: {
    fontWeight: 700,
  },
  pageMain: {
    ml: { md: "248px", xs: 0 },
    pb: { md: 6, xs: 12 },
    pt: { md: 4, xs: 3 },
  },
  root: {
    minHeight: "100dvh",
  },
} satisfies AppShellStyles;
