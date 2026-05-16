import type { ChangeEvent, KeyboardEvent, ReactElement } from "react";

import { Paper, Stack, TextField, Typography } from "@mui/material";

import { quickExpenseInputStyles } from "@/components/organisms/QuickExpenseInput/QuickExpenseInput.styles";

/**
 * 出費クイック入力componentに渡すprops。
 */
export type QuickExpenseInputProps = {
  /** 入力中の金額文字列 */
  readonly amountInput: string;
  /** 入力欄のblur時に呼び出す処理 */
  readonly onAmountBlur: () => void;
  /** 入力値変更時に呼び出す処理 */
  readonly onAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** 入力欄のキー操作時に呼び出す処理 */
  readonly onAmountKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  /** 表示する入力エラー */
  readonly errorMessage: string | undefined;
  /** 登録処理中か */
  readonly isSubmitting: boolean;
};

/**
 * @description 金額だけで出費を記録するためのクイック入力欄を表示する。
 * @param props - 入力状態と入力event handler。
 * @returns 出費金額入力UI。
 * @example
 * <QuickExpenseInput amountInput="1200" isSubmitting={false} onAmountBlur={handleBlur} onAmountChange={handleChange} onAmountKeyDown={handleKeyDown} />
 */
export function QuickExpenseInput({
  amountInput,
  errorMessage,
  isSubmitting,
  onAmountBlur,
  onAmountChange,
  onAmountKeyDown,
}: QuickExpenseInputProps): ReactElement {
  return (
    <Paper variant="outlined" sx={quickExpenseInputStyles.card}>
      <Stack spacing={2}>
        <Typography component="h2" sx={quickExpenseInputStyles.heading} variant="h6">
          変動費を記録
        </Typography>
        <TextField
          disabled={isSubmitting}
          error={errorMessage !== undefined}
          fullWidth
          helperText={
            errorMessage ??
            "金額を入力してEnterキーを押すか、フォーカスを外すと記録されます"
          }
          inputMode="numeric"
          onBlur={onAmountBlur}
          onChange={onAmountChange}
          onKeyDown={onAmountKeyDown}
          placeholder="金額を入力"
          value={amountInput}
        />
      </Stack>
    </Paper>
  );
}
