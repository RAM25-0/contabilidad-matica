
import { calculateOperation } from "@/utils/inventory-utils";
import { toast } from "@/components/ui/use-toast";
import type { InventoryOperation, InventoryState } from "@/types/inventory";

export function deleteOperation(
  prevState: InventoryState,
  id: string
): InventoryState {
  const operationIndex = prevState.operations.findIndex((op) => op.id === id);
  if (operationIndex === -1) return prevState;
  
  const newOperations = prevState.operations.filter((op) => op.id !== id);

  // Recalculate all subsequent operations
  for (let i = operationIndex; i < newOperations.length; i++) {
    const recalculatedOp = calculateOperation(
      {
        date: newOperations[i].date,
        type: newOperations[i].type,
        description: newOperations[i].description,
        units: newOperations[i].units,
        unitCost: newOperations[i].unitCost,
      },
      newOperations.slice(0, i),
      toast
    );
    if (recalculatedOp) {
      newOperations[i] = { ...recalculatedOp, id: newOperations[i].id };
    }
  }

  const lastOperation =
    newOperations[newOperations.length - 1] || {
      averageCost: 0,
      stockBalance: 0,
      balance: 0,
    };
    
  return {
    ...prevState,
    operations: newOperations,
    currentAverageCost: lastOperation.averageCost,
    currentStock: lastOperation.stockBalance,
    currentBalance: lastOperation.balance,
  };
}
