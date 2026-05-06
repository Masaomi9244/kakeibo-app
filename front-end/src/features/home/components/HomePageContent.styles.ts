import type { SxProps, Theme } from "@mui/material/styles";

/**
 * ホーム画面componentで利用するstyle定義。
 */
type HomePageContentStyles = {
  readonly budgetHero: SxProps<Theme>;
  readonly budgetHeroFooter: SxProps<Theme>;
  readonly quickExpenseCard: SxProps<Theme>;
  readonly quickExpenseInputRow: SxProps<Theme>;
  readonly statGrid: SxProps<Theme>;
  readonly todayExpenseItem: SxProps<Theme>;
  readonly todayExpensesCard: SxProps<Theme>;
  readonly todayExpensesHeader: SxProps<Theme>;
  readonly todayExpensesList: SxProps<Theme>;
  readonly todayExpensesTotal: SxProps<Theme>;
};

/**
 * ホーム画面componentで利用するstyle。
 */
export const homePageContentStyles = {
  budgetHero: {
    background: "linear-gradient(135deg, #0d9488 0%, #45b39d 100%)",
    borderRadius: 1,
    color: "common.white",
    p: { sm: 4, xs: 3 },
  },
  budgetHeroFooter: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  quickExpenseCard: {
    borderRadius: 1,
    p: { sm: 3, xs: 2.5 },
  },
  quickExpenseInputRow: {
    alignItems: "center",
  },
  statGrid: {
    display: "grid",
    gap: 2,
    gridTemplateColumns: {
      md: "repeat(3, 1fr)",
      xs: "repeat(3, minmax(0, 1fr))",
    },
  },
  todayExpenseItem: {
    alignItems: "center",
    bgcolor: "rgba(13, 148, 136, 0.04)",
    borderRadius: 1,
    display: "flex",
    justifyContent: "space-between",
    minHeight: 64,
    px: 2,
  },
  todayExpensesCard: {
    borderRadius: 1,
    overflow: "hidden",
  },
  todayExpensesHeader: {
    p: { sm: 3, xs: 2.5 },
    pb: 1,
  },
  todayExpensesList: {
    p: { sm: 3, xs: 2.5 },
    pt: 1,
  },
  todayExpensesTotal: {
    alignItems: "center",
    borderColor: "divider",
    borderTop: 1,
    display: "flex",
    justifyContent: "space-between",
    pt: 2,
  },
} satisfies HomePageContentStyles;
