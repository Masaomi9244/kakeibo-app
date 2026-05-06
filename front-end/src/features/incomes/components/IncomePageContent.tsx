import type { ReactElement } from "react";

import {
  Box,
  Button,
  Checkbox,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { AmountText } from "@/components/atoms/AmountText";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { formatYen } from "@/libs/money";

/**
 * 収入一覧に表示する収入。
 */
type IncomeItem = {
  readonly amount: number;
  readonly date: string;
  readonly id: string;
  readonly isIncludedInBalance: boolean;
  readonly name: string;
};

const incomeItems: readonly IncomeItem[] = [
  {
    amount: 280000,
    date: "2026-05-24",
    id: "income-salary",
    isIncludedInBalance: true,
    name: "給与",
  },
  {
    amount: 35000,
    date: "2026-05-14",
    id: "income-side",
    isIncludedInBalance: true,
    name: "副業収入",
  },
];

/**
 * @description 収入を新規登録するための静的フォームを表示する。
 * @param なし
 * @returns 収入登録フォームUI。
 * @example
 * <IncomeForm />
 */
function IncomeForm(): ReactElement {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        p: { sm: 3, xs: 2.5 },
      }}
    >
      <Stack spacing={2.5}>
        <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
          + 新しい収入
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { sm: "1fr 1fr", xs: "1fr" },
          }}
        >
          <TextField
            fullWidth
            label="収入名"
            placeholder="給与、副業収入など"
            required
          />
          <TextField
            fullWidth
            inputMode="numeric"
            label="金額"
            placeholder="¥ 0"
            required
          />
        </Box>
        <TextField fullWidth label="入金日" required value="2026/05/05" />
        <Paper
          elevation={0}
          sx={{
            bgcolor: "rgba(17, 24, 39, 0.04)",
            borderRadius: 1,
            p: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Checkbox defaultChecked />
            <Box>
              <Typography sx={{ fontWeight: 700 }}>今月使えるお金に含める</Typography>
              <Typography color="text.secondary" variant="body2">
                この収入を月の予算計算に含めます
              </Typography>
            </Box>
          </Stack>
        </Paper>
        <Button size="large" variant="contained">
          + 登録する
        </Button>
      </Stack>
    </Paper>
  );
}

/**
 * @description 登録済み収入の静的一覧を表示する。
 * @param なし
 * @returns 収入一覧UI。
 * @example
 * <IncomeList />
 */
function IncomeList(): ReactElement {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { sm: 3, xs: 2.5 } }}>
        <Typography component="h2" sx={{ fontWeight: 700 }} variant="h6">
          収入一覧
        </Typography>
      </Box>
      <Stack divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />}>
        {incomeItems.map((income) => (
          <Box
            key={income.id}
            sx={{
              alignItems: { sm: "center", xs: "flex-start" },
              display: "grid",
              gap: 2,
              gridTemplateColumns: { sm: "1fr auto auto", xs: "1fr" },
              p: { sm: 2.5, xs: 2 },
            }}
          >
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography sx={{ fontWeight: 700 }}>{income.name}</Typography>
                {income.isIncludedInBalance && (
                  <Typography
                    color="success.main"
                    sx={{ bgcolor: "rgba(5, 150, 105, 0.1)", borderRadius: 1, px: 1 }}
                    variant="caption"
                  >
                    予算に含む
                  </Typography>
                )}
              </Stack>
              <Typography color="text.secondary" variant="body2">
                {income.date}
              </Typography>
            </Stack>
            <Typography color="success.main" sx={{ fontWeight: 700 }} variant="h6">
              {formatYen(income.amount)}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined">
                編集
              </Button>
              <Button color="error" size="small" variant="outlined">
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
 * @description 収入管理画面の静的モック全体を表示する。
 * @param なし
 * @returns 収入管理画面のコンテンツUI。
 * @example
 * <IncomePageContent />
 */
export function IncomePageContent(): ReactElement {
  return (
    <Stack spacing={3}>
      <PageHeader subtitle="収入を追加・管理する" title="収入管理" />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
        }}
      >
        <Paper
          sx={{
            background: "linear-gradient(135deg, #059669 0%, #45b39d 100%)",
            borderRadius: 1,
            color: "common.white",
            p: 3,
          }}
        >
          <Stack spacing={1.5}>
            <Typography sx={{ fontWeight: 700 }}>今月の総収入</Typography>
            <AmountText amount={315000} size="medium" tone="inverse" />
          </Stack>
        </Paper>
        <StatCard amount={315000} label="予算に含まれる収入" tone="income" />
      </Box>
      <IncomeForm />
      <IncomeList />
    </Stack>
  );
}
