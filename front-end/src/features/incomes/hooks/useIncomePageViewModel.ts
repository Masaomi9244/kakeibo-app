import { useMemo, useState } from "react";

import type { Income } from "@/domains/income";
import type { CreateIncomeRequest } from "@/features/incomes/api/incomeDto";
import type { IncomeFormValues } from "@/features/incomes/domain/incomeForm";
import type { IncomeTotals } from "@/features/incomes/usecases/calculateIncomeTotals";

import { useCreateIncome } from "@/features/incomes/hooks/useCreateIncome";
import { useDeleteIncome } from "@/features/incomes/hooks/useDeleteIncome";
import { useIncomes } from "@/features/incomes/hooks/useIncomes";
import { useUpdateIncome } from "@/features/incomes/hooks/useUpdateIncome";
import { calculateIncomeTotals } from "@/features/incomes/usecases/calculateIncomeTotals";
import { createEmptyIncomeFormValues } from "@/features/incomes/usecases/createEmptyIncomeFormValues";
import { mapIncomeToFormValues } from "@/features/incomes/usecases/mapIncomeToFormValues";
import { normalizeIncomeForm } from "@/features/incomes/usecases/normalizeIncomeForm";
import { formatAsiaTokyoDate, formatAsiaTokyoMonth } from "@/libs/date";

/**
 * 収入フォームの編集状態。
 */
type EditingIncomeState = {
  /** 編集対象の収入ID */
  readonly id: string;
};

/**
 * 収入フォームを制御するview model。
 */
export type IncomeFormViewModel = {
  /** 金額入力変更時に呼び出す処理 */
  readonly handleAmountChange: (amount: string) => void;
  /** 編集キャンセル時に呼び出す処理 */
  readonly handleCancelEdit: () => void;
  /** 予算対象切り替え時に呼び出す処理 */
  readonly handleIncludedInBalanceChange: (includedInBalance: boolean) => void;
  /** 入金日変更時に呼び出す処理 */
  readonly handleIncomeDateChange: (incomeDate: string) => void;
  /** 収入名入力変更時に呼び出す処理 */
  readonly handleMemoChange: (memo: string) => void;
  /** フォーム送信時に呼び出す処理 */
  readonly handleSubmit: () => void;
  /** フォーム上部に表示するエラー文言 */
  readonly errorMessage: string | undefined;
  /** 編集中か */
  readonly isEditing: boolean;
  /** 登録または更新中か */
  readonly isSubmitting: boolean;
  /** フォーム入力値 */
  readonly values: IncomeFormValues;
};

/**
 * 収入管理画面templateへ渡すview model。
 */
export type IncomePageViewModel = {
  /** 収入削除ボタン押下時に呼び出す処理 */
  readonly handleDeleteIncome: (incomeId: string) => void;
  /** 収入編集ボタン押下時に呼び出す処理 */
  readonly handleEditIncome: (income: Income) => void;
  /** 予算対象切り替え時に呼び出す処理 */
  readonly handleToggleIncludedInBalance: (income: Income) => void;
  /** 収入フォームの状態とevent handler */
  readonly incomeForm: IncomeFormViewModel;
  /** 収入一覧取得エラー文言 */
  readonly incomesErrorMessage: string | undefined;
  /** 収入一覧読み込み中か */
  readonly incomesIsLoading: boolean;
  /** 収入一覧 */
  readonly incomes: readonly Income[];
  /** 収入削除中か */
  readonly isDeleting: boolean;
  /** 収入更新中か */
  readonly isUpdating: boolean;
  /** 収入サマリーに表示する合計値 */
  readonly totals: IncomeTotals;
};

/**
 * @description 収入管理画面のAPI接続、フォーム制御、保存判断、一覧操作をまとめる。
 * @param なし。
 * @returns 収入管理画面templateへ渡すview model。
 * @example
 * const incomePage = useIncomePageViewModel();
 */
export function useIncomePageViewModel(): IncomePageViewModel {
  /** 今日の日付 */
  const todayDate = useMemo(() => formatAsiaTokyoDate(new Date()), []);
  /** 現在の対象月 */
  const currentMonth = useMemo(() => formatAsiaTokyoMonth(new Date()), []);
  /** 現在の対象年 */
  const currentYear = Number(currentMonth.slice(0, 4));
  /** 収入フォームの入力値 */
  const [formValues, setFormValues] = useState<IncomeFormValues>(() =>
    createEmptyIncomeFormValues(todayDate),
  );
  /** 編集中の収入 */
  const [editingIncome, setEditingIncome] = useState<EditingIncomeState | null>(null);
  /** 収入フォーム上部に表示するエラー文言 */
  const [formErrorMessage, setFormErrorMessage] = useState<string | undefined>(
    undefined,
  );
  /** 収入一覧取得query */
  const incomesQuery = useIncomes(currentMonth);
  /** 収入登録mutation */
  const createIncomeMutation = useCreateIncome({
    month: currentMonth,
    year: currentYear,
  });
  /** 収入更新mutation */
  const updateIncomeMutation = useUpdateIncome({
    month: currentMonth,
    year: currentYear,
  });
  /** 収入削除mutation */
  const deleteIncomeMutation = useDeleteIncome({
    month: currentMonth,
    year: currentYear,
  });
  /** 収入一覧 */
  const incomes = incomesQuery.data ?? [];
  /** 収入登録または更新中か */
  const isSubmitting = createIncomeMutation.isPending || updateIncomeMutation.isPending;
  /** 収入サマリーに表示する合計値 */
  const totals = calculateIncomeTotals(incomes);

  /**
   * @description 収入フォームを初期状態へ戻す。
   * @param なし。
   * @returns なし。
   * @example
   * resetForm();
   */
  const resetForm = (): void => {
    setFormValues(createEmptyIncomeFormValues(todayDate));
    setEditingIncome(null);
    setFormErrorMessage(undefined);
  };

  /**
   * @description 登録または更新APIへ収入を保存する。
   * @param request - APIへ送信する収入保存request。
   * @returns なし。
   * @example
   * await saveIncome({ amount: 250000, incomeDate: "2026-05-25", includedInBalance: true, memo: "給与" });
   */
  const saveIncome = async (request: CreateIncomeRequest): Promise<void> => {
    if (editingIncome === null) {
      await createIncomeMutation.mutateAsync(request);
    } else {
      await updateIncomeMutation.mutateAsync({
        id: editingIncome.id,
        request,
      });
    }

    resetForm();
  };

  /**
   * @description 収入名入力値をフォームstateへ反映する。
   * @param memo - 入力中の収入名。
   * @returns なし。
   * @example
   * handleMemoChange("給与");
   */
  const handleMemoChange = (memo: string): void => {
    setFormValues((currentValues) => ({ ...currentValues, memo }));
  };

  /**
   * @description 金額入力値をフォームstateへ反映する。
   * @param amount - 入力中の収入金額文字列。
   * @returns なし。
   * @example
   * handleAmountChange("250000");
   */
  const handleAmountChange = (amount: string): void => {
    setFormValues((currentValues) => ({ ...currentValues, amount }));
  };

  /**
   * @description 入金日入力値をフォームstateへ反映する。
   * @param incomeDate - YYYY-MM-DD形式の入金日。
   * @returns なし。
   * @example
   * handleIncomeDateChange("2026-05-25");
   */
  const handleIncomeDateChange = (incomeDate: string): void => {
    setFormValues((currentValues) => ({ ...currentValues, incomeDate }));
  };

  /**
   * @description 予算に含めるかどうかをフォームstateへ反映する。
   * @param includedInBalance - 今月の残り予算に含めるか。
   * @returns なし。
   * @example
   * handleIncludedInBalanceChange(true);
   */
  const handleIncludedInBalanceChange = (includedInBalance: boolean): void => {
    setFormValues((currentValues) => ({
      ...currentValues,
      includedInBalance,
    }));
  };

  /**
   * @description 収入フォーム入力を検証し、登録または更新APIを呼び出す。
   * @param なし。
   * @returns なし。
   * @example
   * handleSubmit();
   */
  const handleSubmit = (): void => {
    /** 正規化済みのフォーム入力値 */
    const normalized = normalizeIncomeForm(formValues);

    if (normalized === null) {
      setFormErrorMessage("金額と入金日を正しく入力してください");
      return;
    }

    void saveIncome(normalized.request).catch((error: unknown) => {
      setFormErrorMessage(
        error instanceof Error ? error.message : "収入の保存に失敗しました",
      );
    });
  };

  /**
   * @description 編集対象の収入をフォームへ反映する。
   * @param income - 編集対象の収入。
   * @returns なし。
   * @example
   * handleEditIncome(income);
   */
  const handleEditIncome = (income: Income): void => {
    setEditingIncome({ id: income.id });
    setFormValues(mapIncomeToFormValues(income));
    setFormErrorMessage(undefined);
  };

  /**
   * @description 指定IDの収入を削除する。
   * @param incomeId - 削除対象の収入ID。
   * @returns なし。
   * @example
   * handleDeleteIncome("income-id");
   */
  const handleDeleteIncome = (incomeId: string): void => {
    void deleteIncomeMutation.mutateAsync(incomeId).catch((error: unknown) => {
      setFormErrorMessage(
        error instanceof Error ? error.message : "収入の削除に失敗しました",
      );
    });
  };

  /**
   * @description 収入を今月の残り予算に含めるかどうかを切り替える。
   * @param income - 切り替え対象の収入。
   * @returns なし。
   * @example
   * handleToggleIncludedInBalance(income);
   */
  const handleToggleIncludedInBalance = (income: Income): void => {
    /** 予算対象フラグを反転した収入更新request */
    const updateRequest: CreateIncomeRequest = {
      amount: income.amount,
      includedInBalance: !income.includedInBalance,
      incomeDate: income.incomeDate,
      memo: income.memo,
    };

    void updateIncomeMutation
      .mutateAsync({
        id: income.id,
        request: updateRequest,
      })
      .catch((error: unknown) => {
        setFormErrorMessage(
          error instanceof Error ? error.message : "収入の更新に失敗しました",
        );
      });
  };

  return {
    handleDeleteIncome,
    handleEditIncome,
    handleToggleIncludedInBalance,
    incomeForm: {
      errorMessage: formErrorMessage,
      handleAmountChange,
      handleCancelEdit: resetForm,
      handleIncludedInBalanceChange,
      handleIncomeDateChange,
      handleMemoChange,
      handleSubmit,
      isEditing: editingIncome !== null,
      isSubmitting,
      values: formValues,
    },
    incomes,
    incomesErrorMessage: incomesQuery.isError ? incomesQuery.error.message : undefined,
    incomesIsLoading: incomesQuery.isLoading,
    isDeleting: deleteIncomeMutation.isPending,
    isUpdating: updateIncomeMutation.isPending,
    totals,
  };
}
