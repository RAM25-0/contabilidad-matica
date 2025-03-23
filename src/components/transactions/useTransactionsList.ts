
import { useState, useMemo } from "react";
import { useAccounting } from "@/contexts/AccountingContext";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

type UseTransactionsListProps = {
  dateFilter?: Date;
  accountFilter?: string;
};

export function useTransactionsList({ dateFilter, accountFilter }: UseTransactionsListProps) {
  const { state, deleteTransaction } = useAccounting();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const filteredTransactions = useMemo(() => {
    let transactions = [...state.transactions];
    
    // Ordenar por fecha (más reciente primero)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Filtrar por fecha
    if (dateFilter) {
      const filterDateString = format(dateFilter, 'yyyy-MM-dd');
      transactions = transactions.filter(t => {
        const transactionDateString = format(new Date(t.date), 'yyyy-MM-dd');
        return transactionDateString === filterDateString;
      });
    }
    
    // Filtrar por cuenta
    if (accountFilter) {
      transactions = transactions.filter(t => 
        t.entries.some(entry => entry.accountId === accountFilter)
      );
    }
    
    return transactions;
  }, [state.transactions, dateFilter, accountFilter]);
  
  const handleDeleteTransaction = (id: string) => {
    try {
      deleteTransaction(id);
      setConfirmDeleteId(null);
      toast({
        title: "Transacción eliminada",
        description: "La transacción ha sido eliminada exitosamente del sistema.",
      });
    } catch (error) {
      console.error("Error al eliminar la transacción:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la transacción. Por favor, intente nuevamente.",
        variant: "destructive"
      });
    }
  };
  
  return {
    filteredTransactions,
    confirmDeleteId,
    setConfirmDeleteId,
    handleDeleteTransaction
  };
}
