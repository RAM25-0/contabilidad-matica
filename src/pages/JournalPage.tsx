
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAccounting } from "@/contexts/AccountingContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { TransactionEntry } from "@/components/transactions/TransactionEntry";

export function JournalPage() {
  const { state } = useAccounting();
  
  const sortedTransactions = useMemo(() => {
    return [...state.transactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [state.transactions]);
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Libro Diario</h1>
            <p className="text-muted-foreground">Registro cronológico de todas las transacciones</p>
          </div>
        </div>
        
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel Principal
          </Button>
        </Link>
      </div>
      
      {sortedTransactions.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-3">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No hay transacciones registradas</h3>
              <p className="text-muted-foreground">
                Las transacciones que registres aparecerán aquí en orden cronológico.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Transacciones Registradas</CardTitle>
            <CardDescription>
              Mostrando {sortedTransactions.length} transacciones en orden cronológico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {sortedTransactions.map((transaction) => {
                const totalDebits = transaction.entries.reduce((sum, entry) => sum + entry.debit, 0);
                
                return (
                  <div key={transaction.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium">{transaction.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">Total:</span>
                        <p className="font-medium">{formatCurrency(totalDebits)}</p>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cuenta</TableHead>
                          <TableHead className="text-right">Debe</TableHead>
                          <TableHead className="text-right">Haber</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transaction.entries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">
                              {entry.debit > 0 ? entry.accountName : <span className="ml-8">{entry.accountName}</span>}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.debit > 0 ? formatCurrency(entry.debit) : ""}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.credit > 0 ? formatCurrency(entry.credit) : ""}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
