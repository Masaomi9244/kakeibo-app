/**
 * 収入domain model。
 */
export type Income = {
  /** 収入金額 */
  readonly amount: number;
  /** 収入ID */
  readonly id: string;
  /** 今月使えるお金に含めるか */
  readonly includedInBalance: boolean;
  /** YYYY-MM-DD形式の入金日 */
  readonly incomeDate: string;
  /** 収入メモ */
  readonly memo: null | string;
};
