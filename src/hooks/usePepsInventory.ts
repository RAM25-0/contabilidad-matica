
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";
import { toast } from "@/components/ui/use-toast";

export function usePepsInventory() {
  const [state, setState] = useState<PepsState>({
    operations: [],
    lots: [],
    hasInitialBalance: false,
    currentBalance: 0,
  });

  // Process initial balance operation
  const handleAddInitialBalance = (date: Date, units: number, unitCost: number, description: string) => {
    if (state.hasInitialBalance) {
      toast({
        title: "Error",
        description: "Ya existe un saldo inicial. Solo puede haber uno.",
        variant: "destructive",
      });
      return;
    }

    if (units <= 0 || unitCost <= 0) {
      toast({
        title: "Error",
        description: "Las unidades y el costo unitario deben ser mayores a cero.",
        variant: "destructive",
      });
      return;
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

    setState((prev) => ({
      ...prev,
      operations: [...prev.operations, newOperation],
      lots: [...prev.lots, newLot],
      hasInitialBalance: true,
      currentBalance: totalCost,
    }));

    toast({
      title: "Saldo Inicial Agregado",
      description: `Se ha registrado el saldo inicial de ${units} unidades con un costo total de $${totalCost.toFixed(2)}`,
    });
  };

  // Process purchase operation
  const handleAddPurchase = (date: Date, lotName: string, units: number, unitCost: number, description: string) => {
    if (!state.hasInitialBalance) {
      toast({
        title: "Error",
        description: "Debe agregar un saldo inicial antes de realizar compras.",
        variant: "destructive",
      });
      return;
    }

    if (units <= 0 || unitCost <= 0) {
      toast({
        title: "Error",
        description: "Las unidades y el costo unitario deben ser mayores a cero.",
        variant: "destructive",
      });
      return;
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
    const newBalance = state.currentBalance + totalCost;
    
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

    setState((prev) => ({
      ...prev,
      operations: [...prev.operations, newOperation],
      lots: [...prev.lots, newLot],
      currentBalance: newBalance,
    }));

    toast({
      title: "Compra Agregada",
      description: `Se ha registrado la compra de ${units} unidades con un costo total de $${totalCost.toFixed(2)}`,
    });
  };

  // Process sale operation
  const handleAddSale = (date: Date, units: number, description: string) => {
    if (!state.hasInitialBalance) {
      toast({
        title: "Error",
        description: "Debe agregar un saldo inicial antes de realizar ventas.",
        variant: "destructive",
      });
      return;
    }

    // Check if there are enough units available
    const totalAvailable = state.lots.reduce((sum, lot) => sum + lot.remainingUnits, 0);
    if (units > totalAvailable) {
      toast({
        title: "Error",
        description: `No hay suficientes unidades disponibles. Disponibles: ${totalAvailable}`,
        variant: "destructive",
      });
      return;
    }

    let unitsToSell = units;
    let totalCost = 0;
    const usedLots: PepsLot[] = [];
    const updatedLots = [...state.lots];

    // Process lots in FIFO order (oldest first)
    for (let i = 0; i < updatedLots.length && unitsToSell > 0; i++) {
      const lot = updatedLots[i];
      if (lot.remainingUnits > 0) {
        const unitsUsed = Math.min(lot.remainingUnits, unitsToSell);
        const lotCost = unitsUsed * lot.unitCost;
        
        // Create a copy of the lot showing units used in this sale
        const lotUsed: PepsLot = {
          ...lot,
          units: unitsUsed, // Units taken from this lot
        };
        usedLots.push(lotUsed);
        
        // Update remaining units in the lot
        updatedLots[i] = {
          ...lot,
          remainingUnits: lot.remainingUnits - unitsUsed,
        };
        
        totalCost += lotCost;
        unitsToSell -= unitsUsed;
      }
    }

    const newBalance = state.currentBalance - totalCost;
    
    const newOperation: PepsOperation = {
      id: uuidv4(),
      date,
      type: "VENTA",
      description,
      lots: usedLots,
      inUnits: 0,
      outUnits: units,
      balance: newBalance,
      unitCost: totalCost / units, // Average cost of units sold
      totalCost,
    };

    setState((prev) => ({
      ...prev,
      operations: [...prev.operations, newOperation],
      lots: updatedLots,
      currentBalance: newBalance,
    }));

    // Generate a detailed description of lots used
    const lotDetails = usedLots.map(lot => 
      `${lot.units} unidades de ${lot.lotName} a $${lot.unitCost.toFixed(2)}`
    ).join(', ');

    toast({
      title: "Venta Registrada",
      description: `Se han vendido ${units} unidades con un costo total de $${totalCost.toFixed(2)}. Desglose: ${lotDetails}`,
    });
  };

  // Process return operation
  const handleAddReturn = (date: Date, lotId: string, units: number, description: string) => {
    // Find the lot being returned to
    const targetLot = state.lots.find(lot => lot.id === lotId);
    if (!targetLot) {
      toast({
        title: "Error",
        description: "El lote seleccionado no existe.",
        variant: "destructive",
      });
      return;
    }

    // Find operations that have sold from this lot to determine max returnable units
    const salesFromLot = state.operations
      .filter(op => op.type === "VENTA")
      .flatMap(op => op.lots.filter(lot => lot.id === lotId))
      .reduce((sum, lot) => sum + lot.units, 0);
    
    // Calculate how many units have already been returned
    const returnsToLot = state.operations
      .filter(op => op.type === "DEVOLUCION" && op.targetLotId === lotId)
      .reduce((sum, op) => sum + op.inUnits, 0);
    
    const maxReturnable = salesFromLot - returnsToLot;
    
    if (units <= 0 || units > maxReturnable) {
      toast({
        title: "Error",
        description: `Solo puede devolver hasta ${maxReturnable} unidades de este lote.`,
        variant: "destructive",
      });
      return;
    }

    // Create a new lot entry for tracking
    const returnLot: PepsLot = {
      ...targetLot,
      id: uuidv4(), // New ID for tracking
      units,
      remainingUnits: units,
    };

    // Update the original lot's remaining units
    const updatedLots = state.lots.map(lot => 
      lot.id === lotId 
        ? { ...lot, remainingUnits: lot.remainingUnits + units } 
        : lot
    );

    const totalCost = units * targetLot.unitCost;
    const newBalance = state.currentBalance + totalCost;
    
    const newOperation: PepsOperation = {
      id: uuidv4(),
      date,
      type: "DEVOLUCION",
      description,
      lots: [returnLot],
      inUnits: units,
      outUnits: 0,
      balance: newBalance,
      unitCost: targetLot.unitCost,
      totalCost,
      targetLotId: lotId,
    };

    setState((prev) => ({
      ...prev,
      operations: [...prev.operations, newOperation],
      lots: updatedLots,
      currentBalance: newBalance,
    }));

    toast({
      title: "Devolución Registrada",
      description: `Se han devuelto ${units} unidades al lote ${targetLot.lotName} con un valor total de $${totalCost.toFixed(2)}`,
    });
  };

  const getAvailableLots = () => {
    return state.lots.filter(lot => lot.type !== "VENTA" && lot.remainingUnits > 0);
  };

  return {
    state,
    handleAddInitialBalance,
    handleAddPurchase,
    handleAddSale,
    handleAddReturn,
    getAvailableLots,
  };
}
