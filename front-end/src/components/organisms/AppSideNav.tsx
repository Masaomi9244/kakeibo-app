import type { ReactElement } from "react";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { appNavigationItems } from "@/components/organisms/navigation";

type AppSideNavProps = {
  readonly currentPath: string;
};

export function AppSideNav({ currentPath }: AppSideNavProps): ReactElement {
  return (
    <Box
      component="aside"
      sx={{
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        bottom: 0,
        display: { md: "flex", xs: "none" },
        flexDirection: "column",
        left: 0,
        position: "fixed",
        top: 0,
        width: 248,
      }}
    >
      <Stack spacing={0.5} sx={{ p: 3 }}>
        <Typography component="p" sx={{ fontWeight: 700 }} variant="h6">
          家計簿
        </Typography>
        <Typography color="text.secondary" variant="body2">
          mario8masa9244
        </Typography>
      </Stack>
      <Divider />
      <Stack component="nav" spacing={1} sx={{ flex: 1, p: 2 }}>
        {appNavigationItems.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <Button
              href={item.href}
              key={item.href}
              size="large"
              sx={{
                color: isActive ? "primary.contrastText" : "text.primary",
                justifyContent: "flex-start",
                minHeight: 48,
                px: 2,
              }}
              variant={isActive ? "contained" : "text"}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  fontWeight: 700,
                  mr: 1.5,
                  width: 20,
                }}
              >
                {item.mark}
              </Box>
              {item.label}
            </Button>
          );
        })}
      </Stack>
      <Box sx={{ p: 2 }}>
        <Button color="error" size="large" sx={{ justifyContent: "flex-start" }}>
          ログアウト
        </Button>
      </Box>
    </Box>
  );
}
