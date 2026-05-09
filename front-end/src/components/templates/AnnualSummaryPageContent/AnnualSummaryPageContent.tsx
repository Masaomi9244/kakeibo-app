import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import { PageHeader } from "@/components/molecules/PageHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { MonthlySummaryList } from "@/components/organisms/MonthlySummaryList/MonthlySummaryList";
import { SummaryChart } from "@/components/organisms/SummaryChart/SummaryChart";
import { annualSummaryPageContentStyles } from "@/components/templates/AnnualSummaryPageContent/AnnualSummaryPageContent.styles";
import { getAnnualSummaryMockData } from "@/features/annual-summary/usecases/getAnnualSummaryMockData";
import { formatYen } from "@/libs/money";

/**
 * @description 年間サマリー画面の静的モック全体を表示する。
 * @param なし
 * @returns 年間サマリー画面のコンテンツUI。
 * @example
 * <AnnualSummaryPageContent />
 */
export function AnnualSummaryPageContent(): ReactElement {
  /** 年間サマリー画面に表示するモックデータ */
  const annualSummaryMockData = getAnnualSummaryMockData();

  return (
    <Stack spacing={3}>
      <PageHeader subtitle="年間の収支をざっくり確認する" title="2026年 年間サマリー" />
      <Box sx={annualSummaryPageContentStyles.statGrid}>
        <StatCard amount={315000} label="年間全収入" tone="income" />
        <StatCard amount={315000} label="使える収入" tone="income" />
        <StatCard amount={0} label="貯める収入" />
        <StatCard amount={761600} label="年間固定費" tone="fixedCost" />
        <StatCard amount={5960} label="年間出費" tone="expense" />
        <StatCard amount={213840} label="生活費残り" />
        <StatCard amount={-452560} label="年間実収支" />
      </Box>
      <Paper variant="outlined" sx={annualSummaryPageContentStyles.highlightCard}>
        <Typography color="text.secondary">最も支出が多かった月</Typography>
        <Typography sx={annualSummaryPageContentStyles.highlightValue} variant="h6">
          5月: {formatYen(5960)}
        </Typography>
      </Paper>
      <SummaryChart metrics={annualSummaryMockData.chartMetrics} />
      <MonthlySummaryList summaries={annualSummaryMockData.monthlySummaries} />
    </Stack>
  );
}
