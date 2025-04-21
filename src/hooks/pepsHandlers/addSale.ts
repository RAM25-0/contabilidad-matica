
import { v4 as uuidv4 } from "uuid";
import { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";
import { toast } from "@/components/ui/use-toast";

export function addSale(
  prev: PepsState,
  date: Date,
  units: number,
  description: string
): PepsState {
  if (!prev.hasInitialBalance) {
    toast({
      title: "Error",
      description: "Debe agregar un saldo inicial antes de realizar ventas.",
      variant: "destructive",
    });
    return prev;
  }

  const totalAvailable = prev.lots.reduce((sum, lot) => sum + lot.remainingUnits, 0);
  if (units > totalAvailable) {
    toast({
      title: "Error",
      description: `No hay suficientes unidades disponibles. Disponibles: ${totalAvailable}`,
      variant: "destructive",
    });
    return prev;
  }

  let unitsToSell = units;
  let totalCost = 0;
  const usedLots: PepsLot[] = [];
  const updatedLots = [...prev.lots];

  for (let i = 0; i < updatedLots.length && unitsToSell > 0; i++) {
    const lot = updatedLots[i];
    if (lot.remainingUnits > 0) {
      const unitsUsed = Math.min(lot.remainingUnits, unitsToSell);
      const lotCost = unitsUsed * lot.unitCost;

      const lotUsed: PepsLot = {
        ...lot,
        units: unitsUsed,
      };
      usedLots.push(lotUsed);

      updatedLots[i] = {
        ...lot,
        remainingUnits: lot.remainingUnits - unitsUsed,
      };

      totalCost += lotCost;
      unitsToSell -= unitsUsed;
    }
  }

  const newBalance = prev.currentBalance - totalCost;

  const newOperation: PepsOperation = {
    id: uuidv4(),
    date,
    type: "VENTA",
    description,
    lots: usedLots,
    inUnits: 0,
    outUnits: units,
    balance: newBalance,
    unitCost: totalCost / units,
    totalCost,
  };

  const lotDetails = usedLots.map(lot =>
    `${lot.units} unidades de ${lot.lotName} a $${lot.unitCost.toFixed(2)}`
  ).join(', ');

  toast({
    title: "Venta Registrada",
    description: `Se han vendido ${units} unidades con un costo total de $${totalCost.toFixed(2)}. Desglose: ${lotDetails}`,
  });

  return {
    ...prev,
    operations: [...prev.operations, newOperation],
    lots: updatedLots,
    currentBalance: newBalance,
  };
}
