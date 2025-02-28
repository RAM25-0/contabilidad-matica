
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

const initialState: AccountingState = {
  accounts: [
    // ===== ACTIVO =====
    // 1. CIRCULANTE
    {
      id: "1-1-1",
      name: "Fondo Fijo de Caja",
      code: "1.1.1",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Dinero en efectivo",
    },
    {
      id: "1-1-2",
      name: "Bancos",
      code: "1.1.2",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Dinero en cuentas bancarias",
    },
    {
      id: "1-1-3",
      name: "Inversiones en Valores",
      code: "1.1.3",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Dinero invertido en valores o instrumentos financieros",
    },
    {
      id: "1-1-4",
      name: "Almacén",
      code: "1.1.4",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Bienes almacenados",
    },
    {
      id: "1-1-5",
      name: "Inventario Inicial",
      code: "1.1.5",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Valor del inventario al inicio del periodo",
    },
    {
      id: "1-1-6",
      name: "Estimación para Ajustes de Inventarios",
      code: "1.1.6",
      type: "activo",
      nature: "acreedora",
      balance: 0,
      description: "Estimación de ajustes a realizar en el inventario",
    },
    {
      id: "1-1-7",
      name: "Clientes",
      code: "1.1.7",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Deudas de clientes",
    },
    {
      id: "1-1-8",
      name: "Estimación para Cuentas Incobrables",
      code: "1.1.8",
      type: "activo",
      nature: "acreedora",
      balance: 0,
      description: "Estimación de cuentas que pueden ser incobrables",
    },
    {
      id: "1-1-9",
      name: "Documentos por Cobrar",
      code: "1.1.9",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Documentos que representan deudas por cobrar",
    },
    {
      id: "1-1-10",
      name: "Documentos Descontados",
      code: "1.1.10",
      type: "activo",
      nature: "acreedora",
      balance: 0,
      description: "Documentos por cobrar que han sido descontados",
    },
    {
      id: "1-1-11",
      name: "Intereses por Cobrar",
      code: "1.1.11",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Intereses pendientes de cobro",
    },
    {
      id: "1-1-12",
      name: "IVA por Cobrar",
      code: "1.1.12",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Impuesto al valor agregado a favor",
    },
    {
      id: "1-1-13",
      name: "Funcionarios y Empleados",
      code: "1.1.13",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Deudas de funcionarios y empleados",
    },
    {
      id: "1-1-14",
      name: "Deudores Diversos",
      code: "1.1.14",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Deudores varios",
    },
    {
      id: "1-1-15",
      name: "Anticipo a Proveedores",
      code: "1.1.15",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Anticipos entregados a proveedores",
    },
    {
      id: "1-1-16",
      name: "Depósitos en Garantía",
      code: "1.1.16",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Depósitos entregados como garantía",
    },
    
    // 2. FIJO
    {
      id: "1-2-1",
      name: "Terrenos",
      code: "1.2.1",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Terrenos propiedad de la empresa",
    },
    {
      id: "1-2-2",
      name: "Edificios",
      code: "1.2.2",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Edificios propiedad de la empresa",
    },
    {
      id: "1-2-3",
      name: "Depreciación Acumulada de Edificio",
      code: "1.2.3",
      type: "activo",
      nature: "acreedora",
      balance: 0,
      description: "Depreciación acumulada de edificios",
    },
    {
      id: "1-2-4",
      name: "Maquinaria y Equipo",
      code: "1.2.4",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Maquinaria y equipo de la empresa",
    },
    {
      id: "1-2-5",
      name: "Depreciación Acumulada de Maquinaria y Equipo",
      code: "1.2.5",
      type: "activo",
      nature: "acreedora",
      balance: 0,
      description: "Depreciación acumulada de maquinaria y equipo",
    },
    {
      id: "1-2-6",
      name: "Equipo de Transporte",
      code: "1.2.6",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Equipo de transporte de la empresa",
    },
    {
      id: "1-2-7",
      name: "Depreciación Acumulada de Equipo de Transporte",
      code: "1.2.7",
      type: "activo",
      nature: "acreedora",
      balance: 0,
      description: "Depreciación acumulada de equipo de transporte",
    },
    {
      id: "1-2-8",
      name: "Mobiliario y Equipo",
      code: "1.2.8",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Mobiliario y equipo de la empresa",
    },
    {
      id: "1-2-9",
      name: "Depreciación Acumulada de Mobiliario y Equipo",
      code: "1.2.9",
      type: "activo",
      nature: "acreedora",
      balance: 0,
      description: "Depreciación acumulada de mobiliario y equipo",
    },
    {
      id: "1-2-10",
      name: "Construcciones en Proceso",
      code: "1.2.10",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Construcciones en proceso",
    },
    
    // 3. NO CIRCULANTE
    {
      id: "1-3-1",
      name: "Gastos de Organización",
      code: "1.3.1",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Gastos incurridos en la organización",
    },
    {
      id: "1-3-2",
      name: "Amortización Gastos de Organización",
      code: "1.3.2",
      type: "activo",
      nature: "acreedora",
      balance: 0,
      description: "Amortización de gastos de organización",
    },
    {
      id: "1-3-3",
      name: "Gastos de Instalación",
      code: "1.3.3",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Gastos incurridos en instalaciones",
    },
    {
      id: "1-3-4",
      name: "Amortización Gastos de Instalación",
      code: "1.3.4",
      type: "activo",
      nature: "acreedora",
      balance: 0,
      description: "Amortización de gastos de instalación",
    },
    {
      id: "1-3-5",
      name: "Intereses Pagados por Anticipado",
      code: "1.3.5",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Intereses pagados por anticipado a largo plazo",
    },
    {
      id: "1-3-6",
      name: "Seguros y Fianzas Pagados por Anticipado",
      code: "1.3.6",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Seguros y fianzas pagados por anticipado a largo plazo",
    },
    
    // ===== PASIVO =====
    // 1. CORTO PLAZO
    {
      id: "2-1-1",
      name: "Proveedores",
      code: "2.1.1",
      type: "pasivo",
      nature: "acreedora",
      balance: 0,
      description: "Deudas con proveedores",
    },
    {
      id: "2-1-2",
      name: "Acreedores Diversos",
      code: "2.1.2",
      type: "pasivo",
      nature: "acreedora",
      balance: 0,
      description: "Deudas con acreedores diversos",
    },
    {
      id: "2-1-3",
      name: "Documentos por Pagar",
      code: "2.1.3",
      type: "pasivo",
      nature: "acreedora",
      balance: 0,
      description: "Documentos que representan obligaciones de pago",
    },
    {
      id: "2-1-4",
      name: "Intereses por Pagar",
      code: "2.1.4",
      type: "pasivo",
      nature: "acreedora",
      balance: 0,
      description: "Intereses pendientes de pago",
    },
    {
      id: "2-1-5",
      name: "Impuestos y Derechos por Pagar",
      code: "2.1.5",
      type: "pasivo",
      nature: "acreedora",
      balance: 0,
      description: "Impuestos y derechos pendientes de pago",
    },
    {
      id: "2-1-6",
      name: "IVA por Pagar",
      code: "2.1.6",
      type: "pasivo",
      nature: "acreedora",
      balance: 0,
      description: "Impuesto al valor agregado por pagar",
    },
    {
      id: "2-1-7",
      name: "Anticipo de Clientes",
      code: "2.1.7",
      type: "pasivo",
      nature: "acreedora",
      balance: 0,
      description: "Anticipos recibidos de clientes",
    },
    {
      id: "2-1-8",
      name: "Intereses Cobrados por Anticipado",
      code: "2.1.8",
      type: "pasivo",
      nature: "acreedora",
      balance: 0,
      description: "Intereses cobrados por anticipado",
    },
    
    // 2. LARGO PLAZO
    {
      id: "2-2-1",
      name: "Documentos por Pagar a Largo Plazo",
      code: "2.2.1",
      type: "pasivo",
      nature: "acreedora",
      balance: 0,
      description: "Documentos que representan obligaciones de pago a largo plazo",
    },
    
    // ===== CAPITAL CONTABLE =====
    {
      id: "3-1",
      name: "Capital Social",
      code: "3.1",
      type: "capital",
      nature: "acreedora",
      balance: 0,
      description: "Aportaciones de los socios",
    },
    {
      id: "3-2",
      name: "Reserva Legal",
      code: "3.2",
      type: "capital",
      nature: "acreedora",
      balance: 0,
      description: "Reserva legal de la empresa",
    },
    {
      id: "3-3",
      name: "Resultados de Ejercicios Anteriores",
      code: "3.3",
      type: "capital",
      nature: "acreedora",
      balance: 0,
      description: "Resultados acumulados de ejercicios anteriores",
    },
    {
      id: "3-4",
      name: "Resultado del Ejercicio",
      code: "3.4",
      type: "capital",
      nature: "acreedora",
      balance: 0,
      description: "Resultado del ejercicio actual",
    },
    
    // ===== INGRESOS Y EGRESOS =====
    {
      id: "4-1",
      name: "Ventas",
      code: "4.1",
      type: "ingreso",
      nature: "acreedora",
      balance: 0,
      description: "Ingresos por ventas",
    },
    {
      id: "4-2",
      name: "Devoluciones sobre Ventas",
      code: "4.2",
      type: "ingreso",
      nature: "deudora",
      balance: 0,
      description: "Devoluciones de mercancía vendida",
    },
    {
      id: "4-3",
      name: "Costo de Ventas",
      code: "4.3",
      type: "gasto",
      nature: "deudora",
      balance: 0,
      description: "Costo de la mercancía vendida",
    },
    {
      id: "4-4",
      name: "Gastos de Venta",
      code: "4.4",
      type: "gasto",
      nature: "deudora",
      balance: 0,
      description: "Gastos relacionados con las ventas",
    },
    {
      id: "4-5",
      name: "Gastos de Administración",
      code: "4.5",
      type: "gasto",
      nature: "deudora",
      balance: 0,
      description: "Gastos administrativos",
    },
    {
      id: "4-6",
      name: "Gastos Financieros",
      code: "4.6",
      type: "gasto",
      nature: "deudora",
      balance: 0,
      description: "Gastos relacionados con financiamiento",
    },
    {
      id: "4-7",
      name: "Otros Gastos",
      code: "4.7",
      type: "gasto",
      nature: "deudora",
      balance: 0,
      description: "Otros gastos diversos",
    },
    {
      id: "4-8",
      name: "Productos Financieros",
      code: "4.8",
      type: "ingreso",
      nature: "acreedora",
      balance: 0,
      description: "Ingresos financieros",
    },
    {
      id: "4-9",
      name: "Otros Ingresos",
      code: "4.9",
      type: "ingreso",
      nature: "acreedora",
      balance: 0,
      description: "Otros ingresos diversos",
    },
    
    // ===== COMPRAS =====
    {
      id: "5-1",
      name: "Compras Totales",
      code: "5.1",
      type: "gasto",
      nature: "deudora",
      balance: 0,
      description: "Total de compras realizadas",
    },
    {
      id: "5-2",
      name: "Gastos sobre Compra",
      code: "5.2",
      type: "gasto",
      nature: "deudora",
      balance: 0,
      description: "Gastos relacionados con las compras",
    },
    {
      id: "5-3",
      name: "Devoluciones y Rebajas sobre Compras",
      code: "5.3",
      type: "gasto",
      nature: "acreedora",
      balance: 0,
      description: "Devoluciones y rebajas en compras",
    },
    {
      id: "5-4",
      name: "Compras Netas",
      code: "5.4",
      type: "gasto",
      nature: "deudora",
      balance: 0,
      description: "Compras netas (compras totales menos devoluciones)",
    },
    {
      id: "5-5",
      name: "Inventario Final",
      code: "5.5",
      type: "activo",
      nature: "deudora",
      balance: 0,
      description: "Valor del inventario al final del periodo",
    }
  ],
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
