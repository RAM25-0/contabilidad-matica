
import { UepsOperation, UepsState } from "@/hooks/useUepsInventory";
import { toast } from "@/components/ui/use-toast";

export function editOperation(
  prev: UepsState,
  operationId: string,
  values: Partial<Omit<UepsOperation, "id" | "balance">>
): UepsState {
  const opIndex = prev.operations.findIndex((op) => op.id === operationId);
  if (opIndex === -1) return prev;

  const updatedOperations = [...prev.operations];
  const oldOp = updatedOperations[opIndex];
  const updatedOp = {
    ...oldOp,
    ...values,
  };
  updatedOperations[opIndex] = updatedOp;

  toast({
    title: "Operación actualizada",
    description: "Los datos de la operación han sido actualizados.",
  });

  return {
    ...prev,
    operations: updatedOperations,
  };
}
