
import { v4 as uuidv4 } from "uuid";
import { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";
import { toast } from "@/components/ui/use-toast";

export function addInitialBalance(
  prev: PepsState,
  date: Date,
  units: number,
  unitCost: number,
  description: string
): PepsState {
  if (prev.hasInitialBalance) {
    toast({
      title: "Error",
      description: "Ya existe un saldo inicial. Solo puede haber uno.",
      variant: "destructive",
    });
    return prev;
  }

  if (units <= 0 || unitCost <= 0) {
    toast({
      title: "Error",
      description: "Las unidades y el costo unitario deben ser mayores a cero.",
      variant: "destructive",
    });
    return prev;
  }

  const lotId = uuidv4();
  const newLot: PepsLot = {
    id: lotId,
    date,
    lotName: "Saldo Inicial",
    units,
    remainingUnits: units,
    unitCost,
    type: "SALDO_INICIAL",
  };

  const totalCost = units * unitCost;
  const newOperation: PepsOperation = {
    id: uuidv4(),
    date,
    type: "SALDO_INICIAL",
    description,
    lots: [newLot],
    inUnits: units,
    outUnits: 0,
    balance: totalCost,
    unitCost,
    totalCost,
  };

  toast({
    title: "Saldo Inicial Agregado",
    description: `Se ha registrado el saldo inicial de ${units} unidades con un costo total de $${totalCost.toFixed(2)}`,
  });

  return {
    ...prev,
    operations: [...prev.operations, newOperation],
    lots: [...prev.lots, newLot],
    hasInitialBalance: true,
    currentBalance: totalCost,
  };
}
