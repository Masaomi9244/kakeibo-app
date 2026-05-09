"use client";

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
import { useMemo, useState } from "react";

import type { Income } from "@/domains/income";
import type { IncomeFormValues } from "@/features/incomes/usecases/normalizeIncomeForm";

import { AmountText } from "@/components/atoms/AmountText";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { incomePageContentStyles } from "@/features/incomes/components/IncomePageContent.styles";
import { useCreateIncome } from "@/features/incomes/hooks/useCreateIncome";
import { useDeleteIncome } from "@/features/incomes/hooks/useDeleteIncome";
import { useIncomes } from "@/features/incomes/hooks/useIncomes";
import { useUpdateIncome } from "@/features/incomes/hooks/useUpdateIncome";
import { normalizeIncomeForm } from "@/features/incomes/usecases/normalizeIncomeForm";
import { formatAsiaTokyoDate, formatAsiaTokyoMonth } from "@/libs/date";
import { formatYen } from "@/libs/money";

/**
 * 収入フォームの編集状態。
 */
type EditingIncomeState = {
  readonly id: string;
};

/**
 * 収入フォームcomponentに渡すprops。
 */
type IncomeFormProps = {
  readonly errorMessage: string | undefined;
  readonly isEditing: boolean;
  readonly isSubmitting: boolean;
  readonly onCancelEdit: () => void;
  readonly onChange: (values: IncomeFormValues) => void;
  readonly onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
  readonly values: IncomeFormValues;
};

/**
 * 収入一覧componentに渡すprops。
 */
type IncomeListProps = {
  readonly incomes: readonly Income[];
  readonly isDeleting: boolean;
  readonly isLoading: boolean;
  readonly isUpdating: boolean;
  readonly onDelete: (incomeId: string) => void;
  readonly onEdit: (income: Income) => void;
  readonly onToggleIncludedInBalance: (income: Income) => void;
};

/**
 * 収入サマリーcomponentに渡すprops。
 */
type IncomeSummaryProps = {
  readonly incomes: readonly Income[];
};

/**
 * @description 空の収入フォーム入力値を作成する。
 * @param incomeDate - 初期表示する入金日。
 * @returns 収入フォームの初期値。
 * @example
 * createEmptyIncomeFormValues("2026-05-25");
 */
const createEmptyIncomeFormValues = (incomeDate: string): IncomeFormValues => ({
  amount: "",
  includedInBalance: true,
  incomeDate,
  memo: "",
});

/**
 * @description 収入domain modelを編集フォーム入力値へ変換する。
 * @param income - 編集対象の収入。
 * @returns 収入フォーム入力値。
 * @example
 * mapIncomeToFormValues(income);
 */
const mapIncomeToFormValues = (income: Income): IncomeFormValues => ({
  amount: String(income.amount),
  includedInBalance: income.includedInBalance,
  incomeDate: income.incomeDate,
  memo: income.memo ?? "",
});

/**
 * @description 収入一覧で表示する名前を取得する。
 * @param income - 表示対象の収入。
 * @returns 収入名として表示する文字列。
 * @example
 * getIncomeDisplayName(income);
 */
const getIncomeDisplayName = (income: Income): string => income.memo ?? "名称未設定";

/**
 * @description 収入一覧の合計収入を計算する。
 * @param incomes - 対象月の収入一覧。
 * @returns 対象月の全収入合計。
 * @example
 * calculateTotalIncome(incomes);
 */
const calculateTotalIncome = (incomes: readonly Income[]): number =>
  incomes.reduce((total, income) => total + income.amount, 0);

/**
 * @description 収入一覧の予算に含まれる収入を計算する。
 * @param incomes - 対象月の収入一覧。
 * @returns 対象月の予算に含まれる収入合計。
 * @example
 * calculateIncludedIncome(incomes);
 */
const calculateIncludedIncome = (incomes: readonly Income[]): number =>
  incomes.reduce(
    (total, income) => total + (income.includedInBalance ? income.amount : 0),
    0,
  );

/**
 * @description 収入サマリーカードを表示する。
 * @param props - 対象月の収入一覧。
 * @returns 収入サマリーUI。
 * @example
 * <IncomeSummary incomes={incomes} />
 */
function IncomeSummary({ incomes }: IncomeSummaryProps): ReactElement {
  const totalIncome = calculateTotalIncome(incomes);
  const includedIncome = calculateIncludedIncome(incomes);

  return (
    <Box sx={incomePageContentStyles.summaryGrid}>
      <Paper sx={incomePageContentStyles.incomeHero}>
        <Stack spacing={1.5}>
          <Typography sx={{ fontWeight: 700 }}>今月の総収入</Typography>
          <AmountText amount={totalIncome} size="medium" tone="inverse" />
        </Stack>
      </Paper>
      <StatCard amount={includedIncome} label="予算に含まれる収入" tone="income" />
    </Box>
  );
}

/**
 * @description 収入を登録または編集するフォームを表示する。
 * @param props - フォーム入力値、送信状態、event handler。
 * @returns 収入登録・編集フォームUI。
 * @example
 * <IncomeForm values={values} isEditing={false} isSubmitting={false} errorMessage={undefined} onChange={setValues} onSubmit={handleSubmit} onCancelEdit={handleCancelEdit} />
 */
function IncomeForm({
  errorMessage,
  isEditing,
  isSubmitting,
  onCancelEdit,
  onChange,
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
    onChange({ ...values, memo: event.target.value });
  };

  /**
   * @description 金額入力値をフォームstateへ反映する。
   * @param event - 入力変更イベント。
   * @returns なし。
   * @example
   * handleAmountChange(event);
   */
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...values, amount: event.target.value });
  };

  /**
   * @description 入金日入力値をフォームstateへ反映する。
   * @param event - 入力変更イベント。
   * @returns なし。
   * @example
   * handleIncomeDateChange(event);
   */
  const handleIncomeDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...values, incomeDate: event.target.value });
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
    onChange({ ...values, includedInBalance: event.target.checked });
  };

  return (
    <Paper
      component="form"
      onSubmit={onSubmit}
      variant="outlined"
      sx={incomePageContentStyles.formCard}
    >
      <Stack spacing={2.5}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
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
        <Box sx={incomePageContentStyles.formGrid}>
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
        <Paper elevation={0} sx={incomePageContentStyles.includedCard}>
          <Stack direction="row" spacing={1.5} sx={incomePageContentStyles.includedRow}>
            <Checkbox
              checked={values.includedInBalance}
              onChange={handleIncludedInBalanceChange}
            />
            <Box>
              <Typography sx={{ fontWeight: 700 }}>今月使えるお金に含める</Typography>
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

/**
 * @description 登録済み収入の一覧を表示する。
 * @param props - 収入一覧、通信状態、操作handler。
 * @returns 収入一覧UI。
 * @example
 * <IncomeList incomes={incomes} isLoading={false} isUpdating={false} isDeleting={false} onEdit={handleEditIncome} onDelete={handleDeleteIncome} onToggleIncludedInBalance={handleToggleIncludedInBalance} />
 */
function IncomeList({
  incomes,
  isDeleting,
  isLoading,
  isUpdating,
  onDelete,
  onEdit,
  onToggleIncludedInBalance,
}: IncomeListProps): ReactElement {
  return (
    <Paper variant="outlined" sx={incomePageContentStyles.incomeListCard}>
      <Box sx={incomePageContentStyles.incomeListHeader}>
        <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
          収入一覧
        </Typography>
      </Box>
      <Stack divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />}>
        {isLoading ? (
          <Box sx={incomePageContentStyles.incomeListRow}>
            <Typography color="text.secondary">読み込み中です</Typography>
          </Box>
        ) : null}
        {!isLoading && incomes.length === 0 ? (
          <Box sx={incomePageContentStyles.incomeListRow}>
            <Typography color="text.secondary">収入はまだありません</Typography>
          </Box>
        ) : null}
        {incomes.map((income) => (
          <Box key={income.id} sx={incomePageContentStyles.incomeListRow}>
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography sx={{ fontWeight: 700 }}>
                  {getIncomeDisplayName(income)}
                </Typography>
                {income.includedInBalance ? (
                  <Typography
                    color="success.main"
                    sx={incomePageContentStyles.incomeBadge}
                    variant="caption"
                  >
                    予算に含む
                  </Typography>
                ) : null}
              </Stack>
              <Typography color="text.secondary" variant="body2">
                {income.incomeDate}
              </Typography>
            </Stack>
            <Typography color="success.main" sx={{ fontWeight: 700 }} variant="h6">
              {formatYen(income.amount)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Checkbox
                checked={income.includedInBalance}
                disabled={isUpdating}
                onChange={() => {
                  onToggleIncludedInBalance(income);
                }}
              />
              <Button
                disabled={isUpdating}
                onClick={() => onEdit(income)}
                size="small"
                variant="outlined"
              >
                編集
              </Button>
              <Button
                color="error"
                disabled={isDeleting}
                onClick={() => onDelete(income.id)}
                size="small"
                variant="outlined"
              >
                削除
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

/**
 * @description 収入管理画面をAPI接続済みの状態で表示する。
 * @param なし。
 * @returns 収入管理画面のコンテンツUI。
 * @example
 * <IncomePageContent />
 */
export function IncomePageContent(): ReactElement {
  const todayDate = useMemo(() => formatAsiaTokyoDate(new Date()), []);
  const currentMonth = useMemo(() => formatAsiaTokyoMonth(new Date()), []);
  const currentYear = Number(currentMonth.slice(0, 4));
  const [formValues, setFormValues] = useState<IncomeFormValues>(() =>
    createEmptyIncomeFormValues(todayDate),
  );
  const [editingIncome, setEditingIncome] = useState<EditingIncomeState | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const incomesQuery = useIncomes(currentMonth);
  const createIncomeMutation = useCreateIncome({
    month: currentMonth,
    year: currentYear,
  });
  const updateIncomeMutation = useUpdateIncome({
    month: currentMonth,
    year: currentYear,
  });
  const deleteIncomeMutation = useDeleteIncome({
    month: currentMonth,
    year: currentYear,
  });
  const incomes = incomesQuery.data ?? [];
  const isSubmitting = createIncomeMutation.isPending || updateIncomeMutation.isPending;

  /**
   * @description 収入フォームを初期状態へ戻す。
   * @param なし。
   * @returns なし。
   * @example
   * resetForm();
   */
  const resetForm = (): void => {
    setFormValues(createEmptyIncomeFormValues(todayDate));
    setEditingIncome(null);
    setFormErrorMessage(undefined);
  };

  /**
   * @description 収入フォーム送信時に登録または更新APIを呼び出す。
   * @param event - form submitイベント。
   * @returns なし。
   * @example
   * handleSubmit(event);
   */
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const normalized = normalizeIncomeForm(formValues);

    if (normalized === null) {
      setFormErrorMessage("金額と入金日を正しく入力してください");
      return;
    }

    /**
     * @description 正規化済みの収入フォームをAPIへ保存する。
     * @param なし。
     * @returns なし。
     * @example
     * void saveIncome();
     */
    const saveIncome = async (): Promise<void> => {
      if (editingIncome === null) {
        await createIncomeMutation.mutateAsync(normalized.request);
      } else {
        await updateIncomeMutation.mutateAsync({
          id: editingIncome.id,
          request: normalized.request,
        });
      }

      resetForm();
    };

    void saveIncome().catch((error: unknown) => {
      setFormErrorMessage(
        error instanceof Error ? error.message : "収入の保存に失敗しました",
      );
    });
  };

  /**
   * @description 編集対象の収入をフォームへ反映する。
   * @param income - 編集対象の収入。
   * @returns なし。
   * @example
   * handleEditIncome(income);
   */
  const handleEditIncome = (income: Income): void => {
    setEditingIncome({ id: income.id });
    setFormValues(mapIncomeToFormValues(income));
    setFormErrorMessage(undefined);
  };

  /**
   * @description 指定IDの収入を削除する。
   * @param incomeId - 削除対象の収入ID。
   * @returns なし。
   * @example
   * handleDeleteIncome("income-id");
   */
  const handleDeleteIncome = (incomeId: string): void => {
    void deleteIncomeMutation.mutateAsync(incomeId).catch((error: unknown) => {
      setFormErrorMessage(
        error instanceof Error ? error.message : "収入の削除に失敗しました",
      );
    });
  };

  /**
   * @description 収入を今月使えるお金に含めるかどうかを切り替える。
   * @param income - 切り替え対象の収入。
   * @returns なし。
   * @example
   * handleToggleIncludedInBalance(income);
   */
  const handleToggleIncludedInBalance = (income: Income): void => {
    void updateIncomeMutation
      .mutateAsync({
        id: income.id,
        request: {
          amount: income.amount,
          includedInBalance: !income.includedInBalance,
          incomeDate: income.incomeDate,
          memo: income.memo,
        },
      })
      .catch((error: unknown) => {
        setFormErrorMessage(
          error instanceof Error ? error.message : "収入の更新に失敗しました",
        );
      });
  };

  return (
    <Stack spacing={3}>
      <PageHeader subtitle="収入を追加・管理する" title="収入管理" />
      {incomesQuery.isError ? (
        <Alert severity="error">{incomesQuery.error.message}</Alert>
      ) : null}
      <IncomeSummary incomes={incomes} />
      <IncomeForm
        errorMessage={formErrorMessage}
        isEditing={editingIncome !== null}
        isSubmitting={isSubmitting}
        onCancelEdit={resetForm}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        values={formValues}
      />
      <IncomeList
        incomes={incomes}
        isDeleting={deleteIncomeMutation.isPending}
        isLoading={incomesQuery.isLoading}
        isUpdating={updateIncomeMutation.isPending}
        onDelete={handleDeleteIncome}
        onEdit={handleEditIncome}
        onToggleIncludedInBalance={handleToggleIncludedInBalance}
      />
    </Stack>
  );
}
