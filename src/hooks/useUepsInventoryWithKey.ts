
import { useState, useEffect } from "react";
import { addInitialBalance } from "./uepsHandlers/addInitialBalance";
import { addPurchase } from "./uepsHandlers/addPurchase";
import { addSale } from "./uepsHandlers/addSale";
import { addPurchaseReturn } from "./uepsHandlers/addPurchaseReturn";
import { editOperation } from "./uepsHandlers/editOperation";
import { deleteOperation } from "./uepsHandlers/deleteOperation";
import { getAvailableLots as getAvailableLotsUtil } from "./uepsHandlers/getAvailableLots";
import { useProfile } from "@/contexts/ProfileContext";
import type { UepsLot, UepsOperation, UepsState } from "@/types/ueps-inventory";

export type { UepsLot, UepsOperation, UepsState };

export function useUepsInventoryWithKey(inventoryKey: string) {
  const { currentProfile, saveProfileData, getProfileData } = useProfile();
  const profileId = currentProfile?.id || "default";
  const storageKey = `uepsInventory_${inventoryKey}`;
  
  const [state, setState] = useState<UepsState>(() => {
    return getProfileData<UepsState>(profileId, storageKey, {
      operations: [],
      lots: [],
      hasInitialBalance: false,
      currentBalance: 0,
    }) || {
      operations: [],
      lots: [],
      hasInitialBalance: false,
      currentBalance: 0,
    };
  });

  useEffect(() => {
    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.newProfileId === profileId) {
        const loadedState = getProfileData<UepsState>(profileId, storageKey, {
          operations: [],
          lots: [],
          hasInitialBalance: false,
          currentBalance: 0,
        });
        
        setState(loadedState || {
          operations: [],
          lots: [],
          hasInitialBalance: false,
          currentBalance: 0,
        });
      }
    };

    window.addEventListener('profile-changed', handleProfileChange);
    return () => {
      window.removeEventListener('profile-changed', handleProfileChange);
    };
  }, [profileId, getProfileData, storageKey]);

  useEffect(() => {
    if (currentProfile) {
      saveProfileData(profileId, storageKey, state);
    }
  }, [state, profileId, saveProfileData, currentProfile, storageKey]);

  const handleAddInitialBalance = (
    date: Date,
    units: number,
    unitCost: number,
    description: string
  ) => setState(prev => addInitialBalance(prev, date, units, unitCost, description));

  const handleAddPurchase = (
    date: Date,
    lotName: string,
    units: number,
    unitCost: number,
    description: string
  ) => setState(prev => addPurchase(prev, date, lotName, units, unitCost, description));

  const handleAddSale = (
    date: Date,
    units: number,
    description: string
  ) => setState(prev => addSale(prev, date, units, description));

  const handleAddReturn = (
    date: Date,
    lotId: string,
    units: number,
    description: string
  ) => setState(prev => addPurchaseReturn(prev, date, lotId, units, description));

  const handleEditOperation = (
    operationId: string,
    values: Partial<Omit<UepsOperation, "id" | "balance">>
  ) => setState(prev => editOperation(prev, operationId, values));

  const handleDeleteOperation = (operationId: string) =>
    setState(prev => deleteOperation(prev, operationId));

  const getAvailableLots = () => getAvailableLotsUtil(state);

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
