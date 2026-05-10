import type { ChangeEvent, ReactElement, SyntheticEvent } from "react";

import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";

import type { FixedCostFormValues } from "@/features/fixed-costs/domain/fixedCost";

import { fixedCostFormStyles } from "@/components/organisms/FixedCostForm/FixedCostForm.styles";

/**
 * 固定費フォームcomponentに渡すprops。
 */
type FixedCostFormProps = {
  /** フォーム上部に表示するエラー文言 */
  readonly errorMessage: string | undefined;
  /** 編集中か */
  readonly isEditing: boolean;
  /** 保存中か */
  readonly isSubmitting: boolean;
  /** 金額入力変更時に呼び出す処理 */
  readonly onAmountChange: (amount: string) => void;
  /** 編集キャンセル時に呼び出す処理 */
  readonly onCancelEdit: () => void;
  /** 固定費名入力変更時に呼び出す処理 */
  readonly onNameChange: (name: string) => void;
  /** 開始月変更時に呼び出す処理 */
  readonly onStartMonthChange: (startMonth: string) => void;
  /** フォーム送信時に呼び出す処理 */
  readonly onSubmit: () => void;
  /** フォーム入力値 */
  readonly values: FixedCostFormValues;
};

/**
 * @description 固定費を登録または編集するフォームを表示する。
 * @param props - フォーム入力値、送信状態、event handler。
 * @returns 固定費登録フォームUI。
 * @example
 * <FixedCostForm values={values} isEditing={false} isSubmitting={false} errorMessage={undefined} onNameChange={handleNameChange} onAmountChange={handleAmountChange} onStartMonthChange={handleStartMonthChange} onSubmit={handleSubmit} onCancelEdit={handleCancelEdit} />
 */
export function FixedCostForm({
  errorMessage,
  isEditing,
  isSubmitting,
  onAmountChange,
  onCancelEdit,
  onNameChange,
  onStartMonthChange,
  onSubmit,
  values,
}: FixedCostFormProps): ReactElement {
  /**
   * @description 固定費名入力値をフォームstateへ反映する。
   * @param event - 入力変更イベント。
   * @returns なし。
   * @example
   * handleNameChange(event);
   */
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onNameChange(event.target.value);
  };

  /**
   * @description 金額入力値をフォームstateへ反映する。
   * @param event - 入力変更イベント。
   * @returns なし。
   * @example
   * handleAmountChange(event);
   */
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onAmountChange(event.target.value);
  };

  /**
   * @description 開始月入力値をフォームstateへ反映する。
   * @param event - 入力変更イベント。
   * @returns なし。
   * @example
   * handleStartMonthChange(event);
   */
  const handleStartMonthChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onStartMonthChange(event.target.value);
  };

  /**
   * @description form submitイベントの既定動作を止めて送信処理を呼び出す。
   * @param event - form submitイベント。
   * @returns なし。
   * @example
   * handleSubmit(event);
   */
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      variant="outlined"
      sx={fixedCostFormStyles.root}
    >
      <Stack spacing={2.5}>
        <Typography component="h2" sx={fixedCostFormStyles.title} variant="h6">
          {isEditing ? "固定費を編集" : "新しい固定費"}
        </Typography>
        {errorMessage === undefined ? null : (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        <Box sx={fixedCostFormStyles.inputGrid}>
          <TextField
            fullWidth
            label="固定費名"
            onChange={handleNameChange}
            placeholder="家賃、光熱費など"
            required
            value={values.name}
          />
          <TextField
            fullWidth
            inputMode="numeric"
            label="金額"
            onChange={handleAmountChange}
            placeholder="¥ 0"
            required
            value={values.amount}
          />
        </Box>
        <Box sx={fixedCostFormStyles.startMonthField}>
          <TextField
            fullWidth
            label="開始月"
            onChange={handleStartMonthChange}
            required
            slotProps={{ inputLabel: { shrink: true } }}
            type="month"
            value={values.startMonth}
          />
          <Typography
            color="text.secondary"
            sx={fixedCostFormStyles.startMonthHelpText}
            variant="body2"
          >
            この月から毎月の予算計算に含まれます
          </Typography>
        </Box>
        <Button disabled={isSubmitting} size="large" type="submit" variant="contained">
          {isEditing ? "更新する" : "登録する"}
        </Button>
        {isEditing ? (
          <Button disabled={isSubmitting} onClick={onCancelEdit} size="small">
            キャンセル
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}
