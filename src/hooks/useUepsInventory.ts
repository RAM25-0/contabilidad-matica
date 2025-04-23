
import { useState } from "react";
import { addInitialBalance } from "./uepsHandlers/addInitialBalance";
import { addPurchase } from "./uepsHandlers/addPurchase";
import { addSale } from "./uepsHandlers/addSale";
import { addReturn } from "./uepsHandlers/addReturn";
import { editOperation } from "./uepsHandlers/editOperation";
import { deleteOperation } from "./uepsHandlers/deleteOperation";
import { getAvailableLots as getAvailableLotsUtil } from "./uepsHandlers/getAvailableLots";
import { UepsLot, UepsOperation, UepsState } from "@/types/ueps-inventory";

export type { UepsLot, UepsOperation, UepsState };

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
    setState(prev => addInitialBalance(prev, date, units, unitCost, description));
  };

  const handleAddPurchase = (
    date: Date,
    lotName: string,
    units: number,
    unitCost: number,
    description: string
  ) => {
    setState(prev => addPurchase(prev, date, lotName, units, unitCost, description));
  };

  const handleAddSale = (date: Date, units: number, description: string) => {
    setState(prev => addSale(prev, date, units, description));
  };

  const handleAddReturn = (
    date: Date,
    lotId: string,
    units: number,
    description: string
  ) => {
    setState(prev => addReturn(prev, date, lotId, units, description));
  };

  const handleEditOperation = (
    operationId: string,
    values: Partial<Omit<UepsOperation, "id" | "balance">>
  ) => {
    setState(prev => editOperation(prev, operationId, values));
  };

  const handleDeleteOperation = (operationId: string) => {
    setState(prev => deleteOperation(prev, operationId));
  };

  const getAvailableLots = () => {
    return getAvailableLotsUtil(state);
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
