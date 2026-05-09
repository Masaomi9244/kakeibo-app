import { useMemo, useState } from "react";

import type {
  FixedCostFormValues,
  FixedCostItem,
} from "@/features/fixed-costs/domain/fixedCost";
import type { FixedCostTotals } from "@/features/fixed-costs/usecases/calculateFixedCostTotals";

import { calculateFixedCostTotals } from "@/features/fixed-costs/usecases/calculateFixedCostTotals";
import { createEmptyFixedCostFormValues } from "@/features/fixed-costs/usecases/createEmptyFixedCostFormValues";
import { getFixedCostMockData } from "@/features/fixed-costs/usecases/getFixedCostMockData";
import { normalizeFixedCostForm } from "@/features/fixed-costs/usecases/normalizeFixedCostForm";
import { formatAsiaTokyoMonth } from "@/libs/date";

/**
 * 固定費フォームの編集状態。
 */
type EditingFixedCostState = {
  /** 編集対象の固定費ID */
  readonly id: string;
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
  /** 固定費フォームの状態とevent handler */
  readonly fixedCostForm: FixedCostFormViewModel;
  /** 固定費削除時に呼び出す処理 */
  readonly handleDeleteFixedCost: (fixedCostId: string) => void;
  /** 固定費編集時に呼び出す処理 */
  readonly handleEditFixedCost: (fixedCost: FixedCostItem) => void;
  /** 固定費有効状態切り替え時に呼び出す処理 */
  readonly handleToggleFixedCostActive: (fixedCost: FixedCostItem) => void;
  /** 固定費サマリーに表示する合計値 */
  readonly totals: FixedCostTotals;
};

/**
 * @description 固定費画面のローカルフォーム制御、保存判断、編集、削除、有効切り替えをまとめる。
 * @param なし。
 * @returns 固定費画面templateへ渡すview model。
 * @example
 * const fixedCostPage = useFixedCostPageViewModel();
 */
export function useFixedCostPageViewModel(): FixedCostPageViewModel {
  /** 現在の対象月 */
  const currentMonth = useMemo(() => formatAsiaTokyoMonth(new Date()), []);
  /** 固定費一覧 */
  const [fixedCosts, setFixedCosts] = useState<readonly FixedCostItem[]>(() =>
    getFixedCostMockData(),
  );
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
   * @description 固定費フォーム入力を検証し、ローカルstateへ保存する。
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

    if (editingFixedCost === null) {
      /** 新規作成する固定費 */
      const createdFixedCost: FixedCostItem = {
        amount: normalized.amount,
        id: `fixed-${Date.now()}`,
        isActive: true,
        name: normalized.name,
        startMonth: normalized.startMonth,
      };

      setFixedCosts((currentFixedCosts) => [...currentFixedCosts, createdFixedCost]);
    } else {
      setFixedCosts((currentFixedCosts) =>
        currentFixedCosts.map((fixedCost) =>
          fixedCost.id === editingFixedCost.id
            ? {
                ...fixedCost,
                amount: normalized.amount,
                name: normalized.name,
                startMonth: normalized.startMonth,
              }
            : fixedCost,
        ),
      );
    }

    resetForm();
  };

  /**
   * @description 編集対象の固定費をフォームへ反映する。
   * @param fixedCost - 編集対象の固定費。
   * @returns なし。
   * @example
   * handleEditFixedCost(fixedCost);
   */
  const handleEditFixedCost = (fixedCost: FixedCostItem): void => {
    setEditingFixedCost({ id: fixedCost.id });
    setFormValues({
      amount: String(fixedCost.amount),
      name: fixedCost.name,
      startMonth: fixedCost.startMonth,
    });
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
    setFixedCosts((currentFixedCosts) =>
      currentFixedCosts.filter((fixedCost) => fixedCost.id !== fixedCostId),
    );
  };

  /**
   * @description 固定費の有効状態を切り替える。
   * @param fixedCost - 切り替え対象の固定費。
   * @returns なし。
   * @example
   * handleToggleFixedCostActive(fixedCost);
   */
  const handleToggleFixedCostActive = (fixedCost: FixedCostItem): void => {
    setFixedCosts((currentFixedCosts) =>
      currentFixedCosts.map((currentFixedCost) =>
        currentFixedCost.id === fixedCost.id
          ? { ...currentFixedCost, isActive: !currentFixedCost.isActive }
          : currentFixedCost,
      ),
    );
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
      isSubmitting: false,
      values: formValues,
    },
    fixedCosts,
    handleDeleteFixedCost,
    handleEditFixedCost,
    handleToggleFixedCostActive,
    totals,
  };
}
