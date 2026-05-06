import type { ReactElement } from "react";

import { Stack, Typography } from "@mui/material";

type PageHeaderProps = {
  readonly subtitle?: string;
  readonly title: string;
};

export function PageHeader({ subtitle, title }: PageHeaderProps): ReactElement {
  return (
    <Stack spacing={0.75}>
      <Typography
        component="h1"
        variant="h4"
        sx={{
          fontWeight: 700,
          letterSpacing: 0,
        }}
      >
        {title}
      </Typography>
      {subtitle !== undefined && (
        <Typography color="text.secondary" variant="body1">
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}
