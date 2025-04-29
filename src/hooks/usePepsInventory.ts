import { useState, useEffect } from "react";
import { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";
import { addInitialBalance } from "./pepsHandlers/addInitialBalance";
import { addPurchase } from "./pepsHandlers/addPurchase";
import { addSale } from "./pepsHandlers/addSale";
import { addReturn } from "./pepsHandlers/addReturn";
import { toast } from "@/components/ui/use-toast";
import { useProfile } from "@/contexts/ProfileContext";

export function usePepsInventory() {
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
    setState((prev) => {
      const opIndex = prev.operations.findIndex((op) => op.id === operationId);
      if (opIndex === -1) return prev;

      const updatedOperations = [...prev.operations];
      const oldOp = updatedOperations[opIndex];
      const updatedOp = {
        ...oldOp,
        ...values,
      };
      updatedOperations[opIndex] = updatedOp;

      toast({
        title: "Operación actualizada",
        description: "Los datos de la operación han sido actualizados.",
      });

      return {
        ...prev,
        operations: updatedOperations,
      };
    });
  };

  const handleDeleteOperation = (operationId: string) => {
    setState((prev) => {
      const opToDelete = prev.operations.find((op) => op.id === operationId);
      if (!opToDelete) return prev;

      if (opToDelete.type === "SALDO_INICIAL") {
        toast({
          title: "No permitido",
          description: "No se puede eliminar el Saldo Inicial.",
          variant: "destructive",
        });
        return prev;
      }

      const updatedOperations = prev.operations.filter(
        (op) => op.id !== operationId
      );

      toast({
        title: "Operación borrada",
        description: "La operación ha sido borrada.",
      });

      return {
        ...prev,
        operations: updatedOperations,
      };
    });
  };

  const getAvailableLots = () => {
    return state.lots.filter(
      (lot) => lot.type !== "VENTA" && lot.remainingUnits > 0
    );
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
