
import { useState, useEffect } from "react";
import { PepsState, PepsOperation } from "@/types/peps-inventory";
import { addInitialBalance } from "./pepsHandlers/addInitialBalance";
import { addPurchase } from "./pepsHandlers/addPurchase";
import { addSale } from "./pepsHandlers/addSale";
import { addReturn } from "./pepsHandlers/addReturn";
import { editOperation } from "./pepsInventory/editOperation";
import { deleteOperation } from "./pepsInventory/deleteOperation";
import { getAvailableLots } from "./pepsInventory/utilFunctions";
import { useProfile } from "@/contexts/ProfileContext";
import { PepsInventoryHookResult } from "./pepsInventory/types";

export function usePepsInventoryWithKey(inventoryKey: string): PepsInventoryHookResult {
  const { currentProfile, saveProfileData, getProfileData } = useProfile();
  const profileId = currentProfile?.id || "default";
  const storageKey = `pepsInventory_${inventoryKey}`;
  
  const [state, setState] = useState<PepsState>(() => {
    return getProfileData<PepsState>(profileId, storageKey, {
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
        const loadedState = getProfileData<PepsState>(profileId, storageKey, {
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
  ) => {
    setState((prev) => addInitialBalance(prev, date, units, unitCost, description));
  };

  const handleAddPurchase = (
    date: Date,
    lotName: string,
    units: number,
    unitCost: number,
    description: string
  ) => {
    setState((prev) => addPurchase(prev, date, lotName, units, unitCost, description));
  };

  const handleAddSale = (date: Date, units: number, description: string) => {
    setState((prev) => addSale(prev, date, units, description));
  };

  const handleAddReturn = (
    date: Date,
    lotId: string,
    units: number,
    description: string
  ) => {
    setState((prev) => addReturn(prev, date, lotId, units, description));
  };

  const handleEditOperation = (
    operationId: string,
    values: Partial<Omit<PepsOperation, "id" | "balance">>
  ) => {
    setState((prev) => editOperation(prev, operationId, values));
  };

  const handleDeleteOperation = (operationId: string) => {
    setState((prev) => deleteOperation(prev, operationId));
  };

  const getAvailableLotsHandler = () => {
    return getAvailableLots(state);
  };

  return {
    state,
    handleAddInitialBalance,
    handleAddPurchase,
    handleAddSale,
    handleAddReturn,
    getAvailableLots: getAvailableLotsHandler,
    handleEditOperation,
    handleDeleteOperation,
  };
}
