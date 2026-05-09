/**
 * 月間カレンダーの1日分セルに表示する値。
 */
export type CalendarCell = {
  /** YYYY-MM-DD形式の日付キー */
  readonly dateKey: string;
  /** カレンダーに表示する日 */
  readonly day: number;
  /** その日の終了時点の生活費残り */
  readonly endingBalance?: number;
  /** その日の出費合計 */
  readonly expenseTotal?: number;
  /** 表示対象月の日付か */
  readonly isCurrentMonth: boolean;
  /** 選択中の日付か */
  readonly isSelected: boolean;
};

/**
 * 選択日の支出一覧に表示する出費。
 */
export type SelectedExpense = {
  /** 出費金額 */
  readonly amount: number;
  /** 出費ID */
  readonly id: string;
  /** HH:mm形式の出費時刻 */
  readonly time: string;
};

/**
 * 月間カレンダー画面モックで利用するデータ。
 */
export type CalendarMockData = {
  /** カレンダーセル一覧 */
  readonly calendarCells: readonly CalendarCell[];
  /** 選択日の出費一覧 */
  readonly selectedExpenses: readonly SelectedExpense[];
  /** 曜日ラベル一覧 */
  readonly weekDays: readonly string[];
};

/**
 * 月間カレンダー下部に表示する月次集計。
 */
export type CalendarMonthStats = {
  /** 1日の目安 */
  readonly dailySpendingGuide: number;
  /** 平均支出/日 */
  readonly averageExpensePerDay: number;
  /** 今月の支出 */
  readonly monthlyExpenseTotal: number;
};
