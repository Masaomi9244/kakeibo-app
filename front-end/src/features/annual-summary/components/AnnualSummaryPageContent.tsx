import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import { PageHeader } from "@/components/molecules/PageHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { formatYen } from "@/libs/money";

type MonthlySummary = {
  readonly availableIncome: number;
  readonly expense: number;
  readonly fixedCost: number;
  readonly month: string;
  readonly remainingBalance: number;
  readonly reservedIncome: number;
  readonly totalIncome: number;
};

type BarMetric = {
  readonly color: string;
  readonly id: string;
  readonly label: string;
  readonly value: number;
};

type BarMetricProps = {
  readonly metric: BarMetric;
};

const monthlySummaries: readonly MonthlySummary[] = [
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 0,
    month: "1月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 0,
    month: "2月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 0,
    month: "3月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 0,
    month: "4月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 315000,
    expense: 5960,
    fixedCost: 95200,
    month: "5月",
    remainingBalance: 213840,
    reservedIncome: 0,
    totalIncome: 315000,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 0,
    month: "6月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
];

const chartMetrics: readonly BarMetric[] = [
  { color: "#059669", id: "available-income", label: "使える収入", value: 315000 },
  { color: "#f59e0b", id: "fixed-cost", label: "固定費", value: 95200 },
  { color: "#dc2626", id: "expense", label: "出費", value: 5960 },
  { color: "#0d9488", id: "remaining", label: "生活費残り", value: 213840 },
];

function BarMetricColumn({ metric }: BarMetricProps): ReactElement {
  const maxAmount = 315000;
  const height = Math.max(6, Math.round((metric.value / maxAmount) * 180));

  return (
    <Stack spacing={1} sx={{ alignItems: "center", flex: 1, minWidth: 72 }}>
      <Box
        sx={{
          alignItems: "flex-end",
          display: "flex",
          height: 192,
        }}
      >
        <Box
          sx={{
            bgcolor: metric.color,
            borderRadius: "8px 8px 0 0",
            height,
            width: 32,
          }}
        />
      </Box>
      <Typography sx={{ fontWeight: 700 }} variant="body2">
        {metric.label}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {formatYen(metric.value)}
      </Typography>
    </Stack>
  );
}

function SummaryChart(): ReactElement {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        p: { sm: 3, xs: 2 },
      }}
    >
      <Stack spacing={3}>
        <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
          5月の収支内訳
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 1,
          }}
        >
          {chartMetrics.map((metric) => (
            <BarMetricColumn key={metric.id} metric={metric} />
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}

function MonthlySummaryList(): ReactElement {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { sm: 3, xs: 2.5 } }}>
        <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
          月別サマリー一覧
        </Typography>
      </Box>
      <Stack divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />}>
        {monthlySummaries.map((summary) => (
          <Box
            key={summary.month}
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                md: "96px repeat(6, minmax(0, 1fr))",
                xs: "1fr 1fr",
              },
              p: { sm: 2.5, xs: 2 },
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>{summary.month}</Typography>
            <Typography color="success.main">
              {formatYen(summary.totalIncome)}
            </Typography>
            <Typography color="success.main">
              {formatYen(summary.availableIncome)}
            </Typography>
            <Typography>{formatYen(summary.reservedIncome)}</Typography>
            <Typography color="warning.main">{formatYen(summary.fixedCost)}</Typography>
            <Typography color="error.main">{formatYen(summary.expense)}</Typography>
            <Typography>{formatYen(summary.remainingBalance)}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export function AnnualSummaryPageContent(): ReactElement {
  return (
    <Stack spacing={3}>
      <PageHeader subtitle="年間の収支をざっくり確認する" title="2026年 年間サマリー" />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            md: "repeat(4, 1fr)",
            sm: "repeat(2, 1fr)",
            xs: "1fr 1fr",
          },
        }}
      >
        <StatCard amount={315000} label="年間全収入" tone="income" />
        <StatCard amount={315000} label="使える収入" tone="income" />
        <StatCard amount={0} label="貯める収入" />
        <StatCard amount={761600} label="年間固定費" tone="fixedCost" />
        <StatCard amount={5960} label="年間出費" tone="expense" />
        <StatCard amount={213840} label="生活費残り" />
        <StatCard amount={-452560} label="年間実収支" />
      </Box>
      <Paper
        variant="outlined"
        sx={{
          bgcolor: "rgba(245, 158, 11, 0.08)",
          borderColor: "rgba(245, 158, 11, 0.3)",
          borderRadius: 1,
          p: { sm: 3, xs: 2.5 },
        }}
      >
        <Typography color="text.secondary">最も支出が多かった月</Typography>
        <Typography sx={{ fontWeight: 700 }} variant="h6">
          5月: {formatYen(5960)}
        </Typography>
      </Paper>
      <SummaryChart />
      <MonthlySummaryList />
    </Stack>
  );
}
