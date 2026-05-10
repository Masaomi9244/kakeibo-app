import type { QuickExpenseInputProps } from "@/components/organisms/QuickExpenseInput/QuickExpenseInput";
import type { UseQuickExpenseInputResult } from "@/features/home/hooks/useQuickExpenseInput";

/**
 * @description ホーム画面view modelの出費入力状態をQuickExpenseInputのpropsへ変換する。
 * @param quickExpenseInput - 出費クイック入力hookの状態とevent handler。
 * @returns 出費クイック入力componentへ渡すprops。
 * @example
 * const props = buildQuickExpenseInputProps(homePage.quickExpenseInput);
 */
export function buildQuickExpenseInputProps(
  quickExpenseInput: UseQuickExpenseInputResult,
): QuickExpenseInputProps {
  return {
    amountInput: quickExpenseInput.amountInput,
    errorMessage: quickExpenseInput.errorMessage,
    isSubmitting: quickExpenseInput.isSubmitting,
    onAmountBlur: quickExpenseInput.handleAmountBlur,
    onAmountChange: quickExpenseInput.handleAmountChange,
    onAmountKeyDown: quickExpenseInput.handleAmountKeyDown,
  };
}
