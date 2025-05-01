
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { AccountingState, Account, Transaction } from "@/types/accounting";
import { predefinedAccounts } from "@/data/predefined-accounts";
import { accountingReducer } from "./accounting-reducer";
import { AccountingContextMethods, getAccountingMethods } from "./accounting-hooks";
import { useProfile } from "@/contexts/ProfileContext";

// Define inicialmente un estado con cuentas predefinidas
const defaultState: AccountingState = {
  accounts: predefinedAccounts,
  transactions: [],
  activeAccount: null,
  selectedAccountType: "todos",
};

// Create the context with undefined initial value
type AccountingContextType = AccountingContextMethods & {
  state: AccountingState;
};

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export function AccountingProvider({ children }: { children: ReactNode }) {
  const { currentProfile, saveProfileData, getProfileData } = useProfile();
  const profileId = currentProfile?.id || "default";
  
  // Cargar el estado inicial desde localStorage para el perfil actual
  const initialState = getProfileData<AccountingState>(profileId, "accounting", defaultState) || defaultState;
  
  const [state, dispatch] = useReducer(accountingReducer, initialState);
  
  // Guardar el estado en localStorage cuando cambie
  useEffect(() => {
    if (currentProfile) {
      saveProfileData(profileId, "accounting", state);
    }
  }, [state, profileId, saveProfileData, currentProfile]);

  // Escuchar cambios de perfil para recargar datos
  useEffect(() => {
    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.newProfileId === profileId) {
        // Recargar datos para el nuevo perfil
        const loadedState = getProfileData<AccountingState>(profileId, "accounting", defaultState);
        if (loadedState) {
          // Usar un dispatch para establecer todo el estado
          dispatch({ type: 'SET_FULL_STATE', payload: loadedState });
        }
      }
    };

    window.addEventListener('profile-changed', handleProfileChange);
    return () => {
      window.removeEventListener('profile-changed', handleProfileChange);
    };
  }, [profileId, getProfileData]);
  
  // Get all the methods from accounting-hooks
  const methods = getAccountingMethods(dispatch, state);

  return (
    <AccountingContext.Provider
      value={{
        state,
        ...methods
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
}

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (context === undefined) {
    throw new Error("useAccounting must be used within an AccountingProvider");
  }
  return context;
};
