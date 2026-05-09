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
};

/**
 * @description カレンダーの日付セルを支出合計と残高付きで表示する。
 * @param props - 1日分のカレンダーセル情報。
 * @returns カレンダー日付セルUI。
 * @example
 * <CalendarDateCell cell={cell} />
 */
export function CalendarDateCell({ cell }: CalendarDateCellProps): ReactElement {
  return (
    <Box sx={getCalendarDateCellRootSx(cell.isSelected, cell.isCurrentMonth)}>
      <Typography sx={calendarDateCellStyles.day}>{cell.day}</Typography>
      {cell.expenseTotal !== undefined ? (
        <Typography color="text.secondary" sx={calendarDateCellStyles.expenseTotal}>
          {formatYen(cell.expenseTotal)}
        </Typography>
      ) : null}
      {cell.endingBalance !== undefined ? (
        <Typography color="success.main" sx={calendarDateCellStyles.endingBalance}>
          残 {formatYen(cell.endingBalance)}
        </Typography>
      ) : null}
    </Box>
  );
}
