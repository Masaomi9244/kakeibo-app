import type { ReactElement } from "react";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { AppIcon } from "@/components/atoms/AppIcon/AppIcon";
import {
  appSideNavStyles,
  getSideNavItemSx,
} from "@/components/organisms/AppSideNav.styles";
import { appNavigationItems } from "@/components/organisms/navigation";

/**
 * PCサイドナビゲーションコンポーネントに渡すprops。
 */
type AppSideNavProps = {
  /** 現在表示しているパス */
  readonly currentPath: string;
};

/**
 * @description PC幅でMVP主要画面へ移動するサイドナビゲーションを表示する。
 * @param props - 現在のパス。
 * @returns PC用サイドナビゲーションUI。
 * @example
 * <AppSideNav currentPath="/incomes" />
 */
export function AppSideNav({ currentPath }: AppSideNavProps): ReactElement {
  return (
    <Box component="aside" sx={appSideNavStyles.root}>
      <Stack spacing={0.5} sx={appSideNavStyles.userBlock}>
        <Box sx={appSideNavStyles.brandRow}>
          <Box component="span" sx={appSideNavStyles.brandIcon}>
            <AppIcon name="brand" size={24} />
          </Box>
          <Typography component="p" sx={appSideNavStyles.appName} variant="h6">
            家計簿
          </Typography>
        </Box>
        <Typography color="text.secondary" variant="body2">
          mario8masa9244
        </Typography>
      </Stack>
      <Divider />
      <Stack component="nav" spacing={1} sx={appSideNavStyles.navList}>
        {appNavigationItems.map((item) => {
          /** 現在表示中のパスに一致するナビ項目か */
          const isActive = currentPath === item.href;

          return (
            <Button
              href={item.href}
              key={item.href}
              size="large"
              sx={getSideNavItemSx(isActive)}
              variant={isActive ? "contained" : "text"}
            >
              <Box component="span" sx={appSideNavStyles.itemIcon}>
                <AppIcon name={item.iconName} size={22} />
              </Box>
              {item.label}
            </Button>
          );
        })}
      </Stack>
      <Box sx={appSideNavStyles.logoutArea}>
        <Button
          color="error"
          size="large"
          startIcon={<AppIcon name="logout" size={22} />}
          sx={appSideNavStyles.logoutButton}
        >
          ログアウト
        </Button>
      </Box>
    </Box>
  );
}
