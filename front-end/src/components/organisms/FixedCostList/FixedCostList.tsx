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
  onDelete,
  onEdit,
  onToggleActive,
}: FixedCostListProps): ReactElement {
  return (
    <Paper variant="outlined" sx={fixedCostListStyles.root}>
      <Box sx={fixedCostListStyles.header}>
        <Typography component="h2" sx={fixedCostListStyles.strongText} variant="h6">
          固定費一覧
        </Typography>
      </Box>
      <Stack divider={<Box sx={fixedCostListStyles.divider} />}>
        {fixedCosts.map((fixedCost) => (
          <FixedCostListItem
            fixedCost={fixedCost}
            key={fixedCost.id}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
          />
        ))}
      </Stack>
    </Paper>
  );
}
