import type { ReactElement } from "react";

import { Paper, Stack, Typography } from "@mui/material";

import { AmountText } from "@/components/atoms/AmountText";

type StatTone = "default" | "expense" | "fixedCost" | "income";

type StatCardProps = {
  readonly amount: number;
  readonly label: string;
  readonly subtitle?: string;
  readonly tone?: StatTone;
};

export function StatCard({
  amount,
  label,
  subtitle,
  tone = "default",
}: StatCardProps): ReactElement {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        minHeight: 104,
        p: 2,
      }}
    >
      <Stack spacing={0.75}>
        <Typography color="text.secondary" variant="body2">
          {label}
        </Typography>
        <AmountText amount={amount} size="small" tone={tone} />
        {subtitle !== undefined && (
          <Typography color="text.secondary" variant="body2">
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
