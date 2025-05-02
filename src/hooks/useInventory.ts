
import { useState, useEffect } from "react";
import type { InventoryState } from "@/types/inventory";
import { useProfile } from "@/contexts/ProfileContext";
import { addOperation } from "./inventory/addOperation";
import { editOperation } from "./inventory/editOperation";
import { deleteOperation } from "./inventory/deleteOperation";
import { calculateAverage, viewHistory } from "./inventory/utilFunctions";
import type { InventoryHookResult } from "./inventory/types";

export function useInventory(): InventoryHookResult {
  const { currentProfile, saveProfileData, getProfileData } = useProfile();
  const profileId = currentProfile?.id || "default";
  
  const [state, setState] = useState<InventoryState>(() => {
    // Carga los datos del inventario del perfil actual
    return getProfileData<InventoryState>(profileId, "inventory", {
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

  // Escucha eventos de cambio de perfil para recargar datos
  useEffect(() => {
    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.newProfileId === profileId) {
        // Recarga datos para el nuevo perfil
        const loadedState = getProfileData<InventoryState>(profileId, "inventory", {
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
  }, [profileId, getProfileData]);

  // Guarda los cambios de estado en el perfil
  useEffect(() => {
    if (currentProfile) {
      saveProfileData(profileId, "inventory", state);
    }
  }, [state, profileId, saveProfileData, currentProfile]);

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
