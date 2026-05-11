import { useMemo, useState } from "react";

import type { CreateFixedCostRequest } from "@/features/fixed-costs/api/fixedCostDto";
import type {
  FixedCostFormValues,
  FixedCostItem,
} from "@/features/fixed-costs/domain/fixedCost";
import type { FixedCostTotals } from "@/features/fixed-costs/usecases/calculateFixedCostTotals";

import { useCreateFixedCost } from "@/features/fixed-costs/hooks/useCreateFixedCost";
import { useDeleteFixedCost } from "@/features/fixed-costs/hooks/useDeleteFixedCost";
import { useFixedCosts } from "@/features/fixed-costs/hooks/useFixedCosts";
import { useUpdateFixedCost } from "@/features/fixed-costs/hooks/useUpdateFixedCost";
import { calculateFixedCostTotals } from "@/features/fixed-costs/usecases/calculateFixedCostTotals";
import { createEmptyFixedCostFormValues } from "@/features/fixed-costs/usecases/createEmptyFixedCostFormValues";
import { mapFixedCostToFormValues } from "@/features/fixed-costs/usecases/mapFixedCostToFormValues";
import { normalizeFixedCostForm } from "@/features/fixed-costs/usecases/normalizeFixedCostForm";
import { formatAsiaTokyoMonth } from "@/libs/date";

/**
 * 固定費フォームの編集状態。
 */
type EditingFixedCostState = {
  /** 編集対象の固定費ID */
  readonly id: string;
  /** 編集対象の有効状態 */
  readonly isActive: boolean;
};

/**
 * 固定費フォームを制御するview model。
 */
export type FixedCostFormViewModel = {
  /** 金額入力変更時に呼び出す処理 */
  readonly handleAmountChange: (amount: string) => void;
  /** 編集キャンセル時に呼び出す処理 */
  readonly handleCancelEdit: () => void;
  /** 固定費名入力変更時に呼び出す処理 */
  readonly handleNameChange: (name: string) => void;
  /** 開始月変更時に呼び出す処理 */
  readonly handleStartMonthChange: (startMonth: string) => void;
  /** フォーム送信時に呼び出す処理 */
  readonly handleSubmit: () => void;
  /** フォーム上部に表示するエラー文言 */
  readonly errorMessage: string | undefined;
  /** 編集中か */
  readonly isEditing: boolean;
  /** 保存中か */
  readonly isSubmitting: boolean;
  /** フォーム入力値 */
  readonly values: FixedCostFormValues;
};

/**
 * 固定費画面templateへ渡すview model。
 */
export type FixedCostPageViewModel = {
  /** 固定費一覧 */
  readonly fixedCosts: readonly FixedCostItem[];
  /** 固定費一覧取得エラー文言 */
  readonly fixedCostsErrorMessage: string | undefined;
  /** 固定費一覧読み込み中か */
  readonly fixedCostsIsLoading: boolean;
  /** 固定費フォームの状態とevent handler */
  readonly fixedCostForm: FixedCostFormViewModel;
  /** 固定費削除時に呼び出す処理 */
  readonly handleDeleteFixedCost: (fixedCostId: string) => void;
  /** 固定費編集時に呼び出す処理 */
  readonly handleEditFixedCost: (fixedCost: FixedCostItem) => void;
  /** 固定費削除中か */
  readonly isDeleting: boolean;
  /** 固定費更新中か */
  readonly isUpdating: boolean;
  /** 固定費サマリーに表示する合計値 */
  readonly totals: FixedCostTotals;
};

/**
 * @description 固定費画面のAPI接続、フォーム制御、保存判断、一覧操作をまとめる。
 * @param なし。
 * @returns 固定費画面templateへ渡すview model。
 * @example
 * const fixedCostPage = useFixedCostPageViewModel();
 */
export function useFixedCostPageViewModel(): FixedCostPageViewModel {
  /** 現在の対象月 */
  const currentMonth = useMemo(() => formatAsiaTokyoMonth(new Date()), []);
  /** 現在の対象年 */
  const currentYear = Number(currentMonth.slice(0, 4));
  /** 固定費フォームの入力値 */
  const [formValues, setFormValues] = useState<FixedCostFormValues>(() =>
    createEmptyFixedCostFormValues(currentMonth),
  );
  /** 編集中の固定費 */
  const [editingFixedCost, setEditingFixedCost] =
    useState<EditingFixedCostState | null>(null);
  /** 固定費フォーム上部に表示するエラー文言 */
  const [formErrorMessage, setFormErrorMessage] = useState<string | undefined>(
    undefined,
  );
  /** 固定費一覧取得query */
  const fixedCostsQuery = useFixedCosts(currentMonth);
  /** 固定費登録mutation */
  const createFixedCostMutation = useCreateFixedCost({
    month: currentMonth,
    year: currentYear,
  });
  /** 固定費更新mutation */
  const updateFixedCostMutation = useUpdateFixedCost({
    month: currentMonth,
    year: currentYear,
  });
  /** 固定費削除mutation */
  const deleteFixedCostMutation = useDeleteFixedCost({
    month: currentMonth,
    year: currentYear,
  });
  /** 固定費一覧 */
  const fixedCosts = fixedCostsQuery.data ?? [];
  /** 固定費登録または更新中か */
  const isSubmitting =
    createFixedCostMutation.isPending || updateFixedCostMutation.isPending;
  /** 固定費サマリーに表示する合計値 */
  const totals = calculateFixedCostTotals(fixedCosts);

  /**
   * @description 固定費フォームを初期状態へ戻す。
   * @param なし。
   * @returns なし。
   * @example
   * resetForm();
   */
  const resetForm = (): void => {
    setFormValues(createEmptyFixedCostFormValues(currentMonth));
    setEditingFixedCost(null);
    setFormErrorMessage(undefined);
  };

  /**
   * @description 登録または更新APIへ固定費を保存する。
   * @param request - APIへ送信する固定費保存request。
   * @returns なし。
   * @example
   * await saveFixedCost({ name: "家賃", amount: 80000, startMonth: "2026-05-01", isActive: true });
   */
  const saveFixedCost = async (request: CreateFixedCostRequest): Promise<void> => {
    if (editingFixedCost === null) {
      await createFixedCostMutation.mutateAsync(request);
    } else {
      await updateFixedCostMutation.mutateAsync({
        id: editingFixedCost.id,
        request: {
          ...request,
          isActive: editingFixedCost.isActive,
        },
      });
    }

    resetForm();
  };

  /**
   * @description 固定費名入力値をフォームstateへ反映する。
   * @param name - 入力中の固定費名。
   * @returns なし。
   * @example
   * handleNameChange("家賃");
   */
  const handleNameChange = (name: string): void => {
    setFormValues((currentValues) => ({ ...currentValues, name }));
  };

  /**
   * @description 金額入力値をフォームstateへ反映する。
   * @param amount - 入力中の固定費金額文字列。
   * @returns なし。
   * @example
   * handleAmountChange("80000");
   */
  const handleAmountChange = (amount: string): void => {
    setFormValues((currentValues) => ({ ...currentValues, amount }));
  };

  /**
   * @description 開始月入力値をフォームstateへ反映する。
   * @param startMonth - YYYY-MM形式の開始月。
   * @returns なし。
   * @example
   * handleStartMonthChange("2026-05");
   */
  const handleStartMonthChange = (startMonth: string): void => {
    setFormValues((currentValues) => ({ ...currentValues, startMonth }));
  };

  /**
   * @description 固定費フォーム入力を検証し、登録または更新APIを呼び出す。
   * @param なし。
   * @returns なし。
   * @example
   * handleSubmit();
   */
  const handleSubmit = (): void => {
    /** 正規化済みの固定費フォーム入力値 */
    const normalized = normalizeFixedCostForm(formValues);

    if (normalized === null) {
      setFormErrorMessage("固定費名、金額、開始月を正しく入力してください");
      return;
    }

    void saveFixedCost(normalized.request).catch((error: unknown) => {
      setFormErrorMessage(
        error instanceof Error ? error.message : "固定費の保存に失敗しました",
      );
    });
  };

  /**
   * @description 編集対象の固定費をフォームへ反映する。
   * @param fixedCost - 編集対象の固定費。
   * @returns なし。
   * @example
   * handleEditFixedCost(fixedCost);
   */
  const handleEditFixedCost = (fixedCost: FixedCostItem): void => {
    setEditingFixedCost({ id: fixedCost.id, isActive: fixedCost.isActive });
    setFormValues(mapFixedCostToFormValues(fixedCost));
    setFormErrorMessage(undefined);
  };

  /**
   * @description 指定IDの固定費を削除する。
   * @param fixedCostId - 削除対象の固定費ID。
   * @returns なし。
   * @example
   * handleDeleteFixedCost("fixed-rent");
   */
  const handleDeleteFixedCost = (fixedCostId: string): void => {
    void deleteFixedCostMutation.mutateAsync(fixedCostId).catch((error: unknown) => {
      setFormErrorMessage(
        error instanceof Error ? error.message : "固定費の削除に失敗しました",
      );
    });
  };

  return {
    fixedCostForm: {
      errorMessage: formErrorMessage,
      handleAmountChange,
      handleCancelEdit: resetForm,
      handleNameChange,
      handleStartMonthChange,
      handleSubmit,
      isEditing: editingFixedCost !== null,
      isSubmitting,
      values: formValues,
    },
    fixedCosts,
    fixedCostsErrorMessage: fixedCostsQuery.isError
      ? fixedCostsQuery.error.message
      : undefined,
    fixedCostsIsLoading: fixedCostsQuery.isLoading,
    handleDeleteFixedCost,
    handleEditFixedCost,
    isDeleting: deleteFixedCostMutation.isPending,
    isUpdating: updateFixedCostMutation.isPending,
    totals,
  };
}
