import type { ChangeEvent, KeyboardEvent } from "react";

import { useRef, useState } from "react";

import { normalizeExpenseAmountInput } from "@/features/home/usecases/normalizeExpenseAmountInput";

/**
 * クイック出費入力hookに渡すparams。
 */
type UseQuickExpenseInputParams = {
  readonly isSubmitting: boolean;
  readonly onSubmit: (amount: number) => Promise<void>;
};

/**
 * クイック出費入力hookがcomponentへ返す値。
 */
type UseQuickExpenseInputResult = {
  readonly amountInput: string;
  readonly errorMessage: string | undefined;
  readonly handleAmountBlur: () => void;
  readonly handleAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly handleAmountKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

/**
 * @description 出費金額入力の正規化、Enter/blur登録、二重送信防止、エラー表示を管理する。
 * @param params - 登録処理と保存中状態。
 * @returns 出費入力UIに渡す状態とevent handler。
 * @example
 * useQuickExpenseInput({ isSubmitting: false, onSubmit: async () => undefined });
 */
export function useQuickExpenseInput(
  params: UseQuickExpenseInputParams,
): UseQuickExpenseInputResult {
  const lastSubmittedValueRef = useRef<string | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  /**
   * @description 現在の入力値を検証し、保存可能なら出費登録処理を実行する。
   * @param なし。
   * @returns なし。
   * @example
   * void submitAmount();
   */
  const submitAmount = async (): Promise<void> => {
    const rawValue = amountInput.trim();

    if (rawValue === "") {
      setErrorMessage(undefined);
      return;
    }

    if (params.isSubmitting || lastSubmittedValueRef.current === rawValue) {
      return;
    }

    const normalizedAmount = normalizeExpenseAmountInput(rawValue);

    if (normalizedAmount === null) {
      setErrorMessage("1円以上の整数で入力してください");
      return;
    }

    lastSubmittedValueRef.current = rawValue;

    try {
      await params.onSubmit(normalizedAmount.amount);
      setAmountInput("");
      setErrorMessage(undefined);
    } catch (error) {
      lastSubmittedValueRef.current = null;
      setErrorMessage(
        error instanceof Error ? error.message : "出費の登録に失敗しました",
      );
    }
  };

  /**
   * @description blur時に保存可能な入力値を出費として登録する。
   * @param なし。
   * @returns なし。
   * @example
   * handleAmountBlur();
   */
  const handleAmountBlur = (): void => {
    void submitAmount();
  };

  /**
   * @description 入力値をstateへ反映し、同一値の二重送信防止状態をリセットする。
   * @param event - 入力変更イベント。
   * @returns なし。
   * @example
   * handleAmountChange(event);
   */
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>): void => {
    lastSubmittedValueRef.current = null;
    setAmountInput(event.target.value);
  };

  /**
   * @description Enterキー押下時に保存可能な入力値を出費として登録する。
   * @param event - キーボード入力イベント。
   * @returns なし。
   * @example
   * handleAmountKeyDown(event);
   */
  const handleAmountKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      void submitAmount();
    }
  };

  return {
    amountInput,
    errorMessage,
    handleAmountBlur,
    handleAmountChange,
    handleAmountKeyDown,
  };
}
