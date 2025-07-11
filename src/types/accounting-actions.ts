
import { Account, AccountingState, AccountType, Transaction } from "./accounting";

export type AccountingAction =
  | { type: "ADD_ACCOUNT"; payload: Omit<Account, "id" | "balance"> }
  | { type: "UPDATE_ACCOUNT"; payload: Account }
  | { type: "DELETE_ACCOUNT"; payload: string }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: Account | null }
  | { type: "ADD_TRANSACTION"; payload: Omit<Transaction, "id" | "isBalanced"> }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "DELETE_ALL_TRANSACTIONS" }
  | { type: "FILTER_ACCOUNTS"; payload: AccountType | "todos" }
  | { type: "SET_FULL_STATE"; payload: AccountingState };
