"use client";

import type { ReactElement } from "react";

import { Alert, Box, Paper, Stack, Typography } from "@mui/material";

import { StatCard } from "@/components/molecules/StatCard";
import { SummaryChart } from "@/components/organisms/SummaryChart/SummaryChart";
import { SummaryPieChart } from "@/components/organisms/SummaryPieChart/SummaryPieChart";
import { annualSummaryPageContentStyles } from "@/components/templates/AnnualSummaryPageContent/AnnualSummaryPageContent.styles";
import { useAnnualSummaryPageViewModel } from "@/features/annual-summary/hooks/useAnnualSummaryPageViewModel";

/**
 * @description 年間サマリー画面のview model接続済みコンテンツ全体を表示する。
 * @param なし
 * @returns 年間サマリー画面のコンテンツUI。
 * @example
 * <AnnualSummaryPageContent />
 */
export function AnnualSummaryPageContent(): ReactElement {
  /** 年間サマリー画面の表示状態 */
  const annualSummaryPage = useAnnualSummaryPageViewModel();

  return (
    <Stack spacing={3}>
      {annualSummaryPage.annualSummaryErrorMessage !== undefined ? (
        <Alert severity="error">{annualSummaryPage.annualSummaryErrorMessage}</Alert>
      ) : null}
      {annualSummaryPage.annualSummaryIsLoading ? (
        <Alert severity="info">年間サマリーを読み込んでいます</Alert>
      ) : null}
      <Box sx={annualSummaryPageContentStyles.statGrid}>
        {annualSummaryPage.statCards.map((statCard) => (
          <StatCard
            amount={statCard.amount}
            emphasized={statCard.emphasized}
            key={statCard.id}
            label={statCard.label}
            tone={statCard.tone}
          />
        ))}
      </Box>
      <SummaryChart
        metrics={annualSummaryPage.monthlyTrendMetrics}
        title={annualSummaryPage.monthlyTrendTitle}
      />
      <Box sx={annualSummaryPageContentStyles.breakdownGrid}>
        <SummaryPieChart
          metrics={annualSummaryPage.annualBreakdownMetrics}
          title={annualSummaryPage.annualBreakdownTitle}
        />
        <Box sx={annualSummaryPageContentStyles.insightList}>
          {annualSummaryPage.annualInsightCards.map((insightCard) => (
            <Paper
              key={insightCard.title}
              variant="outlined"
              sx={annualSummaryPageContentStyles.insightCard}
            >
              <Typography sx={annualSummaryPageContentStyles.insightTitle} variant="h6">
                {insightCard.title}
              </Typography>
              <Typography sx={annualSummaryPageContentStyles.insightValue}>
                {insightCard.value}
              </Typography>
              {insightCard.label !== undefined ? (
                <Typography
                  sx={annualSummaryPageContentStyles.insightLabel}
                  variant="body2"
                >
                  {insightCard.label}
                </Typography>
              ) : null}
            </Paper>
          ))}
        </Box>
      </Box>
    </Stack>
  );
}
