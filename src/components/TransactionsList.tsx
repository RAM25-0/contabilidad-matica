
import React, { useMemo, useEffect } from "react";
import { useAccounting } from "@/contexts/AccountingContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AccountBadge } from "@/components/accounts/AccountBadge";

type TransactionsListProps = {
  dateFilter?: Date;
  accountFilter?: string;
  showHeader?: boolean;
  limit?: number;
};

export function TransactionsList({ 
  dateFilter, 
  accountFilter,
  showHeader = true,
  limit 
}: TransactionsListProps) {
  const { state, deleteTransaction } = useAccounting();
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  
  useEffect(() => {
    console.log("TransactionsList mounted with transactions:", state.transactions.length);
  }, []);
  
  const filteredTransactions = useMemo(() => {
    console.log("Filtering transactions:", state.transactions);
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
    
    // Limitar la cantidad de transacciones si se especifica
    if (limit && transactions.length > limit) {
      transactions = transactions.slice(0, limit);
    }
    
    return transactions;
  }, [state.transactions, dateFilter, accountFilter, limit]);
  
  const getTotalDebitsAndCredits = (transactionId: string) => {
    const transaction = state.transactions.find(t => t.id === transactionId);
    if (!transaction) return { totalDebits: 0, totalCredits: 0 };
    
    const totalDebits = transaction.entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredits = transaction.entries.reduce((sum, entry) => sum + entry.credit, 0);
    
    return { totalDebits, totalCredits };
  };
  
  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    setConfirmDeleteId(null);
    toast({
      title: "Transacción eliminada",
      description: "La transacción ha sido eliminada exitosamente.",
    });
  };
  
  // Función para obtener el color según el tipo de cuenta
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "activo": return "bg-emerald-100 text-emerald-800";
      case "pasivo": return "bg-rose-100 text-rose-800";
      case "capital": return "bg-purple-100 text-purple-800";
      case "ingreso": return "bg-blue-100 text-blue-800";
      case "gasto": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
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
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="w-[80px] text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => {
                    const { totalDebits, totalCredits } = getTotalDebitsAndCredits(transaction.id);
                    
                    return (
                      <TableRow key={transaction.id} className="group">
                        <TableCell className="font-medium align-top">
                          {format(new Date(transaction.date), "dd/MM/yyyy", { locale: es })}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="font-medium mb-1">{transaction.description}</div>
                          <div className="space-y-1">
                            {transaction.entries.map(entry => (
                              <div key={entry.id} className="flex justify-between text-sm">
                                <span className="flex items-center">
                                  {entry.debit > 0 && <span className="mr-2 text-blue-600">→</span>}
                                  {entry.credit > 0 && <span className="mr-2 text-indigo-600">←</span>}
                                  <span className={`px-1.5 py-0.5 rounded-sm ${getAccountTypeColor(entry.accountType)}`}>
                                    {entry.accountName}
                                  </span>
                                </span>
                                <span className="text-right ml-4">
                                  {entry.debit > 0 && formatCurrency(entry.debit)}
                                  {entry.credit > 0 && formatCurrency(entry.credit)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium align-top">
                          {formatCurrency(totalDebits)}
                        </TableCell>
                        <TableCell className="text-center align-top">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setConfirmDeleteId(transaction.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar eliminación
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible. Se eliminará la transacción y se revertirán todos sus efectos
              en los saldos de las cuentas asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDeleteId && handleDeleteTransaction(confirmDeleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
