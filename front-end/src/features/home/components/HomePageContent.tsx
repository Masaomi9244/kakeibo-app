"use client";

import type { ReactElement } from "react";

import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import type { Expense } from "@/domains/expense";
import type { MonthlySummary } from "@/domains/monthlySummary";

import { AmountText } from "@/components/atoms/AmountText";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { homePageContentStyles } from "@/features/home/components/HomePageContent.styles";
import { useCreateQuickExpense } from "@/features/home/hooks/useCreateQuickExpense";
import { useMonthlySummary } from "@/features/home/hooks/useMonthlySummary";
import { useQuickExpenseInput } from "@/features/home/hooks/useQuickExpenseInput";
import { useTodayExpenses } from "@/features/home/hooks/useTodayExpenses";
import { useUndoExpense } from "@/features/home/hooks/useUndoExpense";
import { calculateDailySpendingGuide } from "@/features/home/usecases/calculateDailySpendingGuide";
import {
  formatAsiaTokyoDate,
  formatAsiaTokyoMonth,
  formatAsiaTokyoTime,
} from "@/libs/date";
import { formatYen } from "@/libs/money";

/**
 * 予算ヒーローcomponentに渡すprops。
 */
type BudgetHeroProps = {
  readonly date: string;
  readonly summary: MonthlySummary;
};

/**
 * 出費のクイック入力コンポーネントに渡すprops。
 */
type QuickExpenseInputProps = {
  readonly isSubmitting: boolean;
  readonly onCommit: (amount: number) => Promise<void>;
};

/**
 * 今日の出費カードに渡すprops。
 */
type TodayExpensesCardProps = {
  readonly expenses: readonly Expense[];
  readonly isLoading: boolean;
  readonly total: number;
};

/**
 * @description ホーム画面で今月の残り予算と今日使える目安を強調表示する。
 * @param props - 月次サマリーとAsia/Tokyo基準の対象日。
 * @returns 予算サマリーのヒーローUI。
 * @example
 * <BudgetHero date="2026-05-06" summary={summary} />
 */
function BudgetHero({ date, summary }: BudgetHeroProps): ReactElement {
  const dailySpendingGuide = calculateDailySpendingGuide({
    date,
    month: summary.month,
    remainingAmount: summary.remainingAmount,
  });

  return (
    <Paper elevation={5} sx={homePageContentStyles.budgetHero}>
      <Stack spacing={2.5}>
        <Typography sx={{ fontWeight: 700 }}>今月の残り予算</Typography>
        <AmountText amount={summary.remainingAmount} size="large" tone="inverse" />
        <Stack direction="row" spacing={2} sx={homePageContentStyles.budgetHeroFooter}>
          <Typography sx={{ fontWeight: 700 }}>今日使える目安</Typography>
          <Typography component="p" sx={{ fontWeight: 700 }} variant="h5">
            {formatYen(dailySpendingGuide)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

/**
 * @description 金額だけで出費を記録するためのクイック入力欄を表示する。
 * @param props - 出費確定時に呼び出すコールバック。
 * @returns 出費金額入力UI。
 * @example
 * <QuickExpenseInput isSubmitting={false} onCommit={handleExpenseCommit} />
 */
function QuickExpenseInput({
  isSubmitting,
  onCommit,
}: QuickExpenseInputProps): ReactElement {
  const {
    amountInput,
    errorMessage,
    handleAmountBlur,
    handleAmountChange,
    handleAmountKeyDown,
  } = useQuickExpenseInput({
    isSubmitting,
    onSubmit: onCommit,
  });

  return (
    <Paper variant="outlined" sx={homePageContentStyles.quickExpenseCard}>
      <Stack spacing={2}>
        <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
          出費を記録
        </Typography>
        <Stack
          direction="row"
          spacing={1.5}
          sx={homePageContentStyles.quickExpenseInputRow}
        >
          <Typography color="text.secondary" component="span" variant="h5">
            ¥
          </Typography>
          <TextField
            disabled={isSubmitting}
            error={errorMessage !== undefined}
            fullWidth
            helperText={
              errorMessage ??
              "金額を入力してEnterキーを押すか、フォーカスを外すと記録されます"
            }
            inputMode="numeric"
            onBlur={handleAmountBlur}
            onChange={handleAmountChange}
            onKeyDown={handleAmountKeyDown}
            placeholder="金額を入力"
            value={amountInput}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}

/**
 * @description 今日の出費一覧と合計金額を表示する。
 * @param props - 表示する出費一覧と合計金額。
 * @returns 今日の出費カードUI。
 * @example
 * <TodayExpensesCard expenses={expenses} total={2140} />
 */
function TodayExpensesCard({
  expenses,
  isLoading,
  total,
}: TodayExpensesCardProps): ReactElement {
  return (
    <Paper variant="outlined" sx={homePageContentStyles.todayExpensesCard}>
      <Stack spacing={0} sx={homePageContentStyles.todayExpensesHeader}>
        <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
          今日の出費
        </Typography>
      </Stack>
      <Stack spacing={1.5} sx={homePageContentStyles.todayExpensesList}>
        {isLoading ? (
          <Typography color="text.secondary">読み込み中です</Typography>
        ) : null}
        {!isLoading && expenses.length === 0 ? (
          <Typography color="text.secondary">今日の出費はまだありません</Typography>
        ) : null}
        {expenses.map((expense) => (
          <Box key={expense.id} sx={homePageContentStyles.todayExpenseItem}>
            <Typography color="text.secondary">
              {formatAsiaTokyoTime(expense.spentAt)}
            </Typography>
            <Typography sx={{ fontWeight: 700 }} variant="h6">
              {formatYen(expense.amount)}
            </Typography>
          </Box>
        ))}
        <Box sx={homePageContentStyles.todayExpensesTotal}>
          <Typography color="text.secondary">今日の合計</Typography>
          <AmountText amount={total} size="small" tone="expense" />
        </Box>
      </Stack>
    </Paper>
  );
}

/**
 * @description ホーム画面の静的モック全体を表示する。
 * @param なし
 * @returns ホーム画面のコンテンツUI。
 * @example
 * <HomePageContent />
 */
export function HomePageContent(): ReactElement {
  const todayDate = useMemo(() => formatAsiaTokyoDate(new Date()), []);
  const currentMonth = useMemo(() => formatAsiaTokyoMonth(new Date()), []);
  const currentYear = Number(currentMonth.slice(0, 4));
  const monthlySummaryQuery = useMonthlySummary(currentMonth);
  const todayExpensesQuery = useTodayExpenses(todayDate);
  const createQuickExpenseMutation = useCreateQuickExpense({
    date: todayDate,
    month: currentMonth,
    year: currentYear,
  });
  const undoExpenseMutation = useUndoExpense({
    date: todayDate,
    month: currentMonth,
    year: currentYear,
  });
  const [undoTarget, setUndoTarget] = useState<Expense | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("出費を記録しました");
  const todayExpenses = todayExpensesQuery.data ?? [];
  const todayTotal = todayExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
  const monthlySummary = monthlySummaryQuery.data;

  /**
   * @description クイック入力で確定した出費をAPIへ登録する。
   * @param amount - 確定した出費金額。
   * @returns なし。
   * @example
   * handleExpenseCommit(1200);
   */
  const handleExpenseCommit = async (amount: number): Promise<void> => {
    const expense = await createQuickExpenseMutation.mutateAsync(amount);

    setUndoTarget(expense);
    setSnackbarMessage(`${formatYen(expense.amount)}を記録しました`);
    setIsSnackbarOpen(true);
  };

  /**
   * @description 出費登録完了通知を閉じる。
   * @param なし
   * @returns なし。
   * @example
   * handleSnackbarClose();
   */
  const handleSnackbarClose = (): void => {
    setIsSnackbarOpen(false);
  };

  /**
   * @description 最後に登録した出費をAPI経由で取り消す。
   * @param なし
   * @returns なし。
   * @example
   * handleUndoExpense();
   */
  const handleUndoExpense = async (): Promise<void> => {
    if (undoTarget === null) {
      return;
    }

    try {
      await undoExpenseMutation.mutateAsync(undoTarget.id);
      setUndoTarget(null);
      setIsSnackbarOpen(false);
    } catch (error) {
      setSnackbarMessage(
        error instanceof Error ? error.message : "取り消しに失敗しました",
      );
      setIsSnackbarOpen(true);
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader subtitle={currentMonth.replace("-", "年") + "月"} title="ホーム" />
      {monthlySummaryQuery.isError ? (
        <Alert severity="error">{monthlySummaryQuery.error.message}</Alert>
      ) : null}
      {todayExpensesQuery.isError ? (
        <Alert severity="error">{todayExpensesQuery.error.message}</Alert>
      ) : null}
      {monthlySummary === undefined ? (
        <Paper variant="outlined" sx={homePageContentStyles.quickExpenseCard}>
          <Typography color="text.secondary">月次サマリーを読み込んでいます</Typography>
        </Paper>
      ) : (
        <>
          <BudgetHero date={todayDate} summary={monthlySummary} />
          <Box sx={homePageContentStyles.statGrid}>
            <StatCard
              amount={monthlySummary.availableIncome}
              label="使える収入"
              tone="income"
            />
            <StatCard
              amount={monthlySummary.fixedCostTotal}
              label="固定費"
              tone="fixedCost"
            />
            <StatCard
              amount={monthlySummary.expenseTotal}
              label="出費"
              tone="expense"
            />
          </Box>
        </>
      )}
      <QuickExpenseInput
        isSubmitting={createQuickExpenseMutation.isPending}
        onCommit={handleExpenseCommit}
      />
      <TodayExpensesCard
        expenses={todayExpenses}
        isLoading={todayExpensesQuery.isLoading}
        total={todayTotal}
      />
      <Snackbar
        action={
          <Button
            color="inherit"
            disabled={undoExpenseMutation.isPending || undoTarget === null}
            onClick={() => {
              void handleUndoExpense();
            }}
            size="small"
          >
            取り消す
          </Button>
        }
        autoHideDuration={5000}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        open={isSnackbarOpen}
      />
    </Stack>
  );
}
