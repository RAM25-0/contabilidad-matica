
export interface PepsLot {
  id: string;
  date: Date;
  lotName: string;
  units: number;
  remainingUnits: number;
  unitCost: number;
  type: 'SALDO_INICIAL' | 'COMPRA' | 'VENTA' | 'DEVOLUCION';
}

export interface PepsOperation {
  id: string;
  date: Date;
  type: 'SALDO_INICIAL' | 'COMPRA' | 'VENTA' | 'DEVOLUCION';
  description: string;
  lots: PepsLot[];
  inUnits: number;
  outUnits: number;
  balance: number;
  unitCost: number;
  totalCost: number;
  targetLotId?: string; // For returns, which lot is being returned to
}

export interface PepsState {
  operations: PepsOperation[];
  lots: PepsLot[];
  hasInitialBalance: boolean;
  currentBalance: number;
}
