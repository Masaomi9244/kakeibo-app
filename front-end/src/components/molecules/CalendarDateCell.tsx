import type { ReactElement } from "react";

import { Box, Typography } from "@mui/material";

import type { CalendarCell } from "@/features/calendar/domain/calendar";

import {
  calendarDateCellStyles,
  getCalendarDateCellRootSx,
} from "@/components/molecules/CalendarDateCell.styles";
import { formatYen } from "@/libs/money";

/**
 * 月間カレンダーの日付セルコンポーネントに渡すprops。
 */
type CalendarDateCellProps = {
  /** 表示する1日分のカレンダーセル */
  readonly cell: CalendarCell;
  /** 日付セル選択時に呼び出す処理 */
  readonly onSelectDate: (dateKey: string) => void;
};

/**
 * @description カレンダーの日付セルを支出合計付きで表示する。
 * @param props - 1日分のカレンダーセル情報。
 * @returns カレンダー日付セルUI。
 * @example
 * <CalendarDateCell cell={cell} onSelectDate={handleSelectDate} />
 */
export function CalendarDateCell({
  cell,
  onSelectDate,
}: CalendarDateCellProps): ReactElement {
  /**
   * @description 日付セル選択時に選択対象の日付キーを親へ通知する。
   * @param なし。
   * @returns なし。
   * @example
   * handleClick();
   */
  const handleClick = (): void => {
    onSelectDate(cell.dateKey);
  };

  return (
    <Box
      component="button"
      onClick={handleClick}
      sx={getCalendarDateCellRootSx(cell.isSelected, cell.isCurrentMonth)}
      type="button"
    >
      <Typography sx={calendarDateCellStyles.day}>{cell.day}</Typography>
      {cell.expenseTotal !== undefined ? (
        <Typography color="text.secondary" sx={calendarDateCellStyles.expenseTotal}>
          {formatYen(cell.expenseTotal)}
        </Typography>
      ) : null}
    </Box>
  );
}
