
import React from "react";
import { Transaction } from "@/types/accounting";
import { 
  Table, TableBody, TableCell, TableHeader, TableHead, TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import { TransactionEntry } from "./TransactionEntry";
import { getTotalDebitsAndCredits } from "./TransactionUtils";

type TransactionsTableProps = {
  transactions: Transaction[];
  showViewButton?: boolean;
  onDelete: (id: string) => void;
};

export function TransactionsTable({ 
  transactions, 
  showViewButton = false,
  onDelete 
}: TransactionsTableProps) {
  return (
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
          {transactions.map((transaction) => {
            const { totalDebits } = getTotalDebitsAndCredits(transaction);
            
            return (
              <TableRow key={transaction.id} className="group">
                <TableCell className="font-medium align-top">
                  {format(new Date(transaction.date), "dd/MM/yyyy", { locale: es })}
                </TableCell>
                <TableCell className="align-top">
                  <div className="font-medium mb-1">{transaction.description}</div>
                  <div className="space-y-1">
                    {transaction.entries.map(entry => (
                      <TransactionEntry key={entry.id} entry={entry} />
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
                      onClick={() => onDelete(transaction.id)}
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
  );
}
