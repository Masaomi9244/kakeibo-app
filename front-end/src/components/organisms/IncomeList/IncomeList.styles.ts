import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 収入一覧で利用するstyle定義。
 */
type IncomeListStyles = {
  /** 予算対象バッジ */
  readonly badge: SxProps<Theme>;
  /** 操作ボタン一覧 */
  readonly controlRow: SxProps<Theme>;
  /** 区切り線 */
  readonly divider: SxProps<Theme>;
  /** 一覧見出し */
  readonly header: SxProps<Theme>;
  /** 収入名とバッジの行 */
  readonly nameRow: SxProps<Theme>;
  /** 一覧行 */
  readonly row: SxProps<Theme>;
  /** 一覧全体 */
  readonly root: SxProps<Theme>;
  /** 強調テキスト */
  readonly strongText: SxProps<Theme>;
};

/** 収入一覧で利用するstyle群。 */
export const incomeListStyles = {
  badge: {
    bgcolor: "rgba(5, 150, 105, 0.1)",
    borderRadius: 1,
    px: 1,
  },
  controlRow: {
    alignItems: "center",
  },
  divider: {
    borderColor: "divider",
    borderTop: 1,
  },
  header: {
    p: { sm: 2.5, xs: 2 },
  },
  nameRow: {
    alignItems: "center",
  },
  root: {
    borderRadius: 1,
    overflow: "hidden",
  },
  row: {
    alignItems: { sm: "center", xs: "flex-start" },
    display: "grid",
    gap: 2,
    gridTemplateColumns: { sm: "1fr auto auto", xs: "1fr" },
    p: { sm: 2.5, xs: 2 },
  },
  strongText: {
    fontWeight: 700,
  },
} satisfies IncomeListStyles;
