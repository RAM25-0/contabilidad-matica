
import { Transaction } from "@/types/accounting";

export const getTotalDebitsAndCredits = (transaction: Transaction) => {
  if (!transaction) return { totalDebits: 0, totalCredits: 0 };
  
  const totalDebits = transaction.entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = transaction.entries.reduce((sum, entry) => sum + entry.credit, 0);
  
  return { totalDebits, totalCredits };
};
