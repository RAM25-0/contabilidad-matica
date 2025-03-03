
import React from "react";
import { useAccounting } from "@/contexts/AccountingContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { isTransactionBalanced } from "@/utils/accounting-utils";

export function JournalList() {
  const { state } = useAccounting();
  
  // Ordenar transacciones por fecha (de más reciente a más antigua)
  const sortedTransactions = [...state.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="text-xl">Libro Diario</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No hay transacciones registradas en el libro diario.
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead className="w-[120px]">Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead className="text-right">Cargo</TableHead>
                  <TableHead className="text-right">Abono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={5} className="font-semibold py-2">
                        <div className="flex items-center justify-between">
                          <span>
                            {format(new Date(transaction.date), "dd MMMM yyyy", { locale: es })}
                            {" - "}
                            {transaction.description}
                          </span>
                          <Badge variant={transaction.isBalanced ? "success" : "destructive"}>
                            {transaction.isBalanced ? "Balanceada" : "No balanceada"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                    {transaction.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{entry.accountName}</TableCell>
                        <TableCell className="text-right">
                          {entry.debit > 0 && formatCurrency(entry.debit)}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.credit > 0 && formatCurrency(entry.credit)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-b-2 border-gray-200">
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          transaction.entries.reduce((sum, entry) => sum + entry.debit, 0)
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          transaction.entries.reduce((sum, entry) => sum + entry.credit, 0)
                        )}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
