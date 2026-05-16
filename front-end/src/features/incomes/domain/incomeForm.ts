/**
 * 収入フォームの入力値。
 */
export type IncomeFormValues = {
  /** 入力中の収入金額 */
  readonly amount: string;
  /** 今月の残り予算に含めるか */
  readonly includedInBalance: boolean;
  /** YYYY-MM-DD形式の入金日 */
  readonly incomeDate: string;
  /** 入力中の収入メモ */
  readonly memo: string;
};
