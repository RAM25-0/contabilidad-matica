
import { PepsOperation, PepsState } from "@/types/peps-inventory";
import { toast } from "@/components/ui/use-toast";

export function editOperation(
  prevState: PepsState,
  operationId: string,
  values: Partial<Omit<PepsOperation, "id" | "balance">>
): PepsState {
  const opIndex = prevState.operations.findIndex((op) => op.id === operationId);
  if (opIndex === -1) return prevState;

  const updatedOperations = [...prevState.operations];
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
    ...prevState,
    operations: updatedOperations,
  };
}
