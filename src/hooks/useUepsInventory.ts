
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

export function useUepsInventory() {
  const { currentProfile, saveProfileData, getProfileData } = useProfile();
  const profileId = currentProfile?.id || "default";
  
  const [state, setState] = useState<UepsState>(() => {
    // Carga los datos del inventario UEPS del perfil actual
    return getProfileData<UepsState>(profileId, "uepsInventory", {
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

  // Escucha eventos de cambio de perfil para recargar datos
  useEffect(() => {
    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.newProfileId === profileId) {
        // Recarga datos para el nuevo perfil
        const loadedState = getProfileData<UepsState>(profileId, "uepsInventory", {
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

  // Guarda los cambios de estado en el perfil
  useEffect(() => {
    if (currentProfile) {
      saveProfileData(profileId, "uepsInventory", state);
    }
  }, [state, profileId, saveProfileData, currentProfile]);

  // Registro de saldo inicial
  const handleAddInitialBalance = (
    date: Date,
    units: number,
    unitCost: number,
    description: string
  ) => setState(prev => addInitialBalance(prev, date, units, unitCost, description));

  // Registro de compra (nuevo lote UEPS)
  const handleAddPurchase = (
    date: Date,
    lotName: string,
    units: number,
    unitCost: number,
    description: string
  ) => setState(prev => addPurchase(prev, date, lotName, units, unitCost, description));

  // Registro de venta (descarga desde el lote más reciente, LIFO)
  const handleAddSale = (
    date: Date,
    units: number,
    description: string
  ) => setState(prev => addSale(prev, date, units, description));

  // Registro de devolución de compra
  const handleAddReturn = (
    date: Date,
    lotId: string,
    units: number,
    description: string
  ) => setState(prev => addPurchaseReturn(prev, date, lotId, units, description));

  // Edición de operación (solo metadatos)
  const handleEditOperation = (
    operationId: string,
    values: Partial<Omit<UepsOperation, "id" | "balance">>
  ) => setState(prev => editOperation(prev, operationId, values));

  // Eliminación de operación
  const handleDeleteOperation = (operationId: string) =>
    setState(prev => deleteOperation(prev, operationId));

  // Lot(es) disponibles para devolución (lotes de compra/saldo inicial)
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
