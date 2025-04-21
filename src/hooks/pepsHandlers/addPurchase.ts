
import { v4 as uuidv4 } from "uuid";
import { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";
import { toast } from "@/components/ui/use-toast";

export function addPurchase(
  prev: PepsState,
  date: Date,
  lotName: string,
  units: number,
  unitCost: number,
  description: string
): PepsState {
  if (!prev.hasInitialBalance) {
    toast({
      title: "Error",
      description: "Debe agregar un saldo inicial antes de realizar compras.",
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
    lotName,
    units,
    remainingUnits: units,
    unitCost,
    type: "COMPRA",
  };

  const totalCost = units * unitCost;
  const newBalance = prev.currentBalance + totalCost;

  const newOperation: PepsOperation = {
    id: uuidv4(),
    date,
    type: "COMPRA",
    description,
    lots: [newLot],
    inUnits: units,
    outUnits: 0,
    balance: newBalance,
    unitCost,
    totalCost,
  };

  toast({
    title: "Compra Agregada",
    description: `Se ha registrado la compra de ${units} unidades con un costo total de $${totalCost.toFixed(2)}`,
  });

  return {
    ...prev,
    operations: [...prev.operations, newOperation],
    lots: [...prev.lots, newLot],
    currentBalance: newBalance,
  };
}
