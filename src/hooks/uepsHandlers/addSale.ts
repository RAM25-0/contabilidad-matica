
import { v4 as uuidv4 } from "uuid";
import { UepsLot, UepsOperation, UepsState } from "@/hooks/useUepsInventory";
import { toast } from "@/components/ui/use-toast";

export function addSale(
  prev: UepsState,
  date: Date,
  units: number,
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

  // Verificar si hay suficientes unidades disponibles
  const totalAvailable = prev.lots.reduce(
    (sum, lot) => sum + lot.remainingUnits,
    0
  );

  if (units > totalAvailable) {
    toast({
      title: "Error",
      description: `No hay suficientes unidades disponibles. Disponibles: ${totalAvailable}`,
      variant: "destructive",
    });
    return prev;
  }

  let remainingToSell = units;
  let totalCost = 0;
  let usedLots: UepsLot[] = [];

  // Crear copias de los lotes para modificarlos
  const updatedLots = [...prev.lots];
  
  // En UEPS, se venden primero las unidades de los lotes más recientes (los primeros en la lista)
  // Esto es diferente de PEPS donde se venden los más antiguos primero
  for (let i = 0; i < updatedLots.length && remainingToSell > 0; i++) {
    const lot = updatedLots[i];
    
    if (lot.remainingUnits > 0) {
      const unitsToSell = Math.min(lot.remainingUnits, remainingToSell);
      
      // Crear una copia del lote para la venta
      const soldLot: UepsLot = {
        ...lot,
        units: unitsToSell,
        remainingUnits: 0, // No quedan unidades después de la venta
        type: "VENTA",
      };
      
      // Actualizar el lote original
      lot.remainingUnits -= unitsToSell;
      
      // Acumular el costo y añadir a los lotes usados
      totalCost += unitsToSell * lot.unitCost;
      usedLots.push(soldLot);
      
      // Reducir las unidades restantes por vender
      remainingToSell -= unitsToSell;
    }
  }

  const id = uuidv4();
  const newBalance = prev.currentBalance - totalCost;
  const avgUnitCost = totalCost / units;

  const newOperation: UepsOperation = {
    id,
    date,
    type: "VENTA",
    description,
    lots: usedLots,
    inUnits: 0,
    outUnits: units,
    balance: newBalance,
    unitCost: avgUnitCost,
    totalCost,
  };

  const lotDetails = usedLots.map(lot => 
    `${lot.units} unidades de ${lot.lotName} a $${lot.unitCost.toLocaleString("es-MX")}`
  ).join(", ");

  toast({
    title: "Venta registrada",
    description: `Se han vendido ${units} unidades con un costo total de $${totalCost.toLocaleString("es-MX")}. Desglose: ${lotDetails}`,
  });

  return {
    ...prev,
    operations: [...prev.operations, newOperation],
    lots: updatedLots,
    currentBalance: newBalance,
  };
}
