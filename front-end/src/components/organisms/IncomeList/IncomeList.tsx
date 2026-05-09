import type { ReactElement } from "react";

import { Box, Button, Checkbox, Paper, Stack, Typography } from "@mui/material";

import type { Income } from "@/domains/income";

import { incomeListStyles } from "@/components/organisms/IncomeList/IncomeList.styles";
import { formatYen } from "@/libs/money";

/**
 * 収入一覧componentに渡すprops。
 */
type IncomeListProps = {
  /** 収入一覧 */
  readonly incomes: readonly Income[];
  /** 削除中か */
  readonly isDeleting: boolean;
  /** 読み込み中か */
  readonly isLoading: boolean;
  /** 更新中か */
  readonly isUpdating: boolean;
  /** 削除ボタン押下時に呼び出す処理 */
  readonly onDelete: (incomeId: string) => void;
  /** 編集ボタン押下時に呼び出す処理 */
  readonly onEdit: (income: Income) => void;
  /** 予算対象切り替え時に呼び出す処理 */
  readonly onToggleIncludedInBalance: (income: Income) => void;
};

/**
 * @description 登録済み収入の一覧を表示する。
 * @param props - 収入一覧、通信状態、操作handler。
 * @returns 収入一覧UI。
 * @example
 * <IncomeList incomes={incomes} isLoading={false} isUpdating={false} isDeleting={false} onEdit={handleEditIncome} onDelete={handleDeleteIncome} onToggleIncludedInBalance={handleToggleIncludedInBalance} />
 */
export function IncomeList({
  incomes,
  isDeleting,
  isLoading,
  isUpdating,
  onDelete,
  onEdit,
  onToggleIncludedInBalance,
}: IncomeListProps): ReactElement {
  return (
    <Paper variant="outlined" sx={incomeListStyles.root}>
      <Box sx={incomeListStyles.header}>
        <Typography component="h2" sx={incomeListStyles.strongText} variant="h6">
          収入一覧
        </Typography>
      </Box>
      <Stack divider={<Box sx={incomeListStyles.divider} />}>
        {isLoading ? (
          <Box sx={incomeListStyles.row}>
            <Typography color="text.secondary">読み込み中です</Typography>
          </Box>
        ) : null}
        {!isLoading && incomes.length === 0 ? (
          <Box sx={incomeListStyles.row}>
            <Typography color="text.secondary">収入はまだありません</Typography>
          </Box>
        ) : null}
        {incomes.map((income) => {
          /** 収入一覧行の操作名に使う表示名 */
          const incomeLabel = income.memo ?? "名称未設定";

          return (
            <Box
              data-testid="income-list-item"
              key={income.id}
              sx={incomeListStyles.row}
            >
              <Stack spacing={0.75}>
                <Stack direction="row" spacing={1} sx={incomeListStyles.nameRow}>
                  <Typography sx={incomeListStyles.strongText}>
                    {incomeLabel}
                  </Typography>
                  {income.includedInBalance ? (
                    <Typography
                      color="success.main"
                      sx={incomeListStyles.badge}
                      variant="caption"
                    >
                      予算に含む
                    </Typography>
                  ) : null}
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  {income.incomeDate}
                </Typography>
              </Stack>
              <Typography
                color="success.main"
                sx={incomeListStyles.strongText}
                variant="h6"
              >
                {formatYen(income.amount)}
              </Typography>
              <Stack direction="row" spacing={1} sx={incomeListStyles.controlRow}>
                <Checkbox
                  checked={income.includedInBalance}
                  disabled={isUpdating}
                  slotProps={{
                    input: {
                      "aria-label": `予算対象を切り替え ${incomeLabel}`,
                    },
                  }}
                  onChange={() => {
                    onToggleIncludedInBalance(income);
                  }}
                />
                <Button
                  aria-label={`収入を編集 ${incomeLabel}`}
                  disabled={isUpdating}
                  onClick={() => {
                    onEdit(income);
                  }}
                  size="small"
                  variant="outlined"
                >
                  編集
                </Button>
                <Button
                  aria-label={`収入を削除 ${incomeLabel}`}
                  color="error"
                  disabled={isDeleting}
                  onClick={() => {
                    onDelete(income.id);
                  }}
                  size="small"
                  variant="outlined"
                >
                  削除
                </Button>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
