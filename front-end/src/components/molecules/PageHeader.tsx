import type { ReactElement } from "react";

import { Stack, Typography } from "@mui/material";

import { pageHeaderStyles } from "@/components/molecules/PageHeader.styles";

/**
 * 画面見出しコンポーネントに渡すprops。
 */
type PageHeaderProps = {
  /** タイトル下に表示する補足テキスト */
  readonly subtitle?: string;
  /** 画面タイトル */
  readonly title: string;
};

/**
 * @description 各画面のタイトルと補足テキストを同じ余白で表示する。
 * @param props - 画面タイトルと任意のサブタイトル。
 * @returns 画面上部の見出しUI。
 * @example
 * <PageHeader title="ホーム" subtitle="2026年5月" />
 */
export function PageHeader({ subtitle, title }: PageHeaderProps): ReactElement {
  return (
    <Stack spacing={0.75}>
      <Typography component="h1" variant="h4" sx={pageHeaderStyles.title}>
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
