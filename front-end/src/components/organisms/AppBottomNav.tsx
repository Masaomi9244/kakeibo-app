import type { ReactElement } from "react";

import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";

import { appNavigationItems } from "@/components/organisms/navigation";

type AppBottomNavProps = {
  readonly currentPath: string;
};

export function AppBottomNav({ currentPath }: AppBottomNavProps): ReactElement {
  return (
    <Paper
      component="nav"
      elevation={3}
      square
      sx={{
        borderTop: 1,
        borderColor: "divider",
        bottom: 0,
        display: { md: "none", xs: "block" },
        left: 0,
        position: "fixed",
        right: 0,
        zIndex: "appBar",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          minHeight: 72,
        }}
      >
        {appNavigationItems.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <ButtonBase
              component="a"
              href={item.href}
              key={item.href}
              sx={{
                color: isActive ? "primary.main" : "text.secondary",
                px: 0.5,
              }}
            >
              <Stack spacing={0.25} sx={{ alignItems: "center" }}>
                <Typography
                  aria-hidden="true"
                  component="span"
                  sx={{
                    border: 1,
                    borderColor: "currentColor",
                    borderRadius: 1,
                    fontSize: 12,
                    fontWeight: 700,
                    height: 22,
                    lineHeight: "20px",
                    width: 22,
                  }}
                >
                  {item.mark}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {item.label}
                </Typography>
              </Stack>
            </ButtonBase>
          );
        })}
      </Box>
    </Paper>
  );
}
