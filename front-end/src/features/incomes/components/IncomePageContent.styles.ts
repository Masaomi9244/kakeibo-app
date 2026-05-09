import type { SxProps, Theme } from "@mui/material/styles";

/**
 * 収入画面componentで利用するstyle定義。
 */
type IncomePageContentStyles = {
  readonly formCard: SxProps<Theme>;
  readonly formGrid: SxProps<Theme>;
  readonly includedCard: SxProps<Theme>;
  readonly includedRow: SxProps<Theme>;
  readonly incomeBadge: SxProps<Theme>;
  readonly incomeHero: SxProps<Theme>;
  readonly incomeListCard: SxProps<Theme>;
  readonly incomeListHeader: SxProps<Theme>;
  readonly incomeListRow: SxProps<Theme>;
  readonly summaryGrid: SxProps<Theme>;
};

/**
 * 収入画面componentで利用するstyle。
 */
export const incomePageContentStyles = {
  formCard: {
    borderRadius: 1,
    p: { sm: 3, xs: 2.5 },
  },
  formGrid: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: { sm: "1fr 1fr", xs: "1fr" },
  },
  includedCard: {
    bgcolor: "rgba(17, 24, 39, 0.04)",
    borderRadius: 1,
    p: 2,
  },
  includedRow: {
    alignItems: "center",
  },
  incomeBadge: {
    bgcolor: "rgba(5, 150, 105, 0.1)",
    borderRadius: 1,
    px: 1,
  },
  incomeHero: {
    background: "linear-gradient(135deg, #059669 0%, #45b39d 100%)",
    borderRadius: 1,
    color: "common.white",
    p: 3,
  },
  incomeListCard: {
    borderRadius: 1,
    overflow: "hidden",
  },
  incomeListHeader: {
    p: { sm: 3, xs: 2.5 },
  },
  incomeListRow: {
    alignItems: { sm: "center", xs: "flex-start" },
    display: "grid",
    gap: 2,
    gridTemplateColumns: { sm: "1fr auto auto", xs: "1fr" },
    p: { sm: 2.5, xs: 2 },
  },
  summaryGrid: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
  },
} satisfies IncomePageContentStyles;
