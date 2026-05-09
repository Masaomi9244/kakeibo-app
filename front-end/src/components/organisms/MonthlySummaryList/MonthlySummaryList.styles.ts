import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 月別サマリー一覧で利用するstyle定義。
 */
type MonthlySummaryListStyles = {
  /** 区切り線 */
  readonly divider: SxProps<Theme>;
  /** 一覧見出し */
  readonly header: SxProps<Theme>;
  /** 一覧行 */
  readonly row: SxProps<Theme>;
  /** 一覧全体 */
  readonly root: SxProps<Theme>;
  /** 強調テキスト */
  readonly strongText: SxProps<Theme>;
};

/** 月別サマリー一覧で利用するstyle群。 */
export const monthlySummaryListStyles = {
  divider: {
    borderColor: "divider",
    borderTop: 1,
  },
  header: {
    p: { sm: 3, xs: 2.5 },
  },
  root: {
    borderRadius: 1,
    overflow: "hidden",
  },
  row: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: {
      md: "96px repeat(7, minmax(0, 1fr))",
      xs: "1fr 1fr",
    },
    p: { sm: 2.5, xs: 2 },
  },
  strongText: {
    fontWeight: 700,
  },
} satisfies MonthlySummaryListStyles;
