
import { useState, useEffect } from "react";
import type { InventoryState } from "@/types/inventory";
import { useProfile } from "@/contexts/ProfileContext";
import { addOperation } from "./inventory/addOperation";
import { editOperation } from "./inventory/editOperation";
import { deleteOperation } from "./inventory/deleteOperation";
import { calculateAverage, viewHistory } from "./inventory/utilFunctions";
import type { InventoryHookResult } from "./inventory/types";

export function useInventoryWithKey(inventoryKey: string): InventoryHookResult {
  const { currentProfile, saveProfileData, getProfileData } = useProfile();
  const profileId = currentProfile?.id || "default";
  const storageKey = `inventory_${inventoryKey}`;
  
  const [state, setState] = useState<InventoryState>(() => {
    return getProfileData<InventoryState>(profileId, storageKey, {
      operations: [],
      currentAverageCost: 0,
      currentStock: 0,
      currentBalance: 0,
    }) || {
      operations: [],
      currentAverageCost: 0,
      currentStock: 0,
      currentBalance: 0,
    };
  });

  useEffect(() => {
    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.newProfileId === profileId) {
        const loadedState = getProfileData<InventoryState>(profileId, storageKey, {
          operations: [],
          currentAverageCost: 0,
          currentStock: 0,
          currentBalance: 0,
        });
        
        setState(loadedState || {
          operations: [],
          currentAverageCost: 0,
          currentStock: 0,
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

  const handleAddOperation = (newOperation) => {
    setState((prevState) => addOperation(prevState, newOperation));
  };

  const handleEditOperation = (id, newOperation) => {
    setState((prevState) => editOperation(prevState, id, newOperation));
  };

  const handleDeleteOperation = (id) => {
    setState((prevState) => deleteOperation(prevState, id));
  };

  const handleCalculateAverage = () => {
    calculateAverage(state.currentAverageCost, state.operations.length > 0);
  };

  const handleViewHistory = () => {
    viewHistory();
  };

  return {
    state,
    handleAddOperation,
    handleEditOperation,
    handleDeleteOperation,
    handleCalculateAverage,
    handleViewHistory,
  };
}
