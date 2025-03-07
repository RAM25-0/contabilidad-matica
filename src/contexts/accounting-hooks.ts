
import { Account, AccountType, Transaction } from "@/types/accounting";
import { getTypeLabel, getNatureLabel, getTypeIcon } from "@/utils/accounting-utils";

export interface AccountingContextMethods {
  addAccount: (account: Omit<Account, "id" | "balance">) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  setActiveAccount: (account: Account | null) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "isBalanced">) => void;
  deleteTransaction: (id: string) => void;
  deleteAllTransactions: () => void;
  filterAccounts: (type: AccountType | "todos") => void;
  getNatureLabel: (nature: string) => string;
  getTypeLabel: (type: string) => string;
  getTypeIcon: (type: string) => React.ReactNode;
  getTotalsByType: () => { activos: number; pasivos: number; capital: number; equation: boolean };
}

export function getAccountingMethods(
  dispatch: React.Dispatch<any>,
  state: any
): AccountingContextMethods {
  
  const addAccount = (account: Omit<Account, "id" | "balance">) => {
    dispatch({ type: "ADD_ACCOUNT", payload: account });
  };

  const updateAccount = (account: Account) => {
    dispatch({ type: "UPDATE_ACCOUNT", payload: account });
  };

  const deleteAccount = (id: string) => {
    dispatch({ type: "DELETE_ACCOUNT", payload: id });
  };

  const setActiveAccount = (account: Account | null) => {
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "isBalanced">) => {
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  const deleteAllTransactions = () => {
    dispatch({ type: "DELETE_ALL_TRANSACTIONS" });
  };

  const filterAccounts = (type: AccountType | "todos") => {
    dispatch({ type: "FILTER_ACCOUNTS", payload: type });
  };

  const getTotalsByType = () => {
    const activos = state.accounts
      .filter((a: Account) => a.type === "activo")
      .reduce((sum: number, account: Account) => sum + account.balance, 0);
      
    const pasivos = state.accounts
      .filter((a: Account) => a.type === "pasivo")
      .reduce((sum: number, account: Account) => sum + account.balance, 0);
      
    const capitalCuentas = state.accounts
      .filter((a: Account) => a.type === "capital")
      .reduce((sum: number, account: Account) => sum + account.balance, 0);
      
    const ingresos = state.accounts
      .filter((a: Account) => a.type === "ingreso")
      .reduce((sum: number, account: Account) => sum + account.balance, 0);
      
    const gastos = state.accounts
      .filter((a: Account) => a.type === "gasto")
      .reduce((sum: number, account: Account) => sum + account.balance, 0);
      
    const capital = capitalCuentas + ingresos - gastos;
    
    // Para verificar si se cumple la ecuación contable (Activo = Pasivo + Capital)
    const equation = Math.abs((pasivos + capital) - activos) < 0.001;
    
    return {
      activos,
      pasivos,
      capital,
      equation
    };
  };

  return {
    addAccount,
    updateAccount,
    deleteAccount,
    setActiveAccount,
    addTransaction,
    deleteTransaction,
    deleteAllTransactions,
    filterAccounts,
    getNatureLabel,
    getTypeLabel,
    getTypeIcon,
    getTotalsByType,
  };
}
