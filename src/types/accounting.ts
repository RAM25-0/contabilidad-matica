
export type AccountType = "activo" | "pasivo" | "capital" | "ingreso" | "gasto";

export type AccountNature = "deudora" | "acreedora";

export interface Account {
  id: string;
  name: string;
  code: string;
  type: AccountType;
  nature: AccountNature;
  balance: number;
  description?: string;
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
}

export interface AccountingState {
  accounts: Account[];
  transactions: Transaction[];
  activeAccount: Account | null;
  selectedAccountType: AccountType | "todos";
}
