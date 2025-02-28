
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { 
  AccountingState, 
  Account, 
  Transaction, 
  TransactionEntry, 
  AccountType 
} from "@/types/accounting";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";

type AccountingAction =
  | { type: "ADD_ACCOUNT"; payload: Omit<Account, "id" | "balance"> }
  | { type: "UPDATE_ACCOUNT"; payload: Account }
  | { type: "DELETE_ACCOUNT"; payload: string }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: Account | null }
  | { type: "ADD_TRANSACTION"; payload: Omit<Transaction, "id" | "isBalanced"> }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "FILTER_ACCOUNTS"; payload: AccountType | "todos" };

// Creamos un catálogo completo de cuentas predefinidas de activos pero con saldo cero
const predefinedAccounts: Account[] = [
  // ----- ACTIVOS CIRCULANTES -----
  {
    id: uuidv4(),
    name: "Fondo Fijo de Caja",
    code: "1-01",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Bancos",
    code: "1-02",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Inversiones en Valores",
    code: "1-03",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Almacén",
    code: "1-04",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Inventario Inicial",
    code: "1-05",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Estimación para Ajustes de Inventarios",
    code: "1-06",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Clientes",
    code: "1-07",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Estimación para Cuentas Incobrables",
    code: "1-08",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Documentos por Cobrar",
    code: "1-09",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Documentos Descontados",
    code: "1-10",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Intereses por Cobrar",
    code: "1-11",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "IVA por Cobrar",
    code: "1-12",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Funcionarios y Empleados",
    code: "1-13",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Deudores Diversos",
    code: "1-14",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Anticipo a Proveedores",
    code: "1-15",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Depósitos en Garantía",
    code: "1-16",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "circulante"
  },
  
  // ----- ACTIVOS FIJOS -----
  {
    id: uuidv4(),
    name: "Terrenos",
    code: "1-17",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Edificios",
    code: "1-18",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depreciación Acumulada de Edificio",
    code: "1-19",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0, // Saldo inicial cero
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Maquinaria y Equipo",
    code: "1-20",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depreciación Acumulada de Maquinaria y Equipo",
    code: "1-21",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0, // Saldo inicial cero
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Equipo de Transporte",
    code: "1-22",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depreciación Acumulada de Equipo de Transporte",
    code: "1-23",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0, // Saldo inicial cero
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Mobiliario y Equipo",
    code: "1-24",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depreciación Acumulada de Mobiliario y Equipo",
    code: "1-25",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0, // Saldo inicial cero
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Construcciones en Proceso",
    code: "1-26",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "fijo"
  },
  
  // ----- ACTIVOS NO CIRCULANTES (antes diferido) -----
  {
    id: uuidv4(),
    name: "Gastos de Organización",
    code: "1-27",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "diferido"
  },
  {
    id: uuidv4(),
    name: "Amortización Gastos de Organización",
    code: "1-28",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0, // Saldo inicial cero
    subcategory: "diferido"
  },
  {
    id: uuidv4(),
    name: "Gastos de Instalación",
    code: "1-29",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "diferido"
  },
  {
    id: uuidv4(),
    name: "Amortización Gastos de Instalación",
    code: "1-30",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0, // Saldo inicial cero
    subcategory: "diferido"
  },
  {
    id: uuidv4(),
    name: "Intereses Pagados por Anticipado",
    code: "1-31",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "diferido"
  },
  {
    id: uuidv4(),
    name: "Seguros y Fianzas Pagados por Anticipado",
    code: "1-32",
    type: "activo",
    nature: "deudora",
    balance: 0, // Saldo inicial cero
    subcategory: "diferido"
  }
];

const initialState: AccountingState = {
  accounts: predefinedAccounts, // Ahora comenzamos con cuentas predefinidas
  transactions: [],
  activeAccount: null,
  selectedAccountType: "todos",
};

const reducer = (state: AccountingState, action: AccountingAction): AccountingState => {
  switch (action.type) {
    case "ADD_ACCOUNT": {
      const newAccount = {
        ...action.payload,
        id: uuidv4(),
        balance: 0,
      };
      return {
        ...state,
        accounts: [...state.accounts, newAccount],
      };
    }
    case "UPDATE_ACCOUNT": {
      return {
        ...state,
        accounts: state.accounts.map((account) =>
          account.id === action.payload.id ? action.payload : account
        ),
        activeAccount: 
          state.activeAccount?.id === action.payload.id 
            ? action.payload 
            : state.activeAccount,
      };
    }
    case "DELETE_ACCOUNT": {
      // Check if account is used in any transaction
      const isUsed = state.transactions.some(t => 
        t.entries.some(e => e.accountId === action.payload)
      );
      
      if (isUsed) {
        toast({
          title: "Error",
          description: "No se puede eliminar la cuenta porque está siendo utilizada en transacciones",
          variant: "destructive",
        });
        return state;
      }
      
      return {
        ...state,
        accounts: state.accounts.filter((account) => account.id !== action.payload),
        activeAccount: 
          state.activeAccount?.id === action.payload 
            ? null 
            : state.activeAccount,
      };
    }
    case "SET_ACTIVE_ACCOUNT": {
      return {
        ...state,
        activeAccount: action.payload,
      };
    }
    case "ADD_TRANSACTION": {
      const entries = action.payload.entries.map(entry => ({
        ...entry,
        id: uuidv4()
      }));
      
      // Calculate if transaction is balanced
      const totalDebits = entries.reduce((sum, entry) => sum + entry.debit, 0);
      const totalCredits = entries.reduce((sum, entry) => sum + entry.credit, 0);
      const isBalanced = Math.abs(totalDebits - totalCredits) < 0.001; // Accounting for floating point errors
      
      if (!isBalanced) {
        toast({
          title: "Error",
          description: "La transacción no está balanceada. Los débitos deben ser iguales a los créditos.",
          variant: "destructive",
        });
        return state;
      }
      
      const newTransaction: Transaction = {
        ...action.payload,
        id: uuidv4(),
        entries,
        isBalanced,
      };
      
      // Update account balances
      const updatedAccounts = state.accounts.map(account => {
        const relatedEntries = entries.filter(entry => entry.accountId === account.id);
        if (relatedEntries.length === 0) return account;
        
        let balanceChange = 0;
        
        // Apply debits and credits according to account nature
        for (const entry of relatedEntries) {
          if (account.nature === "deudora") {
            balanceChange += entry.debit - entry.credit;
          } else {
            balanceChange += entry.credit - entry.debit;
          }
        }
        
        return {
          ...account,
          balance: account.balance + balanceChange
        };
      });
      
      return {
        ...state,
        accounts: updatedAccounts,
        transactions: [...state.transactions, newTransaction],
      };
    }
    case "DELETE_TRANSACTION": {
      const transactionToDelete = state.transactions.find(
        t => t.id === action.payload
      );
      
      if (!transactionToDelete) return state;
      
      // Revert account balances
      const updatedAccounts = state.accounts.map(account => {
        const relatedEntries = transactionToDelete.entries.filter(
          entry => entry.accountId === account.id
        );
        if (relatedEntries.length === 0) return account;
        
        let balanceChange = 0;
        
        // Apply debits and credits according to account nature (reversed)
        for (const entry of relatedEntries) {
          if (account.nature === "deudora") {
            balanceChange -= entry.debit - entry.credit;
          } else {
            balanceChange -= entry.credit - entry.debit;
          }
        }
        
        return {
          ...account,
          balance: account.balance + balanceChange
        };
      });
      
      return {
        ...state,
        accounts: updatedAccounts,
        transactions: state.transactions.filter(
          transaction => transaction.id !== action.payload
        ),
      };
    }
    case "FILTER_ACCOUNTS": {
      return {
        ...state,
        selectedAccountType: action.payload,
      };
    }
    default:
      return state;
  }
};

type AccountingContextType = {
  state: AccountingState;
  addAccount: (account: Omit<Account, "id" | "balance">) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  setActiveAccount: (account: Account | null) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "isBalanced">) => void;
  deleteTransaction: (id: string) => void;
  filterAccounts: (type: AccountType | "todos") => void;
  getNatureLabel: (nature: string) => string;
  getTypeLabel: (type: string) => string;
  getTypeIcon: (type: string) => React.ReactNode;
  getTotalsByType: () => { activos: number; pasivos: number; capital: number; equation: boolean };
};

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export function AccountingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  const filterAccounts = (type: AccountType | "todos") => {
    dispatch({ type: "FILTER_ACCOUNTS", payload: type });
  };

  const getNatureLabel = (nature: string) => {
    return nature === "deudora" 
      ? "Deudora (Debe ↑, Haber ↓)" 
      : "Acreedora (Debe ↓, Haber ↑)";
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "activo": return "Activo";
      case "pasivo": return "Pasivo";
      case "capital": return "Capital";
      case "ingreso": return "Ingreso";
      case "gasto": return "Gasto";
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    // Los íconos se implementarán en los componentes
    return null;
  };

  const getTotalsByType = () => {
    const activos = state.accounts
      .filter(a => a.type === "activo")
      .reduce((sum, account) => sum + account.balance, 0);
      
    const pasivos = state.accounts
      .filter(a => a.type === "pasivo")
      .reduce((sum, account) => sum + account.balance, 0);
      
    const capitalCuentas = state.accounts
      .filter(a => a.type === "capital")
      .reduce((sum, account) => sum + account.balance, 0);
      
    const ingresos = state.accounts
      .filter(a => a.type === "ingreso")
      .reduce((sum, account) => sum + account.balance, 0);
      
    const gastos = state.accounts
      .filter(a => a.type === "gasto")
      .reduce((sum, account) => sum + account.balance, 0);
      
    // El capital total incluye el capital contable más (ingresos - gastos)
    const capital = capitalCuentas + (ingresos - gastos);
    
    // Verificar la ecuación contable A = P + C
    const equation = Math.abs(activos - (pasivos + capital)) < 0.001;
    
    return { activos, pasivos, capital, equation };
  };

  return (
    <AccountingContext.Provider
      value={{
        state,
        addAccount,
        updateAccount,
        deleteAccount,
        setActiveAccount,
        addTransaction,
        deleteTransaction,
        filterAccounts,
        getNatureLabel,
        getTypeLabel,
        getTypeIcon,
        getTotalsByType,
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
}

export function useAccounting() {
  const context = useContext(AccountingContext);
  if (context === undefined) {
    throw new Error("useAccounting must be used within an AccountingProvider");
  }
  return context;
}
