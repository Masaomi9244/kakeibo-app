import type {
  FixedCostDto,
  ListFixedCostsResponse,
} from "@/features/fixed-costs/api/fixedCostDto";
import type { FixedCostItem } from "@/features/fixed-costs/domain/fixedCost";

/**
 * @description 固定費DTOを固定費domain modelへ変換する。
 * @param dto - APIから受け取った固定費DTO。
 * @returns 固定費domain model。
 * @example
 * mapFixedCostDto({ id: "id", name: "家賃", amount: 80000, startMonth: "2026-05-01", isActive: true });
 */
export const mapFixedCostDto = (dto: FixedCostDto): FixedCostItem => ({
  amount: dto.amount,
  id: dto.id,
  isActive: dto.isActive,
  name: dto.name,
  startMonth: dto.startMonth,
});

/**
 * @description 固定費一覧responseを固定費domain model配列へ変換する。
 * @param response - APIから受け取った固定費一覧response。
 * @returns 固定費domain model配列。
 * @example
 * mapListFixedCostsResponse({ items: [] });
 */
export const mapListFixedCostsResponse = (
  response: ListFixedCostsResponse,
): FixedCostItem[] => response.items.map(mapFixedCostDto);
