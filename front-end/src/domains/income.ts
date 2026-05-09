/**
 * フロントエンドで扱う収入domain model。
 */
export type Income = {
  readonly amount: number;
  readonly id: string;
  readonly includedInBalance: boolean;
  readonly incomeDate: string;
  readonly memo: null | string;
};
