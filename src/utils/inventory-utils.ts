
import { v4 as uuidv4 } from "uuid";
import type { InventoryOperation } from "@/types/inventory";

/**
 * @param newOp The operation details (without calculated fields or ID)
 * @param previousOperations The array of previous InventoryOperation objects
 * @param toast A toast function (optional) for error messages
 */
export function calculateOperation(
  newOp: Omit<InventoryOperation, "id" | "averageCost" | "balance" | "stockBalance" | "totalCost">,
  previousOperations: InventoryOperation[] = [],
  toast?: Function
): InventoryOperation | null {
  const prevOperation = previousOperations[previousOperations.length - 1];
  const prevStock = prevOperation?.stockBalance || 0;
  const prevBalance = prevOperation?.balance || 0;
  const prevAverageCost = prevOperation?.averageCost || 0;

  let stockBalance = prevStock;
  let totalCost = 0;
  let averageCost = prevAverageCost;
  let balance = prevBalance;

  switch (newOp.type) {
    case "SALDO_INICIAL":
      if (!newOp.unitCost) {
        toast?.({
          title: "Error",
          description: "El costo unitario es requerido para el saldo inicial",
          variant: "destructive",
        });
        return null;
      }
      stockBalance = Math.round(newOp.units);
      totalCost = Math.round(newOp.units) * Math.round(newOp.unitCost);
      balance = totalCost;
      averageCost = Math.round(newOp.unitCost);
      break;

    case "COMPRA":
      if (!newOp.unitCost) {
        toast?.({
          title: "Error",
          description: "El costo unitario es requerido para compras",
          variant: "destructive",
        });
        return null;
      }
      stockBalance = prevStock + Math.round(newOp.units);
      totalCost = Math.round(newOp.units) * Math.round(newOp.unitCost);
      balance = prevBalance + totalCost;
      if (stockBalance > 0) {
        averageCost = Math.round(balance / stockBalance);
      }
      break;

    case "VENTA":
      if (newOp.units > prevStock) {
        toast?.({
          title: "Error",
          description: "No hay suficiente stock para realizar la venta",
          variant: "destructive",
        });
        return null;
      }
      stockBalance = prevStock - Math.round(newOp.units);
      totalCost = Math.round(newOp.units) * prevAverageCost;
      balance = prevBalance - totalCost;
      averageCost = stockBalance > 0 ? Math.round(balance / stockBalance) : prevAverageCost;
      break;

    case "DEVOLUCION":
      if (newOp.units > prevStock) {
        toast?.({
          title: "Error",
          description: "No hay suficiente stock para realizar la devolución",
          variant: "destructive",
        });
        return null;
      }
      stockBalance = prevStock - Math.round(newOp.units);
      totalCost = Math.round(newOp.units) * prevAverageCost;
      balance = prevBalance - totalCost;
      averageCost = stockBalance > 0 ? Math.round(balance / stockBalance) : prevAverageCost;
      break;

    default:
      toast?.({
        title: "Error",
        description: "Tipo de operación no válido",
        variant: "destructive",
      });
      return null;
  }

  return {
    id: uuidv4(),
    date: newOp.date,
    type: newOp.type,
    description: newOp.description,
    units: Math.round(newOp.units),
    unitCost: newOp.unitCost !== undefined ? Math.round(newOp.unitCost) : undefined,
    totalCost: Math.round(totalCost),
    averageCost: Math.round(averageCost),
    balance: Math.round(balance),
    stockBalance: Math.round(stockBalance),
  };
}
