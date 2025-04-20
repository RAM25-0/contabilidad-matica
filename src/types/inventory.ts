
export interface InventoryOperation {
  id: string;
  date: Date;
  type: 'SALDO_INICIAL' | 'COMPRA' | 'VENTA' | 'DEVOLUCION';
  description: string;
  units: number;
  unitCost?: number;
  totalCost: number;
  averageCost: number;
  balance: number;
  stockBalance: number;
}

export interface InventoryState {
  operations: InventoryOperation[];
  currentAverageCost: number;
  currentStock: number;
  currentBalance: number;
}
