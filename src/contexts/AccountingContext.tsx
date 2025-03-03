
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { AccountingState, Account, Transaction } from "@/types/accounting";
import { predefinedAccounts } from "@/data/predefined-accounts";
import { accountingReducer } from "./accounting-reducer";
import { AccountingContextMethods, getAccountingMethods } from "./accounting-hooks";

// Initial state with predefined accounts
const initialState: AccountingState = {
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
  const [state, dispatch] = useReducer(accountingReducer, initialState);
  
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
