
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

export function usePepsInventory(): PepsInventoryHookResult {
  const { currentProfile, saveProfileData, getProfileData } = useProfile();
  const profileId = currentProfile?.id || "default";
  
  const [state, setState] = useState<PepsState>(() => {
    return getProfileData<PepsState>(profileId, "pepsInventory", {
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
        const loadedState = getProfileData<PepsState>(profileId, "pepsInventory", {
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
  }, [profileId, getProfileData]);

  useEffect(() => {
    if (currentProfile) {
      saveProfileData(profileId, "pepsInventory", state);
    }
  }, [state, profileId, saveProfileData, currentProfile]);

  const handleAddInitialBalance = (
    date: Date,
    units: number,
    unitCost: number,
    description: string
  ) => {
    setState((prev) => {
      const newState = addInitialBalance(prev, date, units, unitCost, description);
      return newState;
    });
  };

  const handleAddPurchase = (
    date: Date,
    lotName: string,
    units: number,
    unitCost: number,
    description: string
  ) => {
    setState((prev) => {
      const newState = addPurchase(prev, date, lotName, units, unitCost, description);
      return newState;
    });
  };

  const handleAddSale = (date: Date, units: number, description: string) => {
    setState((prev) => {
      const newState = addSale(prev, date, units, description);
      return newState;
    });
  };

  const handleAddReturn = (
    date: Date,
    lotId: string,
    units: number,
    description: string
  ) => {
    setState((prev) => {
      const newState = addReturn(prev, date, lotId, units, description);
      return newState;
    });
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
