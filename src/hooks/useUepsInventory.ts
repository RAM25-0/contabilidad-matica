
import { useState } from "react";

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

  // Pronto podrás agregar aquí los métodos de operación (saldo inicial, compra, venta, devolución, etc.)

  return {
    state,
    setState, // expuesto para pruebas/desarrollo
  };
}
