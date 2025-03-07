
import React from "react";
import { useAccounting } from "@/contexts/AccountingContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Trash } from "lucide-react";
import { TransactionsTable } from "./TransactionsTable";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import { toast } from "@/components/ui/use-toast";
import { useTransactionsList } from "./useTransactionsList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

type TransactionsListProps = {
  dateFilter?: Date;
  accountFilter?: string;
  showHeader?: boolean;
  limit?: number;
  showViewButton?: boolean;
  maxHeight?: string;
};

export function TransactionsList({ 
  dateFilter, 
  accountFilter,
  showHeader = true,
  limit,
  showViewButton = false,
  maxHeight = "350px"
}: TransactionsListProps) {
  const { state, deleteAllTransactions } = useAccounting();
  const { 
    filteredTransactions, 
    confirmDeleteId, 
    setConfirmDeleteId, 
    handleDeleteTransaction 
  } = useTransactionsList({ dateFilter, accountFilter, limit });
  
  const [showDeleteAllDialog, setShowDeleteAllDialog] = React.useState(false);
  
  // Log transactions when component mounts or updates
  React.useEffect(() => {
    // Verificar si hay transacciones y notificar
    if (state.transactions.length > 0) {
      console.info(`Módulo de Transacciones: ${state.transactions.length} transacciones cargadas`);
    } else {
      console.info("Módulo de Transacciones: No hay transacciones registradas");
    }
  }, []);
  
  const handleDeleteAllTransactions = () => {
    deleteAllTransactions();
    setShowDeleteAllDialog(false);
    toast({
      title: "Todas las transacciones eliminadas",
      description: "Se han eliminado todas las transacciones y los saldos de las cuentas se han restablecido.",
    });
  };
  
  return (
    <>
      <Card className="shadow-sm">
        {showHeader && (
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Historial de Transacciones
                {filteredTransactions.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({filteredTransactions.length} {filteredTransactions.length === 1 ? 'transacción' : 'transacciones'})
                  </span>
                )}
              </CardTitle>
              {filteredTransactions.length > 0 && !dateFilter && !accountFilter && (
                <Dialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash className="h-4 w-4" />
                      Borrar todas
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar eliminación</DialogTitle>
                      <DialogDescription>
                        Esta acción eliminará todas las transacciones y restablecerá todos los saldos de las cuentas a cero.
                        Esta acción no se puede deshacer.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={handleDeleteAllTransactions}>
                        Eliminar todas
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
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
            <ScrollArea className={`w-full ${maxHeight ? `max-h-[${maxHeight}]` : ""}`}>
              <TransactionsTable 
                transactions={filteredTransactions} 
                showViewButton={showViewButton}
                onDelete={setConfirmDeleteId}
              />
            </ScrollArea>
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
