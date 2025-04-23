
import { v4 as uuidv4 } from "uuid";
import { UepsLot, UepsOperation, UepsState } from "@/hooks/useUepsInventory";
import { toast } from "@/components/ui/use-toast";

export function addReturn(
  prev: UepsState,
  date: Date,
  lotId: string,
  units: number,
  description: string
): UepsState {
  // Buscar la operación de venta que contiene el lote seleccionado
  const saleOperation = prev.operations.find(
    (op) => op.type === "VENTA" && op.lots.some((lot) => lot.id === lotId)
  );

  if (!saleOperation) {
    toast({
      title: "Error",
      description: "No se encontró la operación de venta asociada",
      variant: "destructive",
    });
    return prev;
  }

  // Buscar el lote vendido dentro de la operación
  const soldLot = saleOperation.lots.find((lot) => lot.id === lotId);
  if (!soldLot) {
    toast({
      title: "Error",
      description: "No se encontró el lote vendido",
      variant: "destructive",
    });
    return prev;
  }

  // Verificar que las unidades a devolver no excedan las vendidas
  if (units > soldLot.units) {
    toast({
      title: "Error",
      description: `No puede devolver más unidades de las vendidas originalmente (${soldLot.units})`,
      variant: "destructive",
    });
    return prev;
  }

  // Buscar el lote original para aumentar sus unidades remanentes
  const lotIndex = prev.lots.findIndex(lot => lot.id === soldLot.id);
  
  if (lotIndex === -1) {
    toast({
      title: "Error",
      description: "No se encontró el lote original",
      variant: "destructive",
    });
    return prev;
  }

  // Crear una copia de los lotes para modificarlos
  const updatedLots = [...prev.lots];
  
  // Actualizar las unidades remanentes del lote original
  updatedLots[lotIndex] = {
    ...updatedLots[lotIndex],
    remainingUnits: updatedLots[lotIndex].remainingUnits + units,
  };

  // Calcular el costo de la devolución
  const totalCost = units * soldLot.unitCost;
  const newBalance = prev.currentBalance + totalCost;

  // Crear el lote de devolución
  const returnLot: UepsLot = {
    ...soldLot,
    units,
    remainingUnits: units,
    type: "DEVOLUCION",
  };

  // Crear la operación de devolución
  const newOperation: UepsOperation = {
    id: uuidv4(),
    date,
    type: "DEVOLUCION",
    description,
    lots: [returnLot],
    inUnits: units,
    outUnits: 0,
    balance: newBalance,
    unitCost: soldLot.unitCost,
    totalCost,
    targetLotId: lotId,
  };

  toast({
    title: "Devolución registrada",
    description: `Se han devuelto ${units} unidades del lote ${returnLot.lotName || 'seleccionado'} con un valor total de $${totalCost.toLocaleString("es-MX")}`,
  });

  return {
    ...prev,
    operations: [...prev.operations, newOperation],
    lots: updatedLots,
    currentBalance: newBalance,
  };
}
