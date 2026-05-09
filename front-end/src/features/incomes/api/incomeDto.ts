/**
 * 収入APIが返す収入DTO。
 */
export type IncomeDto = {
  readonly amount: number;
  readonly id: string;
  readonly includedInBalance: boolean;
  readonly incomeDate: string;
  readonly memo: null | string;
};

/**
 * 収入登録API request DTO。
 */
export type CreateIncomeRequest = {
  readonly amount: number;
  readonly includedInBalance: boolean;
  readonly incomeDate: string;
  readonly memo: null | string;
};

/**
 * 収入更新API request DTO。
 */
export type UpdateIncomeRequest = {
  readonly amount: number;
  readonly includedInBalance: boolean;
  readonly incomeDate: string;
  readonly memo: null | string;
};

/**
 * 単一収入API response DTO。
 */
export type IncomeResponse = {
  readonly income: IncomeDto;
};

/**
 * 収入一覧API response DTO。
 */
export type ListIncomesResponse = {
  readonly items: IncomeDto[];
};
