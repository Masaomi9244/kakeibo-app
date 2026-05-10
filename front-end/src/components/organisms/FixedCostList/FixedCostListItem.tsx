import type { ReactElement } from "react";

import { Box, Button, Stack, Typography } from "@mui/material";

import type { FixedCostItem } from "@/features/fixed-costs/domain/fixedCost";

import { fixedCostListStyles } from "@/components/organisms/FixedCostList/FixedCostList.styles";
import { formatYen } from "@/libs/money";

/**
 * 固定費一覧行componentに渡すprops。
 */
type FixedCostListItemProps = {
  /** 表示対象の固定費 */
  readonly fixedCost: FixedCostItem;
  /** 操作を無効化するか */
  readonly isOperationDisabled: boolean;
  /** 削除ボタン押下時に呼び出す処理 */
  readonly onDelete: (fixedCostId: string) => void;
  /** 編集ボタン押下時に呼び出す処理 */
  readonly onEdit: (fixedCost: FixedCostItem) => void;
  /** 有効状態切り替え時に呼び出す処理 */
  readonly onToggleActive: (fixedCost: FixedCostItem) => void;
};

/**
 * @description 登録済み固定費の1行分を表示する。
 * @param props - 表示対象の固定費と操作handler。
 * @returns 固定費一覧の1行UI。
 * @example
 * <FixedCostListItem fixedCost={fixedCost} onEdit={handleEdit} onDelete={handleDelete} onToggleActive={handleToggleActive} />
 */
export function FixedCostListItem({
  fixedCost,
  isOperationDisabled,
  onDelete,
  onEdit,
  onToggleActive,
}: FixedCostListItemProps): ReactElement {
  /**
   * @description 有効状態切り替えを親へ通知する。
   * @param なし。
   * @returns なし。
   * @example
   * handleToggleActive();
   */
  const handleToggleActive = (): void => {
    onToggleActive(fixedCost);
  };

  /**
   * @description 編集対象の固定費を親へ通知する。
   * @param なし。
   * @returns なし。
   * @example
   * handleEdit();
   */
  const handleEdit = (): void => {
    onEdit(fixedCost);
  };

  /**
   * @description 削除対象の固定費IDを親へ通知する。
   * @param なし。
   * @returns なし。
   * @example
   * handleDelete();
   */
  const handleDelete = (): void => {
    onDelete(fixedCost.id);
  };

  return (
    <Box data-testid="fixed-cost-list-item" sx={fixedCostListStyles.row}>
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={1} sx={fixedCostListStyles.nameRow}>
          <Typography sx={fixedCostListStyles.strongText}>{fixedCost.name}</Typography>
          {fixedCost.isActive ? (
            <Typography
              color="success.main"
              sx={fixedCostListStyles.activeBadge}
              variant="caption"
            >
              有効
            </Typography>
          ) : null}
        </Stack>
        <Typography color="text.secondary" variant="body2">
          {fixedCost.startMonth}から毎月
        </Typography>
      </Stack>
      <Typography color="warning.main" sx={fixedCostListStyles.strongText} variant="h6">
        {formatYen(fixedCost.amount)}
      </Typography>
      <Stack direction="row" spacing={1} sx={fixedCostListStyles.controlRow}>
        <Button
          aria-label={`固定費の有効状態を切り替え ${fixedCost.name}`}
          color={fixedCost.isActive ? "warning" : "success"}
          disabled={isOperationDisabled}
          onClick={handleToggleActive}
          size="small"
          variant="text"
        >
          {fixedCost.isActive ? "無効にする" : "有効にする"}
        </Button>
        <Button
          aria-label={`固定費を編集 ${fixedCost.name}`}
          disabled={isOperationDisabled}
          onClick={handleEdit}
          size="small"
          variant="outlined"
        >
          編集
        </Button>
        <Button
          aria-label={`固定費を削除 ${fixedCost.name}`}
          color="error"
          disabled={isOperationDisabled}
          onClick={handleDelete}
          size="small"
          variant="outlined"
        >
          削除
        </Button>
      </Stack>
    </Box>
  );
}
