"use client";

import type { ReactElement } from "react";

import { Alert, Button, Paper, Snackbar, Stack, Typography } from "@mui/material";

import { PageHeader } from "@/components/molecules/PageHeader";
import { BudgetHero } from "@/components/organisms/BudgetHero/BudgetHero";
import { HomeSummaryCards } from "@/components/organisms/HomeSummaryCards/HomeSummaryCards";
import { QuickExpenseInput } from "@/components/organisms/QuickExpenseInput/QuickExpenseInput";
import { TodayExpensesCard } from "@/components/organisms/TodayExpensesCard/TodayExpensesCard";
import {
  buildHomeSummaryCardsProps,
  buildQuickExpenseInputProps,
} from "@/components/templates/HomePageContent/HomePageContent.props";
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
  /** 出費クイック入力componentへ渡すprops */
  const quickExpenseInputProps = buildQuickExpenseInputProps(
    homePage.quickExpenseInput,
  );
  /** 月次サマリー */
  const monthlySummary = homePage.monthlySummary;
  /** ホーム画面の収支カード一覧componentへ渡すprops */
  const summaryCardsProps =
    monthlySummary === undefined
      ? undefined
      : buildHomeSummaryCardsProps(monthlySummary, homePage.summaryCardsDisclosure);

  return (
    <Stack spacing={3}>
      <PageHeader subtitle={homePage.currentMonthLabel} title="ホーム" />
      {homePage.monthlySummaryErrorMessage === undefined ? null : (
        <Alert severity="error">{homePage.monthlySummaryErrorMessage}</Alert>
      )}
      {homePage.todayExpensesErrorMessage === undefined ? null : (
        <Alert severity="error">{homePage.todayExpensesErrorMessage}</Alert>
      )}
      {monthlySummary === undefined || summaryCardsProps === undefined ? (
        <Paper variant="outlined" sx={homePageContentStyles.loadingCard}>
          <Typography color="text.secondary">月次サマリーを読み込んでいます</Typography>
        </Paper>
      ) : (
        <>
          <BudgetHero remainingAmount={monthlySummary.remainingAmount} />
          <HomeSummaryCards {...summaryCardsProps} />
        </>
      )}
      <QuickExpenseInput {...quickExpenseInputProps} />
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
