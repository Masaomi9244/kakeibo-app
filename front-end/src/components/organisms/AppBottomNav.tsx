import type { ReactElement } from "react";

import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";

import { AppIcon } from "@/components/atoms/AppIcon/AppIcon";
import {
  appBottomNavStyles,
  getBottomNavItemSx,
  getBottomNavLabelSx,
} from "@/components/organisms/AppBottomNav.styles";
import { appNavigationItems } from "@/components/organisms/navigation";

/**
 * SP下部ナビゲーションコンポーネントに渡すprops。
 */
type AppBottomNavProps = {
  /** 現在表示しているパス */
  readonly currentPath: string;
};

/**
 * @description モバイル幅でMVP主要画面へ移動する下部ナビゲーションを表示する。
 * @param props - 現在のパス。
 * @returns SP用ボトムナビゲーションUI。
 * @example
 * <AppBottomNav currentPath="/calendar" />
 */
export function AppBottomNav({ currentPath }: AppBottomNavProps): ReactElement {
  return (
    <Paper component="nav" elevation={3} square sx={appBottomNavStyles.root}>
      <Box sx={appBottomNavStyles.navGrid}>
        {appNavigationItems.map((item) => {
          /** 現在表示中のパスに一致するナビ項目か */
          const isActive = currentPath === item.href;

          return (
            <ButtonBase
              component="a"
              href={item.href}
              key={item.href}
              sx={getBottomNavItemSx(isActive)}
            >
              <Stack spacing={0.25} sx={appBottomNavStyles.itemContent}>
                <Box component="span" sx={appBottomNavStyles.itemIcon}>
                  <AppIcon name={item.iconName} size={23} />
                </Box>
                <Typography component="span" sx={getBottomNavLabelSx(isActive)}>
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
