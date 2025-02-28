
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useAccounting } from "@/contexts/AccountingContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn, formatCurrency } from "@/lib/utils";

export function TransactionsList() {
  const { state, deleteTransaction, getTypeLabel } = useAccounting();
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const isOpen = (id: string) => !!openItems[id];
  
  if (state.transactions.length === 0) {
    return (
      <Card className="mt-6 animate-fade-in">
        <CardHeader>
          <CardTitle>Transacciones</CardTitle>
          <CardDescription>
            No hay transacciones registradas. Utiliza el botón "Nueva Transacción" para crear una.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4 mt-6 animate-fade-in">
      <h2 className="text-2xl font-semibold tracking-tight">Transacciones Recientes</h2>
      
      <ScrollArea className="h-[600px] rounded-md border">
        <div className="p-4">
          {state.transactions.slice().reverse().map((transaction) => (
            <Collapsible
              key={transaction.id}
              open={isOpen(transaction.id)}
              onOpenChange={() => toggleItem(transaction.id)}
              className="mb-4 bg-card rounded-lg border overflow-hidden"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {format(new Date(transaction.date), "PP", { locale: es })}
                    </span>
                    <Badge variant="outline" className="h-5 rounded-sm">
                      #{state.transactions.length - state.transactions.indexOf(transaction)}
                    </Badge>
                  </div>
                  <p className="text-base font-medium">{transaction.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTransaction(transaction.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {isOpen(transaction.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              
              <CollapsibleContent>
                <div className="px-4 pb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cuenta</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Debe</TableHead>
                        <TableHead className="text-right">Haber</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transaction.entries.map((entry) => (
                        <TableRow key={entry.id} className="transaction-row">
                          <TableCell className="font-medium">{entry.accountName}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                entry.accountType === "activo" && "bg-green-50 text-green-700 border-green-200",
                                entry.accountType === "pasivo" && "bg-red-50 text-red-700 border-red-200",
                                entry.accountType === "capital" && "bg-purple-50 text-purple-700 border-purple-200",
                                entry.accountType === "ingreso" && "bg-blue-50 text-blue-700 border-blue-200",
                                entry.accountType === "gasto" && "bg-orange-50 text-orange-700 border-orange-200",
                              )}
                            >
                              {getTypeLabel(entry.accountType)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {entry.debit > 0 && formatCurrency(entry.debit)}
                          </TableCell>
                          <TableCell className="text-right">
                            {entry.credit > 0 && formatCurrency(entry.credit)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={2} className="font-medium">
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
                    </TableBody>
                  </Table>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
