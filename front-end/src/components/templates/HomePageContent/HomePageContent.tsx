"use client";

import type { ReactElement } from "react";

import { Alert, Box, Button, Paper, Snackbar, Stack, Typography } from "@mui/material";

import { PageHeader } from "@/components/molecules/PageHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { BudgetHero } from "@/components/organisms/BudgetHero/BudgetHero";
import { QuickExpenseInput } from "@/components/organisms/QuickExpenseInput/QuickExpenseInput";
import { TodayExpensesCard } from "@/components/organisms/TodayExpensesCard/TodayExpensesCard";
import { homePageContentStyles } from "@/components/templates/HomePageContent/HomePageContent.styles";
import { useHomePageViewModel } from "@/features/home/hooks/useHomePageViewModel";

/**
 * @description ホーム画面のAPI接続済みコンテンツ全体を表示する。
 * @param なし
 * @returns ホーム画面のコンテンツUI。
 * @example
 * <HomePageContent />
 */
export function HomePageContent(): ReactElement {
  /** ホーム画面の表示状態とevent handler */
  const homePage = useHomePageViewModel();

  return (
    <Stack spacing={3}>
      <PageHeader subtitle={homePage.currentMonthLabel} title="ホーム" />
      {homePage.monthlySummaryErrorMessage === undefined ? null : (
        <Alert severity="error">{homePage.monthlySummaryErrorMessage}</Alert>
      )}
      {homePage.todayExpensesErrorMessage === undefined ? null : (
        <Alert severity="error">{homePage.todayExpensesErrorMessage}</Alert>
      )}
      {homePage.monthlySummary === undefined ? (
        <Paper variant="outlined" sx={homePageContentStyles.loadingCard}>
          <Typography color="text.secondary">月次サマリーを読み込んでいます</Typography>
        </Paper>
      ) : (
        <>
          <BudgetHero remainingAmount={homePage.monthlySummary.remainingAmount} />
          <Box sx={homePageContentStyles.statGrid}>
            <StatCard
              amount={homePage.monthlySummary.availableIncome}
              label="収入"
              tone="income"
            />
            <StatCard
              amount={homePage.monthlySummary.fixedCostTotal}
              label="固定費"
              tone="fixedCost"
            />
            <StatCard
              amount={homePage.monthlySummary.expenseTotal}
              label="出費"
              tone="expense"
            />
          </Box>
        </>
      )}
      <QuickExpenseInput
        amountInput={homePage.quickExpenseInput.amountInput}
        errorMessage={homePage.quickExpenseInput.errorMessage}
        isSubmitting={homePage.quickExpenseInput.isSubmitting}
        onAmountBlur={homePage.quickExpenseInput.handleAmountBlur}
        onAmountChange={homePage.quickExpenseInput.handleAmountChange}
        onAmountKeyDown={homePage.quickExpenseInput.handleAmountKeyDown}
      />
      <TodayExpensesCard
        expenses={homePage.todayExpenses}
        isLoading={homePage.todayExpensesIsLoading}
        total={homePage.todayTotal}
      />
      <Snackbar
        action={
          <Button
            color="inherit"
            disabled={homePage.snackbar.isUndoing || !homePage.snackbar.canUndo}
            onClick={() => {
              void homePage.snackbar.handleUndo();
            }}
            size="small"
          >
            取り消す
          </Button>
        }
        autoHideDuration={5000}
        message={homePage.snackbar.message}
        onClose={homePage.snackbar.handleClose}
        open={homePage.snackbar.isOpen}
      />
    </Stack>
  );
}
