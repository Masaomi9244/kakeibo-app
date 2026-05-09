import type { ReactElement } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import type { FixedCostItem } from "@/features/fixed-costs/domain/fixedCost";

import { fixedCostListStyles } from "@/components/organisms/FixedCostList/FixedCostList.styles";
import { FixedCostListItem } from "@/components/organisms/FixedCostList/FixedCostListItem";

/**
 * 固定費一覧componentに渡すprops。
 */
type FixedCostListProps = {
  /** 固定費一覧 */
  readonly fixedCosts: readonly FixedCostItem[];
  /** 固定費一覧読み込み中か */
  readonly isLoading: boolean;
  /** 一覧操作を無効化するか */
  readonly isOperationDisabled: boolean;
  /** 削除ボタン押下時に呼び出す処理 */
  readonly onDelete: (fixedCostId: string) => void;
  /** 編集ボタン押下時に呼び出す処理 */
  readonly onEdit: (fixedCost: FixedCostItem) => void;
  /** 有効状態切り替え時に呼び出す処理 */
  readonly onToggleActive: (fixedCost: FixedCostItem) => void;
};

/**
 * @description 登録済み固定費の静的一覧を表示する。
 * @param props - 固定費一覧と操作handler。
 * @returns 固定費一覧UI。
 * @example
 * <FixedCostList fixedCosts={fixedCosts} onEdit={handleEdit} onDelete={handleDelete} onToggleActive={handleToggleActive} />
 */
export function FixedCostList({
  fixedCosts,
  isLoading,
  isOperationDisabled,
  onDelete,
  onEdit,
  onToggleActive,
}: FixedCostListProps): ReactElement {
  /** 一覧に固定費が存在しないか */
  const isEmpty = fixedCosts.length === 0;

  return (
    <Paper variant="outlined" sx={fixedCostListStyles.root}>
      <Box sx={fixedCostListStyles.header}>
        <Typography component="h2" sx={fixedCostListStyles.strongText} variant="h6">
          固定費一覧
        </Typography>
      </Box>
      {isLoading ? (
        <Typography color="text.secondary" sx={fixedCostListStyles.emptyText}>
          固定費を読み込んでいます
        </Typography>
      ) : null}
      {!isLoading && isEmpty ? (
        <Typography color="text.secondary" sx={fixedCostListStyles.emptyText}>
          固定費はまだありません
        </Typography>
      ) : null}
      {!isLoading && !isEmpty ? (
        <Stack divider={<Box sx={fixedCostListStyles.divider} />}>
          {fixedCosts.map((fixedCost) => (
            <FixedCostListItem
              fixedCost={fixedCost}
              isOperationDisabled={isOperationDisabled}
              key={fixedCost.id}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
            />
          ))}
        </Stack>
      ) : null}
    </Paper>
  );
}
