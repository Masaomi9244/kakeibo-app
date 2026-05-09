/**
 * 月次サマリーquery keyを生成するfactory。
 */
export const monthlySummaryKeys = {
  /**
   * @description 対象月の月次サマリーquery keyを生成する。
   * @param month - YYYY-MM形式の対象月。
   * @returns TanStack Queryで利用するquery key。
   * @example
   * monthlySummaryKeys.detail("2026-05");
   */
  detail: (month: string) => ["monthlySummary", month] as const,
};

/**
 * 出費query keyを生成するfactory。
 */
export const expensesKeys = {
  /**
   * @description 対象日の出費一覧query keyを生成する。
   * @param date - YYYY-MM-DD形式の対象日。
   * @returns TanStack Queryで利用するquery key。
   * @example
   * expensesKeys.byDate("2026-05-01");
   */
  byDate: (date: string) => ["expenses", "date", date] as const,

  /**
   * @description 対象月の出費一覧query keyを生成する。
   * @param month - YYYY-MM形式の対象月。
   * @returns TanStack Queryで利用するquery key。
   * @example
   * expensesKeys.byMonth("2026-05");
   */
  byMonth: (month: string) => ["expenses", "month", month] as const,
};

/**
 * カレンダーquery keyを生成するfactory。
 */
export const expenseCalendarKeys = {
  /**
   * @description 対象月のカレンダーquery keyを生成する。
   * @param month - YYYY-MM形式の対象月。
   * @returns TanStack Queryで利用するquery key。
   * @example
   * expenseCalendarKeys.byMonth("2026-05");
   */
  byMonth: (month: string) => ["expenseCalendar", month] as const,

  /**
   * @description 対象月と選択日のカレンダーquery keyを生成する。
   * @param month - YYYY-MM形式の対象月。
   * @param selectedDate - YYYY-MM-DD形式の選択日。
   * @returns TanStack Queryで利用するquery key。
   * @example
   * expenseCalendarKeys.byMonthAndDate("2026-05", "2026-05-06");
   */
  byMonthAndDate: (month: string, selectedDate: string) =>
    ["expenseCalendar", month, "date", selectedDate] as const,
};

/**
 * 年間サマリーquery keyを生成するfactory。
 */
export const annualSummaryKeys = {
  /**
   * @description 対象年の年間サマリーquery keyを生成する。
   * @param year - 対象年。
   * @returns TanStack Queryで利用するquery key。
   * @example
   * annualSummaryKeys.byYear(2026);
   */
  byYear: (year: number) => ["annualSummary", year] as const,
};

/**
 * 収入query keyを生成するfactory。
 */
export const incomesKeys = {
  /**
   * @description 対象月の収入一覧query keyを生成する。
   * @param month - YYYY-MM形式の対象月。
   * @returns TanStack Queryで利用するquery key。
   * @example
   * incomesKeys.byMonth("2026-05");
   */
  byMonth: (month: string) => ["incomes", "month", month] as const,
};

/**
 * 固定費query keyを生成するfactory。
 */
export const fixedCostsKeys = {
  /**
   * @description 対象月の固定費一覧query keyを生成する。
   * @param month - YYYY-MM形式の対象月。
   * @returns TanStack Queryで利用するquery key。
   * @example
   * fixedCostsKeys.byMonth("2026-05");
   */
  byMonth: (month: string) => ["fixedCosts", "month", month] as const,
};
