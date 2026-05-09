import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 出費クイック入力で利用するstyle定義。
 */
type QuickExpenseInputStyles = {
  /** カード全体 */
  readonly card: SxProps<Theme>;
  /** 見出し */
  readonly heading: SxProps<Theme>;
  /** 金額入力の通貨記号と入力欄を並べる行 */
  readonly inputRow: SxProps<Theme>;
};

/** 出費クイック入力で利用するstyle群。 */
export const quickExpenseInputStyles = {
  card: {
    borderRadius: 1,
    p: { sm: 3, xs: 2.5 },
  },
  heading: {
    fontWeight: 700,
  },
  inputRow: {
    alignItems: "center",
  },
} satisfies QuickExpenseInputStyles;
