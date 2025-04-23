
import { v4 as uuidv4 } from "uuid";
import { UepsLot, UepsOperation, UepsState } from "@/hooks/useUepsInventory";
import { toast } from "@/hooks/use-toast";

export function addPurchaseReturn(
  prev: UepsState,
  date: Date,
  lotId: string,
  units: number,
  description: string
): UepsState {
  // Busca el lote que se va a devolver (solo compras o saldo inicial)
  const lotIndex = prev.lots.findIndex(
    lot => lot.id === lotId && (lot.type === "COMPRA" || lot.type === "SALDO_INICIAL")
  );
  if (lotIndex === -1) {
    toast({
      title: "Error",
      description: "Solo se pueden devolver compras o saldos iniciales existentes.",
      variant: "destructive",
    });
    return prev;
  }
  const lot = prev.lots[lotIndex];
  if (units <= 0 || units > lot.remainingUnits) {
    toast({
      title: "Error",
      description: `Unidades inválidas a devolver. Máximo permitido: ${lot.remainingUnits}`,
      variant: "destructive",
    });
    return prev;
  }

  // Resta unidades del lote
  const updatedLots = [...prev.lots];
  updatedLots[lotIndex] = {
    ...lot,
    remainingUnits: lot.remainingUnits - units,
  };

  // Calcula costos
  const totalCost = Number((units * lot.unitCost).toFixed(2));
  const newBalance = Number((prev.currentBalance - totalCost).toFixed(2));
  // Registrar operación de devolución de compra:
  const returnLot: UepsLot = {
    ...lot,
    id: uuidv4(),
    units,
    remainingUnits: 0,
    type: "DEVOLUCION",
  };

  const newOperation: UepsOperation = {
    id: uuidv4(),
    date,
    type: "DEVOLUCION",
    description,
    lots: [returnLot],
    inUnits: 0,
    outUnits: units,
    balance: newBalance,
    unitCost: lot.unitCost,
    totalCost,
    targetLotId: lotId,
  };

  toast({
    title: "Devolución de compra registrada",
    description: `Se devolvieron ${units} unidades (${lot.lotName}) por $${totalCost.toLocaleString("es-MX")}`,
  });

  return {
    ...prev,
    operations: [...prev.operations, newOperation],
    lots: updatedLots,
    currentBalance: newBalance,
  };
}
