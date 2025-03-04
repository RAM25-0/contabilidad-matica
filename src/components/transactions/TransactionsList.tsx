
import React from "react";
import { useAccounting } from "@/contexts/AccountingContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { TransactionsTable } from "./TransactionsTable";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import { toast } from "@/components/ui/use-toast";
import { useTransactionsList } from "./useTransactionsList";

type TransactionsListProps = {
  dateFilter?: Date;
  accountFilter?: string;
  showHeader?: boolean;
  limit?: number;
  showViewButton?: boolean;
};

export function TransactionsList({ 
  dateFilter, 
  accountFilter,
  showHeader = true,
  limit,
  showViewButton = false
}: TransactionsListProps) {
  const { state } = useAccounting();
  const { 
    filteredTransactions, 
    confirmDeleteId, 
    setConfirmDeleteId, 
    handleDeleteTransaction 
  } = useTransactionsList({ dateFilter, accountFilter, limit });
  
  // Log transactions when component mounts or updates
  React.useEffect(() => {
    // Verificar si hay transacciones y notificar
    if (state.transactions.length > 0) {
      console.info(`Módulo de Transacciones: ${state.transactions.length} transacciones cargadas`);
    } else {
      console.info("Módulo de Transacciones: No hay transacciones registradas");
    }
  }, []);
  
  return (
    <>
      <Card className="shadow-sm">
        {showHeader && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Historial de Transacciones
              {filteredTransactions.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filteredTransactions.length} {filteredTransactions.length === 1 ? 'transacción' : 'transacciones'})
                </span>
              )}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No hay transacciones registradas
              {dateFilter && " para la fecha seleccionada"}
              {accountFilter && " para la cuenta seleccionada"}
            </div>
          ) : (
            <TransactionsTable 
              transactions={filteredTransactions} 
              showViewButton={showViewButton}
              onDelete={setConfirmDeleteId}
            />
          )}
        </CardContent>
      </Card>
      
      <DeleteTransactionDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) {
            handleDeleteTransaction(confirmDeleteId);
          }
        }}
      />
    </>
  );
}
