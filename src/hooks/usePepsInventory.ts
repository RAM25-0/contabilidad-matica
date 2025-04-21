
import { useState } from "react";
import { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";
import { addInitialBalance } from "./pepsHandlers/addInitialBalance";
import { addPurchase } from "./pepsHandlers/addPurchase";
import { addSale } from "./pepsHandlers/addSale";
import { addReturn } from "./pepsHandlers/addReturn";
import { toast } from "@/components/ui/use-toast";

export function usePepsInventory() {
  const [state, setState] = useState<PepsState>({
    operations: [],
    lots: [],
    hasInitialBalance: false,
    currentBalance: 0,
  });

  const handleAddInitialBalance = (
    date: Date,
    units: number,
    unitCost: number,
    description: string
  ) => {
    setState((prev) =>
      addInitialBalance(prev, date, units, unitCost, description)
    );
  };

  const handleAddPurchase = (
    date: Date,
    lotName: string,
    units: number,
    unitCost: number,
    description: string
  ) => {
    setState((prev) =>
      addPurchase(prev, date, lotName, units, unitCost, description)
    );
  };

  const handleAddSale = (date: Date, units: number, description: string) => {
    setState((prev) => addSale(prev, date, units, description));
  };

  const handleAddReturn = (
    date: Date,
    lotId: string,
    units: number,
    description: string
  ) => {
    setState((prev) => addReturn(prev, date, lotId, units, description));
  };

  const handleEditOperation = (
    operationId: string,
    values: Partial<Omit<PepsOperation, "id" | "balance">>
  ) => {
    setState((prev) => {
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
    });
  };

  const handleDeleteOperation = (operationId: string) => {
    setState((prev) => {
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
    });
  };

  const getAvailableLots = () => {
    return state.lots.filter(
      (lot) => lot.type !== "VENTA" && lot.remainingUnits > 0
    );
  };

  return {
    state,
    handleAddInitialBalance,
    handleAddPurchase,
    handleAddSale,
    handleAddReturn,
    getAvailableLots,
    handleEditOperation,
    handleDeleteOperation,
  };
}
