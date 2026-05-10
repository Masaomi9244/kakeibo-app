import { useMemo, useState } from "react";

import type { Expense } from "@/domains/expense";
import type { MonthlySummary } from "@/domains/monthlySummary";
import type { UseQuickExpenseInputResult } from "@/features/home/hooks/useQuickExpenseInput";

import { useCreateQuickExpense } from "@/features/home/hooks/useCreateQuickExpense";
import { useMonthlySummary } from "@/features/home/hooks/useMonthlySummary";
import { useQuickExpenseInput } from "@/features/home/hooks/useQuickExpenseInput";
import { useTodayExpenses } from "@/features/home/hooks/useTodayExpenses";
import { useUndoExpense } from "@/features/home/hooks/useUndoExpense";
import { formatAsiaTokyoDate, formatAsiaTokyoMonth } from "@/libs/date";
import { formatYen } from "@/libs/money";

/**
 * ホーム画面のUndo通知表示状態。
 */
export type HomeExpenseUndoSnackbar = {
  /** Undoを実行できるか */
  readonly canUndo: boolean;
  /** 通知を閉じる処理 */
  readonly handleClose: () => void;
  /** 直近登録した出費を取り消す処理 */
  readonly handleUndo: () => Promise<void>;
  /** 通知を表示中か */
  readonly isOpen: boolean;
  /** Undo API実行中か */
  readonly isUndoing: boolean;
  /** 通知に表示する文言 */
  readonly message: string;
};

/**
 * ホーム画面templateへ渡すview model。
 */
export type HomePageViewModel = {
  /** 現在の対象月表示 */
  readonly currentMonthLabel: string;
  /** 月次サマリー取得エラー文言 */
  readonly monthlySummaryErrorMessage: string | undefined;
  /** 月次サマリー読み込み中か */
  readonly monthlySummaryIsLoading: boolean;
  /** 月次サマリー */
  readonly monthlySummary: MonthlySummary | undefined;
  /** 出費クイック入力の状態とevent handler */
  readonly quickExpenseInput: UseQuickExpenseInputResult;
  /** 出費登録後のUndo通知状態 */
  readonly snackbar: HomeExpenseUndoSnackbar;
  /** 今日の出費一覧 */
  readonly todayExpenses: readonly Expense[];
  /** 今日の出費取得エラー文言 */
  readonly todayExpensesErrorMessage: string | undefined;
  /** 今日の出費読み込み中か */
  readonly todayExpensesIsLoading: boolean;
  /** 今日の出費合計 */
  readonly todayTotal: number;
};

/**
 * @description ホーム画面のAPI接続、出費登録、Undo通知、表示用計算をまとめる。
 * @param なし。
 * @returns ホーム画面templateへ渡すview model。
 * @example
 * const homePage = useHomePageViewModel();
 */
export function useHomePageViewModel(): HomePageViewModel {
  /** 今日の日付 */
  const todayDate = useMemo(() => formatAsiaTokyoDate(new Date()), []);
  /** 現在の対象月 */
  const currentMonth = useMemo(() => formatAsiaTokyoMonth(new Date()), []);
  /** 現在の対象月表示 */
  const currentMonthLabel = `${currentMonth.replace("-", "年")}月`;
  /** 現在の対象年 */
  const currentYear = Number(currentMonth.slice(0, 4));
  /** 月次サマリー取得query */
  const monthlySummaryQuery = useMonthlySummary(currentMonth);
  /** 今日の出費取得query */
  const todayExpensesQuery = useTodayExpenses(todayDate);
  /** 出費クイック登録mutation */
  const createQuickExpenseMutation = useCreateQuickExpense({
    date: todayDate,
    month: currentMonth,
    year: currentYear,
  });
  /** 出費取り消しmutation */
  const undoExpenseMutation = useUndoExpense({
    date: todayDate,
    month: currentMonth,
    year: currentYear,
  });
  /** 直近で登録して取り消し対象にできる出費 */
  const [undoTarget, setUndoTarget] = useState<Expense | null>(null);
  /** 出費登録通知の表示状態 */
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  /** 出費登録通知に表示する文言 */
  const [snackbarMessage, setSnackbarMessage] = useState("出費を記録しました");
  /** 今日の出費一覧 */
  const todayExpenses = todayExpensesQuery.data ?? [];
  /** 今日の出費合計 */
  const todayTotal = todayExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
  /** 月次サマリー */
  const monthlySummary = monthlySummaryQuery.data;

  /**
   * @description 出費登録後にUndo対象と通知文言を更新する。
   * @param amount - 登録する出費金額。
   * @returns なし。
   * @example
   * await createQuickExpenseWithUndo(1200);
   */
  const createQuickExpenseWithUndo = async (amount: number): Promise<void> => {
    /** API登録後に通知へ表示する出費 */
    const expense = await createQuickExpenseMutation.mutateAsync(amount);

    setUndoTarget(expense);
    setSnackbarMessage(`${formatYen(expense.amount)}を記録しました`);
    setIsSnackbarOpen(true);
  };

  /** 出費クイック入力の状態とevent handler */
  const quickExpenseInput = useQuickExpenseInput({
    isSubmitting: createQuickExpenseMutation.isPending,
    onSubmit: createQuickExpenseWithUndo,
  });

  /**
   * @description 出費登録完了通知を閉じる。
   * @param なし。
   * @returns なし。
   * @example
   * handleSnackbarClose();
   */
  const handleSnackbarClose = (): void => {
    setIsSnackbarOpen(false);
  };

  /**
   * @description 最後に登録した出費をAPI経由で取り消す。
   * @param なし。
   * @returns なし。
   * @example
   * await handleUndoExpense();
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

  return {
    currentMonthLabel,
    monthlySummary,
    monthlySummaryErrorMessage: monthlySummaryQuery.isError
      ? monthlySummaryQuery.error.message
      : undefined,
    monthlySummaryIsLoading: monthlySummaryQuery.isLoading,
    quickExpenseInput,
    snackbar: {
      canUndo: undoTarget !== null,
      handleClose: handleSnackbarClose,
      handleUndo: handleUndoExpense,
      isOpen: isSnackbarOpen,
      isUndoing: undoExpenseMutation.isPending,
      message: snackbarMessage,
    },
    todayExpenses,
    todayExpensesErrorMessage: todayExpensesQuery.isError
      ? todayExpensesQuery.error.message
      : undefined,
    todayExpensesIsLoading: todayExpensesQuery.isLoading,
    todayTotal,
  };
}
