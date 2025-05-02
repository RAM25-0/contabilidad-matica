
import type { InventoryOperation, InventoryState } from "@/types/inventory";

export interface InventoryHookResult {
  state: InventoryState;
  handleAddOperation: (
    newOperation: Omit<
      InventoryOperation,
      "id" | "averageCost" | "balance" | "stockBalance" | "totalCost"
    >
  ) => void;
  handleEditOperation: (
    id: string,
    newOperation: Omit<
      InventoryOperation,
      "id" | "averageCost" | "balance" | "stockBalance" | "totalCost"
    >
  ) => void;
  handleDeleteOperation: (id: string) => void;
  handleCalculateAverage: () => void;
  handleViewHistory: () => void;
}
