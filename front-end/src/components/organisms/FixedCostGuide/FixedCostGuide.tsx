import type { ReactElement } from "react";

import { Paper, Typography } from "@mui/material";

import { fixedCostGuideStyles } from "@/components/organisms/FixedCostGuide/FixedCostGuide.styles";

/**
 * @description 固定費の意味と予算反映ルールを画面上で補足する。
 * @param なし
 * @returns 固定費説明カードUI。
 * @example
 * <FixedCostGuide />
 */
export function FixedCostGuide(): ReactElement {
  return (
    <Paper variant="outlined" sx={fixedCostGuideStyles.root}>
      <Typography>
        毎月定期的に支払う費用です。家賃、光熱費、サブスクなどを登録すると、自動的に月の予算から差し引かれます。
      </Typography>
    </Paper>
  );
}
