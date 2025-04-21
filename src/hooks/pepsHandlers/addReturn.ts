
import { v4 as uuidv4 } from "uuid";
import { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";
import { toast } from "@/components/ui/use-toast";

export function addReturn(
  prev: PepsState,
  date: Date,
  lotId: string,
  units: number,
  description: string
): PepsState {
  const targetLot = prev.lots.find(lot => lot.id === lotId);
  if (!targetLot) {
    toast({
      title: "Error",
      description: "El lote seleccionado no existe.",
      variant: "destructive",
    });
    return prev;
  }

  // Para devoluciones, solo verificamos que no estemos devolviendo más unidades
  // de las que existen en el lote
  if (units <= 0 || units > targetLot.remainingUnits) {
    toast({
      title: "Error",
      description: `Solo puede devolver hasta ${targetLot.remainingUnits} unidades de este lote.`,
      variant: "destructive",
    });
    return prev;
  }

  const returnLot: PepsLot = {
    ...targetLot,
    id: uuidv4(),
    units,
    remainingUnits: units,
    type: "DEVOLUCION"
  };

  const updatedLots = prev.lots.map(lot =>
    lot.id === lotId
      ? { ...lot, remainingUnits: lot.remainingUnits - units }
      : lot
  );

  const totalCost = units * targetLot.unitCost;
  const newBalance = prev.currentBalance - totalCost;

  const newOperation: PepsOperation = {
    id: uuidv4(),
    date,
    type: "DEVOLUCION",
    description,
    lots: [returnLot],
    inUnits: 0,
    outUnits: units,
    balance: newBalance,
    unitCost: targetLot.unitCost,
    totalCost,
    targetLotId: lotId,
  };

  toast({
    title: "Devolución Registrada",
    description: `Se han devuelto ${units} unidades del lote ${targetLot.lotName} con un valor total de $${totalCost.toFixed(2)}`,
  });

  return {
    ...prev,
    operations: [...prev.operations, newOperation],
    lots: updatedLots,
    currentBalance: newBalance,
  };
}
