/**
 * 収入APIが返す収入DTO。
 */
export type IncomeDto = {
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

/**
 * 収入登録API request DTO。
 */
export type CreateIncomeRequest = {
  /** 収入金額 */
  readonly amount: number;
  /** 今月使えるお金に含めるか */
  readonly includedInBalance: boolean;
  /** YYYY-MM-DD形式の入金日 */
  readonly incomeDate: string;
  /** 収入メモ */
  readonly memo: null | string;
};

/**
 * 収入更新API request DTO。
 */
export type UpdateIncomeRequest = {
  /** 収入金額 */
  readonly amount: number;
  /** 今月使えるお金に含めるか */
  readonly includedInBalance: boolean;
  /** YYYY-MM-DD形式の入金日 */
  readonly incomeDate: string;
  /** 収入メモ */
  readonly memo: null | string;
};

/**
 * 単一収入API response DTO。
 */
export type IncomeResponse = {
  /** 保存または取得した収入 */
  readonly income: IncomeDto;
};

/**
 * 収入一覧API response DTO。
 */
export type ListIncomesResponse = {
  /** 収入一覧 */
  readonly items: IncomeDto[];
};

/**
 * 収入削除API response DTO。
 */
export type DeleteIncomeResponse = {
  /** 削除完了メッセージ */
  readonly message: string;
};
