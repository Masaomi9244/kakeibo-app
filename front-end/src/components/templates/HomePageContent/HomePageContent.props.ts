import type { HomeSummaryCardsProps } from "@/components/organisms/HomeSummaryCards/HomeSummaryCards";
import type { QuickExpenseInputProps } from "@/components/organisms/QuickExpenseInput/QuickExpenseInput";
import type { MonthlySummary } from "@/domains/monthlySummary";
import type { HomeSummaryCardsDisclosure } from "@/features/home/hooks/useHomePageViewModel";
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

/**
 * @description 月次サマリーと表示状態をHomeSummaryCardsのpropsへ変換する。
 * @param monthlySummary - 月次サマリー。
 * @param disclosure - 収支カードの表示状態。
 * @returns ホーム画面の収支カード一覧componentへ渡すprops。
 * @example
 * const props = buildHomeSummaryCardsProps(monthlySummary, disclosure);
 */
function buildHomeSummaryCardsProps(
  monthlySummary: MonthlySummary,
  disclosure: HomeSummaryCardsDisclosure,
): HomeSummaryCardsProps {
  return {
    availableIncome: monthlySummary.availableIncome,
    expenseTotal: monthlySummary.expenseTotal,
    fixedCostTotal: monthlySummary.fixedCostTotal,
    isExpanded: disclosure.isExpanded,
    onToggle: disclosure.handleToggle,
  };
}

/**
 * @description 月次サマリーが取得済みの場合だけHomeSummaryCardsのpropsへ変換する。
 * @param monthlySummary - 月次サマリー。
 * @param disclosure - 収支カードの表示状態。
 * @returns 月次サマリー取得済みなら収支カードprops、未取得ならundefined。
 * @example
 * const props = buildOptionalHomeSummaryCardsProps(monthlySummary, disclosure);
 */
export function buildOptionalHomeSummaryCardsProps(
  monthlySummary: MonthlySummary | undefined,
  disclosure: HomeSummaryCardsDisclosure,
): HomeSummaryCardsProps | undefined {
  if (monthlySummary === undefined) {
    return undefined;
  }

  return buildHomeSummaryCardsProps(monthlySummary, disclosure);
}
