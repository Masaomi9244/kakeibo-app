"use client";

import type { ReactElement } from "react";

import { Alert, Stack } from "@mui/material";

import { IncomeForm } from "@/components/organisms/IncomeForm/IncomeForm";
import { IncomeList } from "@/components/organisms/IncomeList/IncomeList";
import { IncomeSummary } from "@/components/organisms/IncomeSummary/IncomeSummary";
import { useIncomePageViewModel } from "@/features/incomes/hooks/useIncomePageViewModel";

/**
 * @description 収入管理画面をAPI接続済みの状態で表示する。
 * @param なし。
 * @returns 収入管理画面のコンテンツUI。
 * @example
 * <IncomePageContent />
 */
export function IncomePageContent(): ReactElement {
  /** 収入管理画面の表示状態とevent handler */
  const incomePage = useIncomePageViewModel();

  return (
    <Stack spacing={3}>
      {incomePage.incomesErrorMessage === undefined ? null : (
        <Alert severity="error">{incomePage.incomesErrorMessage}</Alert>
      )}
      <IncomeSummary
        includedIncome={incomePage.totals.includedIncome}
        totalIncome={incomePage.totals.totalIncome}
      />
      <IncomeForm
        errorMessage={incomePage.incomeForm.errorMessage}
        isEditing={incomePage.incomeForm.isEditing}
        isSubmitting={incomePage.incomeForm.isSubmitting}
        onAmountChange={incomePage.incomeForm.handleAmountChange}
        onCancelEdit={incomePage.incomeForm.handleCancelEdit}
        onIncludedInBalanceChange={incomePage.incomeForm.handleIncludedInBalanceChange}
        onIncomeDateChange={incomePage.incomeForm.handleIncomeDateChange}
        onMemoChange={incomePage.incomeForm.handleMemoChange}
        onSubmit={incomePage.incomeForm.handleSubmit}
        values={incomePage.incomeForm.values}
      />
      <IncomeList
        incomes={incomePage.incomes}
        isDeleting={incomePage.isDeleting}
        isLoading={incomePage.incomesIsLoading}
        isUpdating={incomePage.isUpdating}
        onDelete={incomePage.handleDeleteIncome}
        onEdit={incomePage.handleEditIncome}
        onToggleIncludedInBalance={incomePage.handleToggleIncludedInBalance}
      />
    </Stack>
  );
}
