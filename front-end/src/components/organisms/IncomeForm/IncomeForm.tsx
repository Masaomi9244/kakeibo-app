import type { ChangeEvent, ReactElement, SyntheticEvent } from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { IncomeFormValues } from "@/features/incomes/domain/incomeForm";

import { incomeFormStyles } from "@/components/organisms/IncomeForm/IncomeForm.styles";

/**
 * 収入フォームcomponentに渡すprops。
 */
type IncomeFormProps = {
  /** フォーム上部に表示するエラー文言 */
  readonly errorMessage: string | undefined;
  /** 編集中か */
  readonly isEditing: boolean;
  /** 登録または更新中か */
  readonly isSubmitting: boolean;
  /** 編集キャンセル時に呼び出す処理 */
  readonly onCancelEdit: () => void;
  /** 金額入力変更時に呼び出す処理 */
  readonly onAmountChange: (amount: string) => void;
  /** 予算対象切り替え時に呼び出す処理 */
  readonly onIncludedInBalanceChange: (includedInBalance: boolean) => void;
  /** 入金日変更時に呼び出す処理 */
  readonly onIncomeDateChange: (incomeDate: string) => void;
  /** 収入名入力変更時に呼び出す処理 */
  readonly onMemoChange: (memo: string) => void;
  /** フォーム送信時に呼び出す処理 */
  readonly onSubmit: () => void;
  /** フォーム入力値 */
  readonly values: IncomeFormValues;
};

/**
 * @description 収入を登録または編集するフォームを表示する。
 * @param props - フォーム入力値、送信状態、event handler。
 * @returns 収入登録・編集フォームUI。
 * @example
 * <IncomeForm values={values} isEditing={false} isSubmitting={false} errorMessage={undefined} onMemoChange={handleMemoChange} onAmountChange={handleAmountChange} onIncomeDateChange={handleIncomeDateChange} onIncludedInBalanceChange={handleIncludedInBalanceChange} onSubmit={handleSubmit} onCancelEdit={handleCancelEdit} />
 */
export function IncomeForm({
  errorMessage,
  isEditing,
  isSubmitting,
  onCancelEdit,
  onAmountChange,
  onIncludedInBalanceChange,
  onIncomeDateChange,
  onMemoChange,
  onSubmit,
  values,
}: IncomeFormProps): ReactElement {
  /**
   * @description 収入名入力値をフォームstateへ反映する。
   * @param event - 入力変更イベント。
   * @returns なし。
   * @example
   * handleMemoChange(event);
   */
  const handleMemoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onMemoChange(event.target.value);
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
   * @description 入金日入力値をフォームstateへ反映する。
   * @param event - 入力変更イベント。
   * @returns なし。
   * @example
   * handleIncomeDateChange(event);
   */
  const handleIncomeDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onIncomeDateChange(event.target.value);
  };

  /**
   * @description 予算に含めるかどうかをフォームstateへ反映する。
   * @param event - checkbox変更イベント。
   * @returns なし。
   * @example
   * handleIncludedInBalanceChange(event);
   */
  const handleIncludedInBalanceChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onIncludedInBalanceChange(event.target.checked);
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
      sx={incomeFormStyles.root}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={2} sx={incomeFormStyles.titleRow}>
          <Typography component="h2" sx={incomeFormStyles.title} variant="h6">
            {isEditing ? "収入を編集" : "+ 新しい収入"}
          </Typography>
          {isEditing ? (
            <Button disabled={isSubmitting} onClick={onCancelEdit} size="small">
              キャンセル
            </Button>
          ) : null}
        </Stack>
        {errorMessage === undefined ? null : (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        <Box sx={incomeFormStyles.inputGrid}>
          <TextField
            fullWidth
            label="収入名"
            onChange={handleMemoChange}
            placeholder="給与、副業収入など"
            value={values.memo}
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
        <TextField
          fullWidth
          label="入金日"
          onChange={handleIncomeDateChange}
          required
          slotProps={{ inputLabel: { shrink: true } }}
          type="date"
          value={values.incomeDate}
        />
        <Paper elevation={0} sx={incomeFormStyles.includedCard}>
          <Stack direction="row" spacing={1.5} sx={incomeFormStyles.includedRow}>
            <Checkbox
              checked={values.includedInBalance}
              onChange={handleIncludedInBalanceChange}
            />
            <Box>
              <Typography sx={incomeFormStyles.title}>
                今月使えるお金に含める
              </Typography>
              <Typography color="text.secondary" variant="body2">
                この収入を月の予算計算に含めます
              </Typography>
            </Box>
          </Stack>
        </Paper>
        <Button disabled={isSubmitting} size="large" type="submit" variant="contained">
          {isEditing ? "更新する" : "+ 登録する"}
        </Button>
      </Stack>
    </Paper>
  );
}
