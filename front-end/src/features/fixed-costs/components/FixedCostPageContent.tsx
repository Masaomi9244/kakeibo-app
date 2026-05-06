import type { ReactElement } from "react";

import {
  Box,
  Button,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { PageHeader } from "@/components/molecules/PageHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { formatYen } from "@/libs/money";

/**
 * 固定費一覧に表示する固定費。
 */
type FixedCostItem = {
  readonly amount: number;
  readonly id: string;
  readonly isActive: boolean;
  readonly name: string;
  readonly startMonth: string;
};

const fixedCostItems: readonly FixedCostItem[] = [
  {
    amount: 80000,
    id: "fixed-rent",
    isActive: true,
    name: "家賃",
    startMonth: "2026-05",
  },
  {
    amount: 12000,
    id: "fixed-utility",
    isActive: true,
    name: "光熱費",
    startMonth: "2026-05",
  },
  {
    amount: 3200,
    id: "fixed-phone",
    isActive: true,
    name: "スマホ代",
    startMonth: "2026-05",
  },
];

/**
 * @description 固定費の意味と予算反映ルールを画面上で補足する。
 * @param なし
 * @returns 固定費説明カードUI。
 * @example
 * <FixedCostGuide />
 */
function FixedCostGuide(): ReactElement {
  return (
    <Paper
      variant="outlined"
      sx={{
        bgcolor: "rgba(245, 158, 11, 0.08)",
        borderColor: "rgba(245, 158, 11, 0.3)",
        borderRadius: 1,
        p: { sm: 3, xs: 2.5 },
      }}
    >
      <Typography>
        毎月定期的に支払う費用です。家賃、光熱費、サブスクなどを登録すると、自動的に月の予算から差し引かれます。
      </Typography>
    </Paper>
  );
}

/**
 * @description 固定費を新規登録するための静的フォームを表示する。
 * @param なし
 * @returns 固定費登録フォームUI。
 * @example
 * <FixedCostForm />
 */
function FixedCostForm(): ReactElement {
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
          + 新しい固定費
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
            label="固定費名"
            placeholder="家賃、光熱費など"
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
        <TextField fullWidth label="開始月" required value="2026年05月" />
        <Typography color="text.secondary" variant="body2">
          この月から毎月の予算計算に含まれます
        </Typography>
        <Button size="large" variant="contained">
          + 登録する
        </Button>
      </Stack>
    </Paper>
  );
}

/**
 * @description 登録済み固定費の静的一覧を表示する。
 * @param なし
 * @returns 固定費一覧UI。
 * @example
 * <FixedCostList />
 */
function FixedCostList(): ReactElement {
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
          固定費一覧
        </Typography>
      </Box>
      <Stack divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />}>
        {fixedCostItems.map((fixedCost) => (
          <Box
            key={fixedCost.id}
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
                <Typography sx={{ fontWeight: 700 }}>{fixedCost.name}</Typography>
                {fixedCost.isActive && (
                  <Typography
                    color="success.main"
                    sx={{ bgcolor: "rgba(5, 150, 105, 0.1)", borderRadius: 1, px: 1 }}
                    variant="caption"
                  >
                    有効
                  </Typography>
                )}
              </Stack>
              <Typography color="text.secondary" variant="body2">
                {fixedCost.startMonth}から毎月
              </Typography>
            </Stack>
            <Typography color="warning.main" sx={{ fontWeight: 700 }} variant="h6">
              {formatYen(fixedCost.amount)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Switch checked={fixedCost.isActive} size="small" />
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
 * @description 固定費管理画面の静的モック全体を表示する。
 * @param なし
 * @returns 固定費管理画面のコンテンツUI。
 * @example
 * <FixedCostPageContent />
 */
export function FixedCostPageContent(): ReactElement {
  return (
    <Stack spacing={3}>
      <PageHeader subtitle="毎月の固定費を管理する" title="固定費管理" />
      <FixedCostGuide />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
        }}
      >
        <StatCard
          amount={95200}
          label="今月の固定費"
          subtitle="3件の固定費"
          tone="fixedCost"
        />
        <StatCard amount={95200} label="全固定費の合計" subtitle="3件の固定費" />
      </Box>
      <FixedCostForm />
      <FixedCostList />
    </Stack>
  );
}
