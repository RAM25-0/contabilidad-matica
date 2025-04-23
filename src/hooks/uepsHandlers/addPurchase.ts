
import { v4 as uuidv4 } from "uuid";
import { UepsLot, UepsOperation, UepsState } from "@/hooks/useUepsInventory";
import { toast } from "@/components/ui/use-toast";

export function addPurchase(
  prev: UepsState,
  date: Date,
  lotName: string,
  units: number,
  unitCost: number,
  description: string
): UepsState {
  if (!prev.hasInitialBalance) {
    toast({
      title: "Error",
      description: "Debe agregar un saldo inicial primero",
      variant: "destructive",
    });
    return prev;
  }

  if (units <= 0 || unitCost <= 0) {
    toast({
      title: "Error",
      description: "Las unidades y el costo unitario deben ser mayores a cero",
      variant: "destructive",
    });
    return prev;
  }

  const id = uuidv4();
  const lotId = uuidv4();
  
  const newLot: UepsLot = {
    id: lotId,
    lotName,
    date,
    units,
    unitCost,
    remainingUnits: units,
    type: "COMPRA",
  };

  const totalCost = units * unitCost;
  const newBalance = prev.currentBalance + totalCost;

  const newOperation: UepsOperation = {
    id,
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
    title: "Compra agregada",
    description: `Se ha registrado la compra de ${units} unidades con un costo total de $${totalCost.toLocaleString("es-MX")}`,
  });

  return {
    ...prev,
    operations: [...prev.operations, newOperation],
    // Insertamos el nuevo lote al principio para mantener el orden de más reciente a más antiguo (LIFO)
    lots: [newLot, ...prev.lots],
    currentBalance: newBalance,
  };
}
