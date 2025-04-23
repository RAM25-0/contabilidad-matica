
import { UepsState } from "@/hooks/useUepsInventory";
import { toast } from "@/components/ui/use-toast";

export function deleteOperation(
  prev: UepsState,
  operationId: string
): UepsState {
  const opToDelete = prev.operations.find((op) => op.id === operationId);
  if (!opToDelete) return prev;

  if (opToDelete.type === "SALDO_INICIAL") {
    toast({
      title: "No permitido",
      description: "No se puede eliminar el Saldo Inicial.",
      variant: "destructive",
    });
    return prev;
  }

  const updatedOperations = prev.operations.filter(
    (op) => op.id !== operationId
  );

  toast({
    title: "Operación borrada",
    description: "La operación ha sido borrada.",
  });

  return {
    ...prev,
    operations: updatedOperations,
  };
}
