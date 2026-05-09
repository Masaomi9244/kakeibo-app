import type { ReactElement } from "react";

import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";

import { fixedCostFormStyles } from "@/components/organisms/FixedCostForm/FixedCostForm.styles";

/**
 * @description 固定費を新規登録するための静的フォームを表示する。
 * @param なし
 * @returns 固定費登録フォームUI。
 * @example
 * <FixedCostForm />
 */
export function FixedCostForm(): ReactElement {
  return (
    <Paper variant="outlined" sx={fixedCostFormStyles.root}>
      <Stack spacing={2.5}>
        <Typography component="h2" sx={fixedCostFormStyles.title} variant="h6">
          + 新しい固定費
        </Typography>
        <Box sx={fixedCostFormStyles.inputGrid}>
          <TextField
            fullWidth
            label="固定費名"
            placeholder="家賃、光熱費など"
            required
          />
          <TextField
            fullWidth
            inputMode="numeric"
            label="金額"
            placeholder="¥ 0"
            required
          />
        </Box>
        <TextField fullWidth label="開始月" required value="2026年05月" />
        <Typography color="text.secondary" variant="body2">
          この月から毎月の予算計算に含まれます
        </Typography>
        <Button size="large" variant="contained">
          + 登録する
        </Button>
      </Stack>
    </Paper>
  );
}
