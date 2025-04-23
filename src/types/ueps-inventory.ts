
export interface UepsLot {
  id: string;
  date?: Date; // Añadida para registrar fecha específica del lote
  lotName: string;
  units: number;
  remainingUnits: number;
  unitCost: number;
  type: 'SALDO_INICIAL' | 'COMPRA' | 'VENTA' | 'DEVOLUCION';
}

export interface UepsOperation {
  id: string;
  date: Date;
  type: 'SALDO_INICIAL' | 'COMPRA' | 'VENTA' | 'DEVOLUCION';
  description: string;
  lots: UepsLot[];
  inUnits: number;
  outUnits: number;
  balance: number;
  unitCost: number;
  totalCost: number;
  targetLotId?: string; // Para devoluciones, qué lote está siendo devuelto
}

export interface UepsState {
  operations: UepsOperation[];
  lots: UepsLot[];
  hasInitialBalance: boolean;
  currentBalance: number;
}
