"use client";

import type { ChangeEvent, KeyboardEvent, ReactElement } from "react";

import {
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";

import { AmountText } from "@/components/atoms/AmountText";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { formatYen } from "@/libs/money";

type ExpenseItem = {
  readonly amount: number;
  readonly id: string;
  readonly time: string;
};

type QuickExpenseInputProps = {
  readonly onCommit: (amount: number) => void;
};

type TodayExpensesCardProps = {
  readonly expenses: readonly ExpenseItem[];
  readonly total: number;
};

const baseTodayExpenses: readonly ExpenseItem[] = [
  {
    amount: 160,
    id: "expense-1545",
    time: "15:45",
  },
  {
    amount: 1200,
    id: "expense-1230",
    time: "12:30",
  },
  {
    amount: 780,
    id: "expense-0915",
    time: "09:15",
  },
];

const parseAmountInput = (value: string): number | null => {
  const normalizedValue = value.replaceAll(",", "").trim();

  if (normalizedValue === "") {
    return null;
  }

  const amount = Number(normalizedValue);

  if (!Number.isInteger(amount) || amount <= 0) {
    return null;
  }

  return amount;
};

function BudgetHero(): ReactElement {
  return (
    <Paper
      elevation={5}
      sx={{
        background: "linear-gradient(135deg, #0d9488 0%, #45b39d 100%)",
        borderRadius: 1,
        color: "common.white",
        p: { sm: 4, xs: 3 },
      }}
    >
      <Stack spacing={2.5}>
        <Typography sx={{ fontWeight: 700 }}>今月の残り予算</Typography>
        <AmountText amount={213840} size="large" tone="inverse" />
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "flex-end", justifyContent: "space-between" }}
        >
          <Typography sx={{ fontWeight: 700 }}>今日使える目安</Typography>
          <Typography component="p" sx={{ fontWeight: 700 }} variant="h5">
            {formatYen(7920)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

function QuickExpenseInput({ onCommit }: QuickExpenseInputProps): ReactElement {
  const lastCommittedValueRef = useRef<string | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const commitAmount = (): void => {
    const rawValue = amountInput.trim();

    if (rawValue === "") {
      setErrorMessage(undefined);
      return;
    }

    if (lastCommittedValueRef.current === rawValue) {
      return;
    }

    const amount = parseAmountInput(rawValue);

    if (amount === null) {
      setErrorMessage("1円以上の整数で入力してください");
      return;
    }

    lastCommittedValueRef.current = rawValue;
    onCommit(amount);
    setAmountInput("");
    setErrorMessage(undefined);
  };

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>): void => {
    lastCommittedValueRef.current = null;
    setAmountInput(event.target.value);
  };

  const handleAmountKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      commitAmount();
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        p: { sm: 3, xs: 2.5 },
      }}
    >
      <Stack spacing={2}>
        <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
          出費を記録
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Typography color="text.secondary" component="span" variant="h5">
            ¥
          </Typography>
          <TextField
            error={errorMessage !== undefined}
            fullWidth
            helperText={errorMessage ?? " "}
            inputMode="numeric"
            onBlur={commitAmount}
            onChange={handleAmountChange}
            onKeyDown={handleAmountKeyDown}
            placeholder="金額を入力"
            value={amountInput}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}

function TodayExpensesCard({ expenses, total }: TodayExpensesCardProps): ReactElement {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Stack spacing={0} sx={{ p: { sm: 3, xs: 2.5 }, pb: 1 }}>
        <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
          今日の出費
        </Typography>
      </Stack>
      <Stack spacing={1.5} sx={{ p: { sm: 3, xs: 2.5 }, pt: 1 }}>
        {expenses.map((expense) => (
          <Box
            key={expense.id}
            sx={{
              alignItems: "center",
              bgcolor: "rgba(13, 148, 136, 0.04)",
              borderRadius: 1,
              display: "flex",
              justifyContent: "space-between",
              minHeight: 64,
              px: 2,
            }}
          >
            <Typography color="text.secondary">{expense.time}</Typography>
            <Typography sx={{ fontWeight: 700 }} variant="h6">
              {formatYen(expense.amount)}
            </Typography>
          </Box>
        ))}
        <Box
          sx={{
            alignItems: "center",
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            pt: 2,
          }}
        >
          <Typography color="text.secondary">今日の合計</Typography>
          <AmountText amount={total} size="small" tone="expense" />
        </Box>
      </Stack>
    </Paper>
  );
}

export function HomePageContent(): ReactElement {
  const [committedExpenseAmount, setCommittedExpenseAmount] = useState<number | null>(
    null,
  );
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const todayTotal = 2140 + (committedExpenseAmount ?? 0);
  const displayedExpenses =
    committedExpenseAmount === null
      ? baseTodayExpenses
      : [
          {
            amount: committedExpenseAmount,
            id: "draft-expense",
            time: "今",
          },
          ...baseTodayExpenses,
        ];

  const handleExpenseCommit = (amount: number): void => {
    setCommittedExpenseAmount(amount);
    setIsSnackbarOpen(true);
  };

  const handleSnackbarClose = (): void => {
    setIsSnackbarOpen(false);
  };

  const handleUndoExpense = (): void => {
    setCommittedExpenseAmount(null);
    setIsSnackbarOpen(false);
  };

  return (
    <Stack spacing={3}>
      <PageHeader subtitle="2026年5月" title="ホーム" />
      <BudgetHero />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            md: "repeat(3, 1fr)",
            xs: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        <StatCard amount={315000} label="使える収入" tone="income" />
        <StatCard amount={95200} label="固定費" tone="fixedCost" />
        <StatCard amount={5960} label="出費" tone="expense" />
      </Box>
      <QuickExpenseInput onCommit={handleExpenseCommit} />
      <TodayExpensesCard expenses={displayedExpenses} total={todayTotal} />
      <Snackbar
        action={
          <Button color="inherit" onClick={handleUndoExpense} size="small">
            取り消す
          </Button>
        }
        autoHideDuration={5000}
        message="出費を記録しました"
        onClose={handleSnackbarClose}
        open={isSnackbarOpen}
      />
    </Stack>
  );
}
