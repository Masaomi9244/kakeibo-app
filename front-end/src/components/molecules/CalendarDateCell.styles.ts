import type { SxProps, Theme } from "@mui/material/styles";

/**
 * カレンダー日付セルで利用するstyle定義。
 */
type CalendarDateCellStyles = {
  /** 日付 */
  readonly day: SxProps<Theme>;
  /** 日別残額 */
  readonly endingBalance: SxProps<Theme>;
  /** 日別支出合計 */
  readonly expenseTotal: SxProps<Theme>;
};

/** カレンダー日付セルで利用するstyle群。 */
export const calendarDateCellStyles = {
  day: {
    fontWeight: 700,
  },
  endingBalance: {
    display: { sm: "block", xs: "none" },
    fontSize: 12,
    fontWeight: 700,
  },
  expenseTotal: {
    bgcolor: "rgba(100, 116, 139, 0.1)",
    borderRadius: 0.75,
    fontSize: { sm: 12, xs: 11 },
    px: 0.75,
  },
} satisfies CalendarDateCellStyles;

/**
 * @description カレンダーセル状態に応じたセル全体のsxを作成する。
 * @param isSelected - 選択中の日付か。
 * @param isCurrentMonth - 表示対象月の日付か。
 * @returns 日付セル全体に渡すsx。
 * @example
 * getCalendarDateCellRootSx(true, true);
 */
export const getCalendarDateCellRootSx = (
  isSelected: boolean,
  isCurrentMonth: boolean,
): SxProps<Theme> => ({
  alignItems: "center",
  bgcolor: isSelected ? "rgba(13, 148, 136, 0.08)" : "transparent",
  border: isSelected ? 2 : 0,
  borderColor: "primary.main",
  borderRadius: 1,
  color: isCurrentMonth ? "text.primary" : "text.disabled",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  justifyContent: "center",
  minHeight: { sm: 104, xs: 72 },
  p: 0.75,
  textTransform: "none",
});
