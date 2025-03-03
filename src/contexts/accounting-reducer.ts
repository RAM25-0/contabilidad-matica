
import { v4 as uuidv4 } from "uuid";
import { AccountingState, AccountType } from "@/types/accounting";
import { AccountingAction } from "@/types/accounting-actions";
import { toast } from "@/components/ui/use-toast";

export const accountingReducer = (state: AccountingState, action: AccountingAction): AccountingState => {
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
      
      const newTransaction = {
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
