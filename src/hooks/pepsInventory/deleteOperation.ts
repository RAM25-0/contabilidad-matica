
import { PepsState } from "@/types/peps-inventory";
import { toast } from "@/components/ui/use-toast";

export function deleteOperation(
  prevState: PepsState,
  operationId: string
): PepsState {
  const opToDelete = prevState.operations.find((op) => op.id === operationId);
  if (!opToDelete) return prevState;

  if (opToDelete.type === "SALDO_INICIAL") {
    toast({
      title: "No permitido",
      description: "No se puede eliminar el Saldo Inicial.",
      variant: "destructive",
    });
    return prevState;
  }

  const updatedOperations = prevState.operations.filter(
    (op) => op.id !== operationId
  );

  toast({
    title: "Operación borrada",
    description: "La operación ha sido borrada.",
  });

  return {
    ...prevState,
    operations: updatedOperations,
  };
}
