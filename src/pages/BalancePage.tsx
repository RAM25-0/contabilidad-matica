
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { ArrowLeft, ClipboardList, FilterX, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccounting } from "@/contexts/AccountingContext";
import { Account, AccountType } from "@/types/accounting";
import { formatCurrency } from "@/lib/utils";
import { AccountBadge } from "@/components/accounts/AccountBadge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export function BalancePage() {
  const { state } = useAccounting();
  const [showOnlyUsed, setShowOnlyUsed] = useState(false);

  // Utility function to get total debits/credits for an account from all transactions
  const getAccountMovements = (accountId: string) => {
    let totalDebit = 0;
    let totalCredit = 0;

    state.transactions.forEach(transaction => {
      transaction.entries.forEach(entry => {
        if (entry.accountId === accountId) {
          totalDebit += entry.debit || 0;
          totalCredit += entry.credit || 0;
        }
      });
    });

    return { totalDebit, totalCredit };
  };

  // Calculate balance based on account nature
  const calculateBalance = (account: Account, debit: number, credit: number) => {
    // For debit-nature accounts, debit increases and credit decreases balance
    if (account.nature === "deudora") {
      return debit - credit;
    }
    // For credit-nature accounts, credit increases and debit decreases balance
    else {
      return credit - debit;
    }
  };

  // Determine if an account has been used in any transaction
  const hasAccountBeenUsed = (accountId: string) => {
    return state.transactions.some(transaction => 
      transaction.entries.some(entry => entry.accountId === accountId)
    );
  };

  // Group accounts by type and calculate movements
  const accountsWithMovements = useMemo(() => {
    const order: AccountType[] = ["activo", "pasivo", "capital", "ingreso", "gasto"];
    
    const result = state.accounts.map(account => {
      const { totalDebit, totalCredit } = getAccountMovements(account.id);
      const balance = calculateBalance(account, totalDebit, totalCredit);
      const used = hasAccountBeenUsed(account.id);
      
      return {
        ...account,
        debit: totalDebit,
        credit: totalCredit,
        balance,
        used
      };
    });
    
    // Filter out unused accounts if the toggle is on
    const filteredResults = showOnlyUsed 
      ? result.filter(account => account.used) 
      : result;
    
    // Sort by the predefined order
    return filteredResults.sort((a, b) => {
      return order.indexOf(a.type) - order.indexOf(b.type);
    });
  }, [state.accounts, state.transactions, showOnlyUsed]);

  // Calculate sums for the table footer
  const totals = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;
    let totalDeudor = 0;
    let totalAcreedor = 0;

    accountsWithMovements.forEach(account => {
      totalDebit += account.debit;
      totalCredit += account.credit;
      
      if (account.balance > 0) {
        if (account.nature === "deudora") {
          totalDeudor += account.balance;
        } else {
          totalAcreedor += account.balance;
        }
      } else {
        if (account.nature === "deudora") {
          totalAcreedor += Math.abs(account.balance);
        } else {
          totalDeudor += Math.abs(account.balance);
        }
      }
    });

    return { totalDebit, totalCredit, totalDeudor, totalAcreedor };
  }, [accountsWithMovements]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <h1 className="text-lg font-semibold">Balanza de Comprobación</h1>
        </header>
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Balanza de Comprobación</h1>
                <p className="text-muted-foreground">
                  Vista de saldos y movimientos de todas las cuentas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowOnlyUsed(!showOnlyUsed)}
                className="flex items-center gap-2"
              >
                {showOnlyUsed ? (
                  <>
                    <FilterX className="h-4 w-4" />
                    Mostrar todas las cuentas
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4" />
                    Mostrar solo cuentas usadas
                  </>
                )}
              </Button>
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Panel Principal
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary text-primary-foreground">
                  <TableHead 
                    rowSpan={2} 
                    className="text-center align-middle text-primary-foreground font-bold text-base w-1/5 border-r"
                  >
                    CUENTAS
                  </TableHead>
                  <TableHead 
                    colSpan={2} 
                    className="text-center text-primary-foreground font-bold text-base border-r"
                  >
                    MOVIMIENTOS
                  </TableHead>
                  <TableHead 
                    colSpan={2} 
                    className="text-center text-primary-foreground font-bold text-base"
                  >
                    SALDOS
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary/90 text-primary-foreground">
                  <TableHead className="text-center text-primary-foreground font-semibold border-r">
                    DEBE
                  </TableHead>
                  <TableHead className="text-center text-primary-foreground font-semibold border-r">
                    HABER
                  </TableHead>
                  <TableHead className="text-center text-primary-foreground font-semibold border-r">
                    DEUDOR
                  </TableHead>
                  <TableHead className="text-center text-primary-foreground font-semibold">
                    ACREEDOR
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Group and render accounts by type */}
                {["activo", "pasivo", "capital", "ingreso", "gasto"].map((type) => {
                  const accountsOfType = accountsWithMovements.filter(a => a.type === type);
                  if (accountsOfType.length === 0) return null;
                  
                  return (
                    <React.Fragment key={type}>
                      {/* Category header */}
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={5} className="font-semibold py-2">
                          <AccountBadge type={type as AccountType} label={
                            type === "activo" ? "ACTIVOS" : 
                            type === "pasivo" ? "PASIVOS" : 
                            type === "capital" ? "CAPITAL" : 
                            type === "ingreso" ? "INGRESOS" : "GASTOS"
                          } />
                        </TableCell>
                      </TableRow>
                      
                      {/* Accounts of this type */}
                      {accountsOfType.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium pl-6">
                            {account.name}
                          </TableCell>
                          <TableCell className="text-right">
                            {account.debit > 0 ? formatCurrency(account.debit) : ""}
                          </TableCell>
                          <TableCell className="text-right">
                            {account.credit > 0 ? formatCurrency(account.credit) : ""}
                          </TableCell>
                          <TableCell className="text-right">
                            {account.balance > 0 && account.nature === "deudora" ? 
                              formatCurrency(account.balance) : 
                              account.balance < 0 && account.nature === "acreedora" ? 
                                formatCurrency(Math.abs(account.balance)) : 
                                ""}
                          </TableCell>
                          <TableCell className="text-right">
                            {account.balance > 0 && account.nature === "acreedora" ? 
                              formatCurrency(account.balance) : 
                              account.balance < 0 && account.nature === "deudora" ? 
                                formatCurrency(Math.abs(account.balance)) : 
                                ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                })}
                
                {/* Footer row with totals */}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell className="font-bold text-right">TOTALES</TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(totals.totalDebit)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(totals.totalCredit)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(totals.totalDeudor)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(totals.totalAcreedor)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Verification message */}
          <div className="mt-4 text-right">
            <span className={`text-sm font-medium ${
              Math.abs(totals.totalDebit - totals.totalCredit) < 0.01 &&
              Math.abs(totals.totalDeudor - totals.totalAcreedor) < 0.01
                ? "text-green-600"
                : "text-red-600"
            }`}>
              {Math.abs(totals.totalDebit - totals.totalCredit) < 0.01 &&
              Math.abs(totals.totalDeudor - totals.totalAcreedor) < 0.01
                ? "✓ La balanza está cuadrada"
                : "✗ La balanza no está cuadrada"}
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
