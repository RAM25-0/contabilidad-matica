
import type { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";

export interface PepsInventoryHookResult {
  state: PepsState;
  handleAddInitialBalance: (
    date: Date,
    units: number,
    unitCost: number,
    description: string
  ) => void;
  handleAddPurchase: (
    date: Date,
    lotName: string,
    units: number,
    unitCost: number,
    description: string
  ) => void;
  handleAddSale: (
    date: Date, 
    units: number, 
    description: string
  ) => void;
  handleAddReturn: (
    date: Date,
    lotId: string,
    units: number,
    description: string
  ) => void;
  getAvailableLots: () => PepsLot[];
  handleEditOperation: (
    operationId: string,
    values: Partial<Omit<PepsOperation, "id" | "balance">>
  ) => void;
  handleDeleteOperation: (operationId: string) => void;
}
