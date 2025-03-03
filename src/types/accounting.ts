
export type AccountType = "activo" | "pasivo" | "capital" | "ingreso" | "gasto";

export type AccountNature = "deudora" | "acreedora";

export type AccountSubcategory = "circulante" | "fijo" | "diferido" | "corto_plazo" | "largo_plazo" | "contribuido" | "ganado" | "operativos" | "no_operativos" | "operativos_admin" | "operativos_venta" | "financieros" | "otros" | "none";

export interface Account {
  id: string;
  name: string;
  code: string;
  type: AccountType;
  nature: AccountNature;
  balance: number;
  description?: string;
  subcategory?: AccountSubcategory;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  entries: TransactionEntry[];
  isBalanced: boolean;
}

export interface TransactionEntry {
  id: string;
  accountId: string;
  accountName: string;
  accountType: AccountType;
  debit: number;
  credit: number;
  transactionId?: string; // Added transactionId property
}

export interface AccountingState {
  accounts: Account[];
  transactions: Transaction[];
  activeAccount: Account | null;
  selectedAccountType: AccountType | "todos";
}
