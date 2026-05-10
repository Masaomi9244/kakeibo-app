"use client";

import type { ReactElement } from "react";

import { Alert, Box, Stack } from "@mui/material";

import { StatCard } from "@/components/molecules/StatCard";
import { FixedCostForm } from "@/components/organisms/FixedCostForm/FixedCostForm";
import { FixedCostGuide } from "@/components/organisms/FixedCostGuide/FixedCostGuide";
import { FixedCostList } from "@/components/organisms/FixedCostList/FixedCostList";
import { fixedCostPageContentStyles } from "@/components/templates/FixedCostPageContent/FixedCostPageContent.styles";
import { useFixedCostPageViewModel } from "@/features/fixed-costs/hooks/useFixedCostPageViewModel";

/**
 * @description 固定費管理画面のview model接続済みコンテンツ全体を表示する。
 * @param なし
 * @returns 固定費管理画面のコンテンツUI。
 * @example
 * <FixedCostPageContent />
 */
export function FixedCostPageContent(): ReactElement {
  /** 固定費画面の表示状態とevent handler */
  const fixedCostPage = useFixedCostPageViewModel();

  return (
    <Stack spacing={3}>
      {fixedCostPage.fixedCostsErrorMessage === undefined ? null : (
        <Alert severity="error">{fixedCostPage.fixedCostsErrorMessage}</Alert>
      )}
      <FixedCostGuide />
      <Box sx={fixedCostPageContentStyles.statGrid}>
        <StatCard
          amount={fixedCostPage.totals.activeFixedCostTotal}
          label="今月の固定費"
          subtitle={fixedCostPage.totals.fixedCostCountLabel}
          tone="fixedCost"
        />
        <StatCard
          amount={fixedCostPage.totals.fixedCostTotal}
          label="全固定費の合計"
          subtitle={fixedCostPage.totals.fixedCostCountLabel}
        />
      </Box>
      <FixedCostForm
        errorMessage={fixedCostPage.fixedCostForm.errorMessage}
        isEditing={fixedCostPage.fixedCostForm.isEditing}
        isSubmitting={fixedCostPage.fixedCostForm.isSubmitting}
        onAmountChange={fixedCostPage.fixedCostForm.handleAmountChange}
        onCancelEdit={fixedCostPage.fixedCostForm.handleCancelEdit}
        onNameChange={fixedCostPage.fixedCostForm.handleNameChange}
        onStartMonthChange={fixedCostPage.fixedCostForm.handleStartMonthChange}
        onSubmit={fixedCostPage.fixedCostForm.handleSubmit}
        values={fixedCostPage.fixedCostForm.values}
      />
      <FixedCostList
        fixedCosts={fixedCostPage.fixedCosts}
        isLoading={fixedCostPage.fixedCostsIsLoading}
        isOperationDisabled={fixedCostPage.isDeleting || fixedCostPage.isUpdating}
        onDelete={fixedCostPage.handleDeleteFixedCost}
        onEdit={fixedCostPage.handleEditFixedCost}
        onToggleActive={fixedCostPage.handleToggleFixedCostActive}
      />
    </Stack>
  );
}
