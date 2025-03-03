
import React, { useMemo, useEffect } from "react";
import { useAccounting } from "@/contexts/AccountingContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
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
import { Trash2, AlertTriangle, Eye, BookOpen } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AccountBadge } from "@/components/accounts/AccountBadge";
import { Link } from "react-router-dom";

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
  const { state, deleteTransaction } = useAccounting();
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  
  // Log transactions when component mounts or updates
  useEffect(() => {
    // Verificar si hay transacciones y notificar
    if (state.transactions.length > 0) {
      console.info(`Módulo de Transacciones: ${state.transactions.length} transacciones cargadas`);
    } else {
      console.info("Módulo de Transacciones: No hay transacciones registradas");
    }
  }, []);
  
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
            {filteredTransactions.length > 0 && limit && filteredTransactions.length >= limit && (
              <CardDescription>
                <Link to="/diario" className="text-primary hover:underline flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Ver todas las transacciones en el Libro Diario
                </Link>
              </CardDescription>
            )}
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
                    <TableHead className="w-[100px] text-center">Acciones</TableHead>
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
                                  <AccountBadge
                                    type={entry.accountType}
                                    label={entry.accountName}
                                    showIcon={false}
                                  />
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
                          <div className="flex justify-center gap-1">
                            {showViewButton && (
                              <Link to="/diario">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Eye className="h-4 w-4 text-primary" />
                                </Button>
                              </Link>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setConfirmDeleteId(transaction.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
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
