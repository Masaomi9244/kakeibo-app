import type { ReactElement, ReactNode } from "react";

import { Box, Button, Container, Stack, Typography } from "@mui/material";

import { AppIcon } from "@/components/atoms/AppIcon/AppIcon";
import { AppBottomNav } from "@/components/organisms/AppBottomNav";
import { appShellStyles } from "@/components/organisms/AppShell.styles";
import { AppSideNav } from "@/components/organisms/AppSideNav";

/**
 * アプリ共通レイアウトに渡すprops。
 */
type AppShellProps = {
  /** 画面本体 */
  readonly children: ReactNode;
  /** 現在表示しているパス */
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
    <Box sx={appShellStyles.root}>
      <AppSideNav currentPath={currentPath} />
      <Box component="header" sx={appShellStyles.mobileHeader}>
        <Stack spacing={0} sx={appShellStyles.mobileHeaderBrand}>
          <Box component="span" sx={appShellStyles.mobileHeaderIcon}>
            <AppIcon name="brand" size={23} />
          </Box>
          <Typography component="p" sx={appShellStyles.mobileHeaderTitle} variant="h6">
            家計簿
          </Typography>
        </Stack>
        <Button
          aria-label="ログアウト"
          color="error"
          size="small"
          sx={appShellStyles.mobileHeaderLogoutButton}
        >
          <AppIcon name="logout" size={24} />
        </Button>
      </Box>
      <Box component="main" sx={appShellStyles.pageMain}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
      <AppBottomNav currentPath={currentPath} />
    </Box>
  );
}
