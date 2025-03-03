
import React from "react";
import { AccountType, Transaction, TransactionEntry } from "@/types/accounting";

// Utility functions for the accounting system
export const getNatureLabel = (nature: string): string => {
  return nature === "deudora" 
    ? "Deudora (Debe ↑, Haber ↓)" 
    : "Acreedora (Debe ↓, Haber ↑)";
};

export const getTypeLabel = (type: string): string => {
  switch (type) {
    case "activo": return "Activo";
    case "pasivo": return "Pasivo";
    case "capital": return "Capital";
    case "ingreso": return "Ingreso";
    case "gasto": return "Gasto";
    default: return type;
  }
};

export const getTypeIcon = (type: string): React.ReactNode => {
  // Los íconos se implementarán en los componentes
  return null;
};

// Utility function to get account movements from transactions
export const getAccountMovements = (accountId: string, transactions: Transaction[]) => {
  return transactions.flatMap(transaction => {
    const entries = transaction.entries.filter(entry => entry.accountId === accountId);
    return entries.map(entry => ({
      id: entry.id,
      date: transaction.date,
      description: transaction.description,
      debit: entry.debit || 0,
      credit: entry.credit || 0
    }));
  });
};

// Validate transaction balance
export const isTransactionBalanced = (entries: TransactionEntry[]): boolean => {
  const totalDebits = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredits = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  return Math.abs(totalDebits - totalCredits) < 0.001; // Accounting for floating point errors
};
