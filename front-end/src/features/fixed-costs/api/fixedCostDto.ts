/**
 * 固定費APIが返す固定費DTO。
 */
export type FixedCostDto = {
  /** 固定費金額 */
  readonly amount: number;
  /** 固定費ID */
  readonly id: string;
  /** 予算計算に含める状態か */
  readonly isActive: boolean;
  /** 固定費名 */
  readonly name: string;
  /** YYYY-MM-DD形式の固定費開始月 */
  readonly startMonth: string;
};

/**
 * 固定費登録API request DTO。
 */
export type CreateFixedCostRequest = {
  /** 固定費金額 */
  readonly amount: number;
  /** 予算計算に含める状態か */
  readonly isActive: boolean;
  /** 固定費名 */
  readonly name: string;
  /** YYYY-MM-DD形式の固定費開始月 */
  readonly startMonth: string;
};

/**
 * 固定費更新API request DTO。
 */
export type UpdateFixedCostRequest = {
  /** 固定費金額 */
  readonly amount: number;
  /** 予算計算に含める状態か */
  readonly isActive: boolean;
  /** 固定費名 */
  readonly name: string;
  /** YYYY-MM-DD形式の固定費開始月 */
  readonly startMonth: string;
};

/**
 * 単一固定費API response DTO。
 */
export type FixedCostResponse = {
  /** 保存または取得した固定費 */
  readonly fixedCost: FixedCostDto;
};

/**
 * 固定費一覧API response DTO。
 */
export type ListFixedCostsResponse = {
  /** 固定費一覧 */
  readonly items: FixedCostDto[];
};

/**
 * 固定費削除API response DTO。
 */
export type DeleteFixedCostResponse = {
  /** 削除完了メッセージ */
  readonly message: string;
};
