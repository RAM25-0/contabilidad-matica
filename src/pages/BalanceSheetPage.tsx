
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { ArrowLeft, FileText, Calendar, Filter, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccounting } from "@/contexts/AccountingContext";
import { Account } from "@/types/accounting";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export function BalanceSheetPage() {
  const { state } = useAccounting();
  const [showOnlyUsed, setShowOnlyUsed] = useState(false);
  const currentDate = new Date();
  
  // Format date for the header
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('es-MX', { month: 'long' }).toUpperCase();
  const year = currentDate.getFullYear();
  const dateString = `AL ${day} DE ${month} ${year}`;

  // Check if an account has been used in any transaction
  const hasAccountBeenUsed = (accountId: string) => {
    return state.transactions.some(transaction => 
      transaction.entries.some(entry => entry.accountId === accountId)
    );
  };

  // Get all accounts by type and subcategory
  const getAccountsByTypeAndSubcategory = (type: "activo" | "pasivo" | "capital", subcategory?: string) => {
    let accounts = state.accounts.filter(account => account.type === type);
    
    if (subcategory) {
      accounts = accounts.filter(account => account.subcategory === subcategory);
    }
    
    const filtered = showOnlyUsed ? accounts.filter(a => hasAccountBeenUsed(a.id)) : accounts;
    return filtered;
  };

  // Get assets grouped by subcategory
  const assets = useMemo(() => {
    const currentAssets = getAccountsByTypeAndSubcategory("activo", "circulante");
    const nonCurrentAssets = getAccountsByTypeAndSubcategory("activo", "fijo");
    const deferredAssets = getAccountsByTypeAndSubcategory("activo", "diferido");
    
    const totalCurrentAssets = currentAssets.reduce((sum, a) => sum + a.balance, 0);
    const totalNonCurrentAssets = nonCurrentAssets.reduce((sum, a) => sum + a.balance, 0);
    const totalDeferredAssets = deferredAssets.reduce((sum, a) => sum + a.balance, 0);
    
    const totalAssets = totalCurrentAssets + totalNonCurrentAssets + totalDeferredAssets;
    
    return {
      currentAssets,
      nonCurrentAssets,
      deferredAssets,
      totalCurrentAssets,
      totalNonCurrentAssets,
      totalDeferredAssets,
      totalAssets
    };
  }, [state.accounts, state.transactions, showOnlyUsed]);

  // Get liabilities grouped by subcategory
  const liabilities = useMemo(() => {
    const shortTermLiabilities = getAccountsByTypeAndSubcategory("pasivo", "corto_plazo");
    const longTermLiabilities = getAccountsByTypeAndSubcategory("pasivo", "largo_plazo");
    
    const totalShortTermLiabilities = shortTermLiabilities.reduce((sum, a) => sum + a.balance, 0);
    const totalLongTermLiabilities = longTermLiabilities.reduce((sum, a) => sum + a.balance, 0);
    
    const totalLiabilities = totalShortTermLiabilities + totalLongTermLiabilities;
    
    return {
      shortTermLiabilities,
      longTermLiabilities,
      totalShortTermLiabilities,
      totalLongTermLiabilities,
      totalLiabilities
    };
  }, [state.accounts, state.transactions, showOnlyUsed]);

  // Get equity accounts and calculate net income from income and expense accounts
  const equity = useMemo(() => {
    const contributedCapitalAccounts = getAccountsByTypeAndSubcategory("capital", "contribuido");
    const earnedCapitalAccounts = getAccountsByTypeAndSubcategory("capital", "ganado");
    
    // Calculate net income from income statement
    const incomeAccounts = state.accounts.filter(a => a.type === "ingreso");
    const expenseAccounts = state.accounts.filter(a => a.type === "gasto");
    
    const totalIncome = incomeAccounts.reduce((sum, a) => sum + a.balance, 0);
    const totalExpenses = expenseAccounts.reduce((sum, a) => sum + a.balance, 0);
    
    const netIncome = totalIncome - totalExpenses;
    
    const totalContributedCapital = contributedCapitalAccounts.reduce((sum, a) => sum + a.balance, 0);
    const totalEarnedCapital = earnedCapitalAccounts.reduce((sum, a) => sum + a.balance, 0) + netIncome;
    
    const totalEquity = totalContributedCapital + totalEarnedCapital;
    
    return {
      contributedCapitalAccounts,
      earnedCapitalAccounts,
      netIncome,
      totalContributedCapital,
      totalEarnedCapital,
      totalEquity
    };
  }, [state.accounts, state.transactions, showOnlyUsed]);

  // Calculate total liabilities + equity (should equal total assets)
  const totalLiabilitiesAndEquity = liabilities.totalLiabilities + equity.totalEquity;
  
  // Check if the balance sheet is in balance (Assets = Liabilities + Equity)
  const isBalanced = Math.abs(assets.totalAssets - totalLiabilitiesAndEquity) < 0.001;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <h1 className="text-lg font-semibold">Estado de Situación Financiera</h1>
        </header>
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Estado de Situación Financiera</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {dateString}
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
                    colSpan={6}
                    className="text-center text-primary-foreground font-bold text-base"
                  >
                    ESTADO DE SITUACIÓN FINANCIERA
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary/90 text-primary-foreground">
                  <TableHead 
                    colSpan={6}
                    className="text-center text-primary-foreground font-semibold"
                  >
                    {dateString}
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead colSpan={3} className="text-center font-bold text-blue-800 text-lg">
                    ACTIVO
                  </TableHead>
                  <TableHead colSpan={3} className="text-center font-bold text-blue-800 text-lg">
                    PASIVO
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="align-top">
                    {/* ACTIVO SECTION */}
                    <Table>
                      <TableBody>
                        {/* ACTIVO CIRCULANTE */}
                        <TableRow className="bg-blue-50/50">
                          <TableCell colSpan={3} className="font-bold">
                            ACTIVO CIRCULANTE
                          </TableCell>
                        </TableRow>
                        
                        {assets.currentAssets.map(account => (
                          <TableRow key={account.id}>
                            <TableCell className="pl-8 font-medium uppercase">{account.name}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(account.balance)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ))}
                        
                        <TableRow>
                          <TableCell className="font-medium text-right">TOTAL ACTIVO CIRCULANTE</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(assets.totalCurrentAssets)}
                          </TableCell>
                        </TableRow>
                        
                        {/* ACTIVO NO CIRCULANTE */}
                        <TableRow className="bg-blue-50/50">
                          <TableCell colSpan={3} className="font-bold">
                            ACTIVO NO CIRCULANTE
                          </TableCell>
                        </TableRow>
                        
                        {assets.nonCurrentAssets.map(account => (
                          <TableRow key={account.id}>
                            <TableCell className="pl-8 font-medium uppercase">{account.name}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(account.balance)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ))}
                        
                        <TableRow>
                          <TableCell className="font-medium text-right">TOTAL ACTIVO NO CIRCULANTE</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(assets.totalNonCurrentAssets)}
                          </TableCell>
                        </TableRow>
                        
                        {/* ACTIVO DIFERIDO - only display if there are deferred assets */}
                        {assets.deferredAssets.length > 0 && (
                          <>
                            <TableRow className="bg-blue-50/50">
                              <TableCell colSpan={3} className="font-bold">
                                ACTIVO DIFERIDO
                              </TableCell>
                            </TableRow>
                            
                            {assets.deferredAssets.map(account => (
                              <TableRow key={account.id}>
                                <TableCell className="pl-8 font-medium uppercase">{account.name}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(account.balance)}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            ))}
                            
                            <TableRow>
                              <TableCell className="font-medium text-right">TOTAL ACTIVO DIFERIDO</TableCell>
                              <TableCell></TableCell>
                              <TableCell className="text-right font-bold">
                                {formatCurrency(assets.totalDeferredAssets)}
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                        
                        {/* TOTAL ACTIVO */}
                        <TableRow className="bg-blue-100">
                          <TableCell className="font-bold">TOTAL ACTIVO</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(assets.totalAssets)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableCell>
                  
                  <TableCell colSpan={3} className="align-top">
                    {/* PASIVO AND CAPITAL SECTION */}
                    <Table>
                      <TableBody>
                        {/* PASIVO A CORTO PLAZO */}
                        <TableRow className="bg-blue-50/50">
                          <TableCell colSpan={3} className="font-bold">
                            PASIVO A CORTO PLAZO
                          </TableCell>
                        </TableRow>
                        
                        {liabilities.shortTermLiabilities.map(account => (
                          <TableRow key={account.id}>
                            <TableCell className="pl-8 font-medium uppercase">{account.name}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(account.balance)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ))}
                        
                        <TableRow>
                          <TableCell className="font-medium text-right">TOTAL PASIVO A CORTO PLAZO</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(liabilities.totalShortTermLiabilities)}
                          </TableCell>
                        </TableRow>
                        
                        {/* PASIVO A LARGO PLAZO - only display if there are long-term liabilities */}
                        {liabilities.longTermLiabilities.length > 0 && (
                          <>
                            <TableRow className="bg-blue-50/50">
                              <TableCell colSpan={3} className="font-bold">
                                PASIVO A LARGO PLAZO
                              </TableCell>
                            </TableRow>
                            
                            {liabilities.longTermLiabilities.map(account => (
                              <TableRow key={account.id}>
                                <TableCell className="pl-8 font-medium uppercase">{account.name}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(account.balance)}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            ))}
                            
                            <TableRow>
                              <TableCell className="font-medium text-right">TOTAL PASIVO A LARGO PLAZO</TableCell>
                              <TableCell></TableCell>
                              <TableCell className="text-right font-bold">
                                {formatCurrency(liabilities.totalLongTermLiabilities)}
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                        
                        {/* TOTAL PASIVO */}
                        <TableRow>
                          <TableCell className="font-medium text-right">TOTAL PASIVO</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(liabilities.totalLiabilities)}
                          </TableCell>
                        </TableRow>
                        
                        {/* CAPITAL */}
                        <TableRow className="bg-blue-50/50">
                          <TableCell colSpan={3} className="font-bold text-center text-blue-800 text-lg">
                            CAPITAL
                          </TableCell>
                        </TableRow>
                        
                        {/* CAPITAL CONTRIBUIDO */}
                        <TableRow className="bg-blue-50/50">
                          <TableCell colSpan={3} className="font-bold">
                            CAPITAL CONTRIBUIDO
                          </TableCell>
                        </TableRow>
                        
                        {equity.contributedCapitalAccounts.map(account => (
                          <TableRow key={account.id}>
                            <TableCell className="pl-8 font-medium uppercase">{account.name}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(account.balance)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ))}
                        
                        <TableRow>
                          <TableCell className="font-medium text-right">TOTAL CAPITAL CONTRIBUIDO</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(equity.totalContributedCapital)}
                          </TableCell>
                        </TableRow>
                        
                        {/* CAPITAL GANADO */}
                        <TableRow className="bg-blue-50/50">
                          <TableCell colSpan={3} className="font-bold">
                            CAPITAL GANADO
                          </TableCell>
                        </TableRow>
                        
                        {equity.earnedCapitalAccounts.map(account => (
                          <TableRow key={account.id}>
                            <TableCell className="pl-8 font-medium uppercase">{account.name}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(account.balance)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ))}
                        
                        {/* NET INCOME FROM INCOME STATEMENT */}
                        <TableRow>
                          <TableCell className="pl-8 font-medium uppercase">UTILIDAD NETA DEL EJERCICIO</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(equity.netIncome)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell className="font-medium text-right">TOTAL CAPITAL GANADO</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(equity.totalEarnedCapital)}
                          </TableCell>
                        </TableRow>
                        
                        {/* TOTAL CAPITAL */}
                        <TableRow>
                          <TableCell className="font-medium text-right">TOTAL CAPITAL</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(equity.totalEquity)}
                          </TableCell>
                        </TableRow>
                        
                        {/* TOTAL PASIVO + CAPITAL */}
                        <TableRow className="bg-blue-100">
                          <TableCell className="font-bold">TOTAL PASIVO Y CAPITAL</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(totalLiabilitiesAndEquity)}
                          </TableCell>
                        </TableRow>
                        
                        {/* Message if not balanced */}
                        {!isBalanced && (
                          <TableRow className="bg-red-100">
                            <TableCell colSpan={3} className="text-center text-red-600 font-bold">
                              ¡ALERTA! El balance no cuadra. La diferencia es de {formatCurrency(Math.abs(assets.totalAssets - totalLiabilitiesAndEquity))}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
