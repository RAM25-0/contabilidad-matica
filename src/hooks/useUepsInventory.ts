
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";

export interface UepsLot {
  id: string;
  lotName: string;
  units: number;
  unitCost: number;
  remainingUnits: number;
  type: "SALDO_INICIAL" | "COMPRA" | "VENTA" | "DEVOLUCION";
}

export interface UepsOperation {
  id: string;
  date: Date;
  type: "SALDO_INICIAL" | "COMPRA" | "VENTA" | "DEVOLUCION";
  description: string;
  lots: UepsLot[];
  inUnits: number;
  outUnits: number;
  balance: number;
  unitCost: number;
  totalCost: number;
  targetLotId?: string;
}

export interface UepsState {
  operations: UepsOperation[];
  lots: UepsLot[];
  hasInitialBalance: boolean;
  currentBalance: number;
}

export function useUepsInventory() {
  const [state, setState] = useState<UepsState>({
    operations: [],
    lots: [],
    hasInitialBalance: false,
    currentBalance: 0,
  });

  const handleAddInitialBalance = (
    date: Date,
    units: number,
    unitCost: number,
    description: string
  ) => {
    if (state.hasInitialBalance) {
      toast({
        title: "Error",
        description: "Ya existe un saldo inicial",
        variant: "destructive",
      });
      return;
    }

    const id = uuidv4();
    const lotId = uuidv4();
    
    const newLot: UepsLot = {
      id: lotId,
      lotName: "Saldo Inicial",
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

    setState((prev) => ({
      ...prev,
      operations: [...prev.operations, newOperation],
      lots: [...prev.lots, newLot],
      hasInitialBalance: true,
      currentBalance: totalCost,
    }));
  };

  const handleAddPurchase = (
    date: Date,
    lotName: string,
    units: number,
    unitCost: number,
    description: string
  ) => {
    if (!state.hasInitialBalance) {
      toast({
        title: "Error",
        description: "Debe agregar un saldo inicial primero",
        variant: "destructive",
      });
      return;
    }

    const id = uuidv4();
    const lotId = uuidv4();
    
    const newLot: UepsLot = {
      id: lotId,
      lotName,
      units,
      unitCost,
      remainingUnits: units,
      type: "COMPRA",
    };

    const totalCost = units * unitCost;
    const newBalance = state.currentBalance + totalCost;

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

    setState((prev) => ({
      ...prev,
      operations: [...prev.operations, newOperation],
      lots: [...prev.lots, newLot],
      currentBalance: newBalance,
    }));
  };

  const handleAddSale = (date: Date, units: number, description: string) => {
    if (!state.hasInitialBalance) {
      toast({
        title: "Error",
        description: "Debe agregar un saldo inicial primero",
        variant: "destructive",
      });
      return;
    }

    // Verificar si hay suficientes unidades disponibles
    const totalAvailable = state.lots.reduce(
      (sum, lot) => sum + lot.remainingUnits,
      0
    );

    if (units > totalAvailable) {
      toast({
        title: "Error",
        description: `No hay suficientes unidades disponibles. Disponibles: ${totalAvailable}`,
        variant: "destructive",
      });
      return;
    }

    let remainingToSell = units;
    let totalCost = 0;
    let usedLots: UepsLot[] = [];

    // Crear copias de los lotes para modificarlos
    const updatedLots = [...state.lots];
    
    // En UEPS, se venden primero las unidades de los lotes más recientes (orden inverso)
    // Recorrer los lotes en orden inverso (del más reciente al más antiguo)
    for (let i = updatedLots.length - 1; i >= 0 && remainingToSell > 0; i--) {
      const lot = updatedLots[i];
      
      if (lot.remainingUnits > 0) {
        const unitsToSell = Math.min(lot.remainingUnits, remainingToSell);
        
        // Crear una copia del lote para la venta
        const soldLot: UepsLot = {
          id: lot.id,
          lotName: lot.lotName,
          units: unitsToSell,
          unitCost: lot.unitCost,
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
    const newBalance = state.currentBalance - totalCost;
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

    setState((prev) => ({
      ...prev,
      operations: [...prev.operations, newOperation],
      lots: updatedLots,
      currentBalance: newBalance,
    }));
  };

  const handleAddReturn = (
    date: Date,
    lotId: string,
    units: number,
    description: string
  ) => {
    // Buscar la operación de venta que contiene el lote seleccionado
    const saleOperation = state.operations.find(
      (op) => op.type === "VENTA" && op.lots.some((lot) => lot.id === lotId)
    );

    if (!saleOperation) {
      toast({
        title: "Error",
        description: "No se encontró la operación de venta asociada",
        variant: "destructive",
      });
      return;
    }

    // Buscar el lote vendido dentro de la operación
    const soldLot = saleOperation.lots.find((lot) => lot.id === lotId);
    if (!soldLot) {
      toast({
        title: "Error",
        description: "No se encontró el lote vendido",
        variant: "destructive",
      });
      return;
    }

    // Verificar que las unidades a devolver no excedan las vendidas
    if (units > soldLot.units) {
      toast({
        title: "Error",
        description: `No puede devolver más unidades de las vendidas originalmente (${soldLot.units})`,
        variant: "destructive",
      });
      return;
    }

    // Buscar el lote original para aumentar sus unidades remanentes
    const originalLot = state.lots.find(
      (lot) => lot.id === lotId && (lot.type === "SALDO_INICIAL" || lot.type === "COMPRA")
    );

    if (!originalLot) {
      toast({
        title: "Error",
        description: "No se encontró el lote original",
        variant: "destructive",
      });
      return;
    }

    // Crear una copia de los lotes para modificarlos
    const updatedLots = [...state.lots];
    const lotIndex = updatedLots.findIndex((lot) => lot.id === lotId);
    
    if (lotIndex !== -1) {
      updatedLots[lotIndex] = {
        ...updatedLots[lotIndex],
        remainingUnits: updatedLots[lotIndex].remainingUnits + units,
      };
    }

    // Calcular el costo de la devolución
    const totalCost = units * soldLot.unitCost;
    const newBalance = state.currentBalance + totalCost;

    // Crear el lote de devolución
    const returnLot: UepsLot = {
      id: soldLot.id,
      lotName: soldLot.lotName,
      units,
      unitCost: soldLot.unitCost,
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

    setState((prev) => ({
      ...prev,
      operations: [...prev.operations, newOperation],
      lots: updatedLots,
      currentBalance: newBalance,
    }));
  };

  const handleEditOperation = (
    operationId: string,
    values: Partial<Omit<UepsOperation, "id" | "balance">>
  ) => {
    setState((prev) => {
      const opIndex = prev.operations.findIndex((op) => op.id === operationId);
      if (opIndex === -1) return prev;

      const updatedOperations = [...prev.operations];
      const oldOp = updatedOperations[opIndex];
      const updatedOp = {
        ...oldOp,
        ...values,
      };
      updatedOperations[opIndex] = updatedOp;

      toast({
        title: "Operación actualizada",
        description: "Los datos de la operación han sido actualizados.",
      });

      return {
        ...prev,
        operations: updatedOperations,
      };
    });
  };

  const handleDeleteOperation = (operationId: string) => {
    setState((prev) => {
      const opToDelete = prev.operations.find((op) => op.id === operationId);
      if (!opToDelete) return prev;

      if (opToDelete.type === "SALDO_INICIAL") {
        toast({
          title: "No permitido",
          description: "No se puede eliminar el Saldo Inicial.",
          variant: "destructive",
        });
        return prev;
      }

      const updatedOperations = prev.operations.filter(
        (op) => op.id !== operationId
      );

      toast({
        title: "Operación borrada",
        description: "La operación ha sido borrada.",
      });

      return {
        ...prev,
        operations: updatedOperations,
      };
    });
  };

  const getAvailableLots = () => {
    // Para las devoluciones, necesitamos los lotes que han sido vendidos
    return state.operations
      .filter(op => op.type === "VENTA")
      .flatMap(op => op.lots)
      .filter(lot => lot.units > 0);
  };

  return {
    state,
    handleAddInitialBalance,
    handleAddPurchase,
    handleAddSale,
    handleAddReturn,
    getAvailableLots,
    handleEditOperation,
    handleDeleteOperation,
  };
}
