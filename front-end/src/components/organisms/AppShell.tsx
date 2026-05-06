import type { ReactElement, ReactNode } from "react";

import { Box, Button, Container, Stack, Typography } from "@mui/material";

import { AppBottomNav } from "@/components/organisms/AppBottomNav";
import { AppSideNav } from "@/components/organisms/AppSideNav";

/**
 * アプリ共通レイアウトに渡すprops。
 */
type AppShellProps = {
  readonly children: ReactNode;
  readonly currentPath: string;
};

/**
 * @description PCのサイドナビとSPのヘッダー/ボトムナビを含む共通レイアウトを提供する。
 * @param props - 現在のパスと画面本体。
 * @returns アプリ共通レイアウトで包んだ画面UI。
 * @example
 * <AppShell currentPath="/"><HomePageContent /></AppShell>
 */
export function AppShell({ children, currentPath }: AppShellProps): ReactElement {
  return (
    <Box sx={{ minHeight: "100dvh" }}>
      <AppSideNav currentPath={currentPath} />
      <Box
        component="header"
        sx={{
          alignItems: "center",
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          display: { md: "none", xs: "flex" },
          height: 64,
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Stack spacing={0}>
          <Typography component="p" sx={{ fontWeight: 700 }} variant="h6">
            家計簿
          </Typography>
        </Stack>
        <Button color="error" size="small">
          ログアウト
        </Button>
      </Box>
      <Box
        component="main"
        sx={{
          ml: { md: "248px", xs: 0 },
          pb: { md: 6, xs: 12 },
          pt: { md: 4, xs: 3 },
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>
      <AppBottomNav currentPath={currentPath} />
    </Box>
  );
}
