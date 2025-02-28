
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

// Creamos un catálogo completo de cuentas predefinidas basado en la imagen proporcionada
const predefinedAccounts: Account[] = [
  // ----- ACTIVOS CIRCULANTES (CURRENT) -----
  {
    id: uuidv4(),
    name: "Efectivo y equivalente de efectivo",
    code: "1-01",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Efectivo",
    code: "1-02",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Bancos",
    code: "1-03",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Inversiones temporales",
    code: "1-04",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Cuentas y documentos por cobrar",
    code: "1-05",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Clientes neto",
    code: "1-06",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Clientes",
    code: "1-07",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Documentos por cobrar",
    code: "1-08",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "IVA acreditable PAGADO",
    code: "1-09",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Funcionarios y Empleados",
    code: "1-10",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Anticipos a Proveedores",
    code: "1-11",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "IVA Acreditable NO PAGADO",
    code: "1-12",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Deudores Diversos",
    code: "1-13",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Inventarios",
    code: "1-14",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Almacén",
    code: "1-15",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Pagos anticipados",
    code: "1-16",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Rentas pagadas por anticipado",
    code: "1-17",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Publicidad pagada por anticipado",
    code: "1-18",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  {
    id: uuidv4(),
    name: "Seguros pagados por anticipado",
    code: "1-19",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "circulante"
  },
  
  // ----- ACTIVOS NO CIRCULANTES (NON CURRENT) -----
  {
    id: uuidv4(),
    name: "Propiedades, planta y equipo neto",
    code: "1-20",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Construcciones en proceso",
    code: "1-21",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Terreno",
    code: "1-22",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Edificio",
    code: "1-23",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depreciación acumulada de edificio",
    code: "1-24",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Mobiliario y equipo",
    code: "1-25",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depreciación acumulada de mobiliario",
    code: "1-26",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Equipo de transporte automóviles",
    code: "1-27",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depreciación acumulada de automóviles",
    code: "1-28",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Maquinaria y equipo",
    code: "1-29",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depreciación acumulada de maquinaria",
    code: "1-30",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Equipo de cómputo y equipo electrónico",
    code: "1-31",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depreciación acumulada de equipo electrónico",
    code: "1-32",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Equipo de reparto",
    code: "1-33",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depreciación acumulada de reparto",
    code: "1-34",
    type: "activo",
    nature: "acreedora",  // Cuenta correctora, naturaleza contraria
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Otros Activos",
    code: "1-35",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  {
    id: uuidv4(),
    name: "Depósitos en Garantía",
    code: "1-36",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "fijo"
  },
  
  // ----- ACTIVOS INTANGIBLES -----
  {
    id: uuidv4(),
    name: "Activos intangibles",
    code: "1-37",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "diferido"
  },
  {
    id: uuidv4(),
    name: "Patentes",
    code: "1-38",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "diferido"
  },
  {
    id: uuidv4(),
    name: "Marcas registradas",
    code: "1-39",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "diferido"
  },
  {
    id: uuidv4(),
    name: "Derechos de autor",
    code: "1-40",
    type: "activo",
    nature: "deudora",
    balance: 0,
    subcategory: "diferido"
  },

  // ----- PASIVOS A CORTO PLAZO (SHORT TERM) -----
  {
    id: uuidv4(),
    name: "Proveedores",
    code: "2-01",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "Otras cuentas por pagar y pasivos acumulados",
    code: "2-02",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "Documentos por pagar",
    code: "2-03",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "Acreedores Diversos",
    code: "2-04",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "Impuestos por pagar",
    code: "2-05",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "IVA por pagar COBRADO",
    code: "2-06",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "IVA por pagar NO COBRADO",
    code: "2-07",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "Anticipo de Clientes",
    code: "2-08",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "Provisiones",
    code: "2-09",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "Garantías sobre productos vendidos",
    code: "2-10",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "I.S.R. por pagar",
    code: "2-11",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "P.T.U. por pagar",
    code: "2-12",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "Pasivo financiero",
    code: "2-13",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },
  {
    id: uuidv4(),
    name: "Intereses por pagar",
    code: "2-14",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "corto_plazo"
  },

  // ----- PASIVOS A LARGO PLAZO (LONG TERM) -----
  {
    id: uuidv4(),
    name: "Deuda a largo plazo",
    code: "2-15",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "largo_plazo"
  },
  {
    id: uuidv4(),
    name: "Documentos por pagar a largo plazo",
    code: "2-16",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "largo_plazo"
  },
  {
    id: uuidv4(),
    name: "Préstamos Hipotecarios",
    code: "2-17",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "largo_plazo"
  },
  {
    id: uuidv4(),
    name: "Provisiones a largo plazo",
    code: "2-18",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "largo_plazo"
  },
  {
    id: uuidv4(),
    name: "Beneficios al retiro a empleados",
    code: "2-19",
    type: "pasivo",
    nature: "acreedora",
    balance: 0,
    subcategory: "largo_plazo"
  },

  // ----- CAPITAL CONTABLE (OWNERS' EQUITY) -----
  // ----- CAPITAL CONTRIBUIDO (CONTRIBUTED) -----
  {
    id: uuidv4(),
    name: "Capital social",
    code: "3-01",
    type: "capital",
    nature: "acreedora",
    balance: 0,
    subcategory: "contribuido"
  },
  {
    id: uuidv4(),
    name: "Capital social común",
    code: "3-02",
    type: "capital",
    nature: "acreedora",
    balance: 0,
    subcategory: "contribuido"
  },
  {
    id: uuidv4(),
    name: "Prima en venta de acciones",
    code: "3-03",
    type: "capital",
    nature: "acreedora",
    balance: 0,
    subcategory: "contribuido"
  },

  // ----- CAPITAL GANADO (EARNED) -----
  {
    id: uuidv4(),
    name: "Utilidades retenidas",
    code: "3-04",
    type: "capital",
    nature: "acreedora",
    balance: 0,
    subcategory: "ganado"
  },
  {
    id: uuidv4(),
    name: "Utilidades acumuladas",
    code: "3-05",
    type: "capital",
    nature: "acreedora",
    balance: 0,
    subcategory: "ganado"
  },
  {
    id: uuidv4(),
    name: "Utilidad neta del ejercicio",
    code: "3-06",
    type: "capital",
    nature: "acreedora",
    balance: 0,
    subcategory: "ganado"
  },
  {
    id: uuidv4(),
    name: "Reservas de capital",
    code: "3-07",
    type: "capital",
    nature: "acreedora",
    balance: 0,
    subcategory: "ganado"
  },
  
  // ----- INGRESOS O VENTAS (INCOME) -----
  {
    id: uuidv4(),
    name: "Ingresos netos o Ventas netas",
    code: "4-01",
    type: "ingreso",
    nature: "acreedora",
    balance: 0,
    subcategory: "operativos"
  },
  {
    id: uuidv4(),
    name: "Ingresos o Ventas",
    code: "4-02",
    type: "ingreso",
    nature: "acreedora",
    balance: 0,
    subcategory: "operativos"
  },
  
  // ----- COSTOS Y GASTOS (EXPENSES) -----
  // ----- COSTO DE VENTAS -----
  {
    id: uuidv4(),
    name: "Costo de ventas (Cost of sales)",
    code: "5-01",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "operativos_venta"
  },
  {
    id: uuidv4(),
    name: "Costo de ventas",
    code: "5-02",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "operativos_venta"
  },
  
  // ----- GASTOS GENERALES -----
  {
    id: uuidv4(),
    name: "Gastos generales (General expenses)",
    code: "5-03",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "operativos_admin"
  },
  {
    id: uuidv4(),
    name: "Gastos de administración",
    code: "5-04",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "operativos_admin"
  },
  {
    id: uuidv4(),
    name: "Gastos de ventas",
    code: "5-05",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "operativos_venta"
  },
  
  // ----- RESULTADO INTEGRAL DE FINANCIAMIENTO -----
  {
    id: uuidv4(),
    name: "Resultado Integral de Financiamiento",
    code: "5-06",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "financieros"
  },
  {
    id: uuidv4(),
    name: "Productos financieros",
    code: "5-07",
    type: "ingreso",
    nature: "acreedora",
    balance: 0,
    subcategory: "no_operativos"
  },
  {
    id: uuidv4(),
    name: "Intereses a cargo",
    code: "5-08",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "financieros"
  },
  
  // ----- IMPUESTOS A LA UTILIDAD -----
  {
    id: uuidv4(),
    name: "Impuestos a la utilidad (Tax expenses)",
    code: "5-09",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "otros"
  },
  {
    id: uuidv4(),
    name: "I.S.R. (Impuesto sobre la Renta)",
    code: "5-10",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "otros"
  },
  {
    id: uuidv4(),
    name: "P.T.U.",
    code: "5-11",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "otros"
  },
  
  // ----- OTROS GASTOS E INGRESOS -----
  {
    id: uuidv4(),
    name: "Otros gastos e ingresos (Other)",
    code: "5-12",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "otros"
  },
  {
    id: uuidv4(),
    name: "Otros gastos",
    code: "5-13",
    type: "gasto",
    nature: "deudora",
    balance: 0,
    subcategory: "otros"
  },
  {
    id: uuidv4(),
    name: "Otros ingresos",
    code: "5-14",
    type: "ingreso",
    nature: "acreedora",
    balance: 0,
    subcategory: "no_operativos"
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

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (context === undefined) {
    throw new Error("useAccounting must be used within an AccountingProvider");
  }
  return context;
};
