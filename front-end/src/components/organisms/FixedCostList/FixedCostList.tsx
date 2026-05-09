import type { ReactElement } from "react";

import { Box, Button, Paper, Stack, Switch, Typography } from "@mui/material";

import type { FixedCostItem } from "@/features/fixed-costs/domain/fixedCost";

import { fixedCostListStyles } from "@/components/organisms/FixedCostList/FixedCostList.styles";
import { formatYen } from "@/libs/money";

/**
 * 固定費一覧componentに渡すprops。
 */
type FixedCostListProps = {
  /** 固定費一覧 */
  readonly fixedCosts: readonly FixedCostItem[];
};

/**
 * @description 登録済み固定費の静的一覧を表示する。
 * @param props - 固定費一覧。
 * @returns 固定費一覧UI。
 * @example
 * <FixedCostList fixedCosts={fixedCosts} />
 */
export function FixedCostList({ fixedCosts }: FixedCostListProps): ReactElement {
  return (
    <Paper variant="outlined" sx={fixedCostListStyles.root}>
      <Box sx={fixedCostListStyles.header}>
        <Typography component="h2" sx={fixedCostListStyles.strongText} variant="h6">
          固定費一覧
        </Typography>
      </Box>
      <Stack divider={<Box sx={fixedCostListStyles.divider} />}>
        {fixedCosts.map((fixedCost) => (
          <Box key={fixedCost.id} sx={fixedCostListStyles.row}>
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} sx={fixedCostListStyles.nameRow}>
                <Typography sx={fixedCostListStyles.strongText}>
                  {fixedCost.name}
                </Typography>
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
            <Typography
              color="warning.main"
              sx={fixedCostListStyles.strongText}
              variant="h6"
            >
              {formatYen(fixedCost.amount)}
            </Typography>
            <Stack direction="row" spacing={1} sx={fixedCostListStyles.controlRow}>
              <Switch checked={fixedCost.isActive} size="small" />
              <Button size="small" variant="outlined">
                編集
              </Button>
              <Button color="error" size="small" variant="outlined">
                削除
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
