
import { calculateOperation } from "@/utils/inventory-utils";
import { toast } from "@/components/ui/use-toast";
import type { InventoryOperation, InventoryState } from "@/types/inventory";

export function addOperation(
  prevState: InventoryState,
  newOperation: Omit<
    InventoryOperation,
    "id" | "averageCost" | "balance" | "stockBalance" | "totalCost"
  >
): InventoryState {
  const operation = calculateOperation(newOperation, prevState.operations, toast);
  if (!operation) return prevState;

  const newState = {
    ...prevState,
    operations: [...prevState.operations, operation],
    currentAverageCost: operation.averageCost,
    currentStock: operation.stockBalance,
    currentBalance: operation.balance,
  };
  
  toast({
    title: "Operación agregada",
    description: "La operación se ha registrado correctamente.",
  });
  
  return newState;
}
