
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableFooter, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Account, TransactionEntry } from "@/types/accounting";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface MovementDetail {
  id: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
}

interface TAccountProps {
  account: Account;
  movements: MovementDetail[];
}

export function TAccount({ account, movements }: TAccountProps) {
  const totalDebits = movements.reduce((sum, m) => sum + m.debit, 0);
  const totalCredits = movements.reduce((sum, m) => sum + m.credit, 0);
  
  // En cuentas deudoras, el saldo positivo es deudor
  // En cuentas acreedoras, el saldo positivo es acreedor
  const balance = account.nature === "deudora" 
    ? totalDebits - totalCredits
    : totalCredits - totalDebits;
  
  const isDebitBalance = balance > 0 && account.nature === "deudora";
  const isCreditBalance = balance > 0 && account.nature === "acreedora";
  const isZeroBalance = balance === 0;
  
  const balanceNature = isZeroBalance 
    ? "Nulo" 
    : (isDebitBalance || (balance < 0 && account.nature === "acreedora"))
      ? "Deudor"
      : "Acreedor";

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>{account.code}</span>
              <span>{account.name}</span>
            </CardTitle>
            <div className="text-xs text-muted-foreground mt-1">
              Naturaleza: {account.nature === "deudora" ? "Deudora" : "Acreedora"}
            </div>
          </div>
          <Badge variant={balanceNature === "Deudor" ? "default" : balanceNature === "Acreedor" ? "secondary" : "outline"}>
            Saldo {balanceNature}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-2 divide-x">
            <div className="bg-muted/40 p-2 text-center font-medium text-muted-foreground">Debe</div>
            <div className="bg-muted/40 p-2 text-center font-medium text-muted-foreground">Haber</div>
          </div>
          
          <div className="grid grid-cols-2 divide-x">
            <div className="min-h-[150px] max-h-[250px] overflow-auto">
              {movements.filter(m => m.debit > 0).length > 0 ? (
                <Table>
                  <TableBody>
                    {movements
                      .filter(m => m.debit > 0)
                      .map(m => (
                        <TableRow key={`debit-${m.id}`}>
                          <TableCell className="p-2 border-b">
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(m.date), 'dd/MM/yyyy')}
                            </div>
                            <div className="font-medium">{formatCurrency(m.debit)}</div>
                            <div className="text-xs truncate" title={m.description}>
                              {m.description}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  Sin movimientos
                </div>
              )}
            </div>
            
            <div className="min-h-[150px] max-h-[250px] overflow-auto">
              {movements.filter(m => m.credit > 0).length > 0 ? (
                <Table>
                  <TableBody>
                    {movements
                      .filter(m => m.credit > 0)
                      .map(m => (
                        <TableRow key={`credit-${m.id}`}>
                          <TableCell className="p-2 border-b">
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(m.date), 'dd/MM/yyyy')}
                            </div>
                            <div className="font-medium">{formatCurrency(m.credit)}</div>
                            <div className="text-xs truncate" title={m.description}>
                              {m.description}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  Sin movimientos
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 divide-x border-t">
            <div className="p-2 text-right font-medium">
              {formatCurrency(totalDebits)}
            </div>
            <div className="p-2 text-right font-medium">
              {formatCurrency(totalCredits)}
            </div>
          </div>
          
          <div className="p-2 text-right border-t bg-muted/20">
            <div className="flex justify-between">
              <span className="font-medium">Saldo:</span>
              <span className={cn(
                "font-semibold",
                isDebitBalance && "text-blue-600",
                isCreditBalance && "text-indigo-600",
                isZeroBalance && "text-gray-500"
              )}>
                {formatCurrency(Math.abs(balance))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
