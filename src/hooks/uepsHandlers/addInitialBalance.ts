
import { v4 as uuidv4 } from "uuid";
import { UepsLot, UepsOperation, UepsState } from "@/hooks/useUepsInventory";
import { toast } from "@/components/ui/use-toast";

export function addInitialBalance(
  prev: UepsState,
  date: Date,
  units: number,
  unitCost: number,
  description: string
): UepsState {
  if (prev.hasInitialBalance) {
    toast({
      title: "Error",
      description: "Ya existe un saldo inicial",
      variant: "destructive",
    });
    return prev;
  }

  if (units <= 0) {
    toast({
      title: "Error",
      description: "Las unidades deben ser mayores a 0",
      variant: "destructive",
    });
    return prev;
  }

  const id = uuidv4();
  const lotId = uuidv4();
  
  const newLot: UepsLot = {
    id: lotId,
    lotName: "Saldo Inicial",
    date,
    units,
    unitCost,
    remainingUnits: units,
    type: "SALDO_INICIAL",
  };

  const totalCost = units * unitCost;

  const newOperation: UepsOperation = {
    id,
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
    title: "Saldo inicial agregado",
    description: `Se ha registrado un saldo inicial de ${units} unidades con valor de $${totalCost.toLocaleString("es-MX")}`,
  });

  return {
    ...prev,
    operations: [...prev.operations, newOperation],
    lots: [...prev.lots, newLot],
    hasInitialBalance: true,
    currentBalance: totalCost,
  };
}
