import type {
  CreateFixedCostRequest,
  DeleteFixedCostResponse,
  FixedCostResponse,
  ListFixedCostsResponse,
  UpdateFixedCostRequest,
} from "@/features/fixed-costs/api/fixedCostDto";

import { requestApi } from "@/libs/apiClient";

/**
 * @description 対象月の固定費一覧を取得する。
 * @param month - YYYY-MM形式の対象月。
 * @returns 対象月の固定費一覧response。
 * @example
 * await getFixedCosts("2026-05");
 */
export const getFixedCosts = async (month: string): Promise<ListFixedCostsResponse> => {
  /** 対象月の固定費一覧取得に使うquery string */
  const params = new URLSearchParams({ month });

  return requestApi<ListFixedCostsResponse>(`/api/fixed-costs?${params.toString()}`);
};

/**
 * @description 固定費を新規登録する。
 * @param request - 登録する固定費情報。
 * @returns 登録された固定費response。
 * @example
 * await createFixedCost({ name: "家賃", amount: 80000, startMonth: "2026-05-01", isActive: true });
 */
export const createFixedCost = async (
  request: CreateFixedCostRequest,
): Promise<FixedCostResponse> =>
  requestApi<FixedCostResponse>("/api/fixed-costs", {
    body: request,
    method: "POST",
  });

/**
 * @description 指定IDの固定費を更新する。
 * @param fixedCostId - 更新対象の固定費ID。
 * @param request - 更新する固定費情報。
 * @returns 更新された固定費response。
 * @example
 * await updateFixedCost("fixed-cost-id", { name: "家賃", amount: 85000, startMonth: "2026-05-01", isActive: true });
 */
export const updateFixedCost = async (
  fixedCostId: string,
  request: UpdateFixedCostRequest,
): Promise<FixedCostResponse> =>
  requestApi<FixedCostResponse>(`/api/fixed-costs/${encodeURIComponent(fixedCostId)}`, {
    body: request,
    method: "PUT",
  });

/**
 * @description 指定IDの固定費を削除する。
 * @param fixedCostId - 削除対象の固定費ID。
 * @returns 削除完了後に解決するPromise。
 * @example
 * await deleteFixedCost("fixed-cost-id");
 */
export const deleteFixedCost = async (fixedCostId: string): Promise<void> => {
  await requestApi<DeleteFixedCostResponse>(
    `/api/fixed-costs/${encodeURIComponent(fixedCostId)}`,
    { method: "DELETE" },
  );
};
