import type { SxProps, Theme } from "@mui/material/styles";

/**
 * アプリ共通レイアウトで利用するstyle定義。
 */
type AppShellStyles = {
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
