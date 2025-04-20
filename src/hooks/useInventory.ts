
import { useState } from "react";
import type { InventoryOperation, InventoryState } from "@/types/inventory";
import { toast } from "@/components/ui/use-toast";
import { calculateOperation } from "@/utils/inventory-utils";

export function useInventory() {
  const [state, setState] = useState<InventoryState>({
    operations: [],
    currentAverageCost: 0,
    currentStock: 0,
    currentBalance: 0,
  });

  const handleAddOperation = (
    newOperation: Omit<
      InventoryOperation,
      "id" | "averageCost" | "balance" | "stockBalance" | "totalCost"
    >
  ) => {
    const operation = calculateOperation(newOperation, state.operations, toast);
    if (!operation) return;

    setState((prevState) => ({
      ...prevState,
      operations: [...prevState.operations, operation],
      currentAverageCost: operation.averageCost,
      currentStock: operation.stockBalance,
      currentBalance: operation.balance,
    }));

    toast({
      title: "Operación agregada",
      description: "La operación se ha registrado correctamente.",
    });
  };

  const handleEditOperation = (
    id: string,
    newOperation: Omit<
      InventoryOperation,
      "id" | "averageCost" | "balance" | "stockBalance" | "totalCost"
    >
  ) => {
    const operationIndex = state.operations.findIndex((op) => op.id === id);
    if (operationIndex === -1) return;

    const updatedOperation = calculateOperation(newOperation, state.operations.slice(0, operationIndex), toast);
    if (!updatedOperation) return;

    const newOperations = [...state.operations];
    newOperations[operationIndex] = { ...updatedOperation, id };

    // Recalculate all subsequent operations
    for (let i = operationIndex + 1; i < newOperations.length; i++) {
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

    const lastOperation = newOperations[newOperations.length - 1];
    setState((prevState) => ({
      ...prevState,
      operations: newOperations,
      currentAverageCost: lastOperation.averageCost,
      currentStock: lastOperation.stockBalance,
      currentBalance: lastOperation.balance,
    }));
  };

  const handleDeleteOperation = (id: string) => {
    const operationIndex = state.operations.findIndex((op) => op.id === id);
    if (operationIndex === -1) return;
    const newOperations = state.operations.filter((op) => op.id !== id);

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
    setState((prevState) => ({
      ...prevState,
      operations: newOperations,
      currentAverageCost: lastOperation.averageCost,
      currentStock: lastOperation.stockBalance,
      currentBalance: lastOperation.balance,
    }));
  };

  const handleCalculateAverage = () => {
    if (state.operations.length === 0) {
      toast({
        title: "Sin operaciones",
        description: "No hay operaciones para calcular el promedio.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Promedio actualizado",
      description: `El costo promedio actual es: ${state.currentAverageCost.toFixed(0)}`,
    });
  };

  const handleViewHistory = () => {
    toast({
      title: "Historial Completo",
      description: "Ya estás viendo el historial completo de operaciones.",
    });
  };

  return {
    state,
    handleAddOperation,
    handleCalculateAverage,
    handleViewHistory,
    handleEditOperation,
    handleDeleteOperation,
  };
}
