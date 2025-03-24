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

export function IncomeStatementPage() {
  const { state } = useAccounting();
  const [showOnlyUsed, setShowOnlyUsed] = useState(false);
  const currentDate = new Date();
  
  // Format date range for the header (first day of current month to today)
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const dateRangeString = `DEL 1° AL ${currentDate.getDate()} DE ${currentDate.toLocaleString('es-MX', { month: 'uppercase' })} ${currentDate.getFullYear()}`;

  // Get all accounts by type
  const getAccountsByType = (type: "ingreso" | "gasto") => {
    return state.accounts.filter(account => account.type === type);
  };

  // Check if an account has been used in any transaction
  const hasAccountBeenUsed = (accountId: string) => {
    return state.transactions.some(transaction => 
      transaction.entries.some(entry => entry.accountId === accountId)
    );
  };

  // Get all income accounts and their balances
  const incomeAccounts = useMemo(() => {
    const accounts = getAccountsByType("ingreso");
    const filtered = showOnlyUsed ? accounts.filter(a => hasAccountBeenUsed(a.id)) : accounts;
    return filtered;
  }, [state.accounts, state.transactions, showOnlyUsed]);

  // Get all expense accounts and their balances
  const expenseAccounts = useMemo(() => {
    const accounts = getAccountsByType("gasto");
    const filtered = showOnlyUsed ? accounts.filter(a => hasAccountBeenUsed(a.id)) : accounts;
    return filtered;
  }, [state.accounts, state.transactions, showOnlyUsed]);

  // Group expense accounts by subcategory
  const expensesBySubcategory = useMemo(() => {
    const salesExpenses = expenseAccounts.filter(a => 
      a.subcategory === "operativos_venta"
    );
    
    const adminExpenses = expenseAccounts.filter(a => 
      a.subcategory === "operativos_admin"
    );
    
    const financialExpenses = expenseAccounts.filter(a => 
      a.subcategory === "financieros"
    );
    
    const otherExpenses = expenseAccounts.filter(a => 
      a.subcategory === "otros" || !a.subcategory
    );

    return {
      salesExpenses,
      adminExpenses,
      financialExpenses,
      otherExpenses
    };
  }, [expenseAccounts]);

  // Calculate key financial figures
  const financials = useMemo(() => {
    // Find "Ventas" and "Costo de Ventas" accounts
    const salesAccount = incomeAccounts.find(a => a.name.toLowerCase().includes("venta") && !a.name.toLowerCase().includes("costo"));
    const costOfSalesAccount = expenseAccounts.find(a => a.name.toLowerCase().includes("costo") && a.name.toLowerCase().includes("venta"));

    // Total sales and cost of sales
    const sales = salesAccount ? salesAccount.balance : 0;
    const costOfSales = costOfSalesAccount ? costOfSalesAccount.balance : 0;
    
    // Gross profit
    const grossProfit = sales - costOfSales;
    
    // Total expenses by category
    const totalSalesExpenses = expensesBySubcategory.salesExpenses.reduce((sum, a) => sum + a.balance, 0);
    const totalAdminExpenses = expensesBySubcategory.adminExpenses.reduce((sum, a) => sum + a.balance, 0);
    
    // Total operating expenses
    const totalOperatingExpenses = totalSalesExpenses + totalAdminExpenses;
    
    // Operating income
    const operatingIncome = grossProfit - totalOperatingExpenses;
    
    // Other income and expenses
    const otherExpenses = expensesBySubcategory.otherExpenses.reduce((sum, a) => sum + a.balance, 0);
    const otherIncome = incomeAccounts
      .filter(a => a !== salesAccount)
      .reduce((sum, a) => sum + a.balance, 0);
    
    // Financial income and expenses
    const financialExpenses = expensesBySubcategory.financialExpenses.reduce((sum, a) => sum + a.balance, 0);
    const financialIncome = incomeAccounts
      .filter(a => a.subcategory === "financieros" || a.name.toLowerCase().includes("financier"))
      .reduce((sum, a) => sum + a.balance, 0);
    
    // Income before taxes
    const incomeBeforeTaxes = operatingIncome - otherExpenses + otherIncome - financialExpenses + financialIncome;
    
    // Taxes (assumed 30% ISR and 10% PTU as per the image)
    const isr = incomeBeforeTaxes > 0 ? incomeBeforeTaxes * 0.3 : 0;
    const ptu = incomeBeforeTaxes > 0 ? incomeBeforeTaxes * 0.1 : 0;
    
    // Net income
    const netIncome = incomeBeforeTaxes - isr - ptu;
    
    return {
      sales,
      costOfSales,
      grossProfit,
      totalSalesExpenses,
      totalAdminExpenses,
      totalOperatingExpenses,
      operatingIncome,
      otherExpenses,
      otherIncome,
      financialExpenses,
      financialIncome,
      incomeBeforeTaxes,
      isr,
      ptu,
      netIncome
    };
  }, [incomeAccounts, expenseAccounts, expensesBySubcategory]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <h1 className="text-lg font-semibold">Estado de Resultados</h1>
        </header>
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Estado de Resultados</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {dateRangeString}
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
                    colSpan={3}
                    className="text-center text-primary-foreground font-bold text-base"
                  >
                    ESTADO DE RESULTADOS
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary/90 text-primary-foreground">
                  <TableHead 
                    colSpan={3}
                    className="text-center text-primary-foreground font-semibold"
                  >
                    {dateRangeString}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* INGRESOS */}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-bold text-lg text-blue-800">
                    INGRESOS:
                  </TableCell>
                </TableRow>
                
                {/* Ventas */}
                <TableRow>
                  <TableCell className="pl-8 text-blue-800 font-semibold">VENTAS</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(financials.sales)}
                  </TableCell>
                </TableRow>
                
                {/* Costo de Ventas */}
                <TableRow>
                  <TableCell className="pl-4 text-blue-800">
                    <span className="inline-block w-16 text-right">menos:</span> 
                    <span className="pl-4 font-semibold">COSTO DE VENTAS</span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(financials.costOfSales)}
                  </TableCell>
                </TableRow>
                
                {/* Utilidad Bruta */}
                <TableRow className="border-t-2 border-gray-400">
                  <TableCell className="pl-4 text-blue-800">
                    <span className="inline-block w-16 text-right">igual a:</span> 
                    <span className="pl-4 font-semibold">UTILIDAD BRUTA</span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(financials.grossProfit)}
                  </TableCell>
                </TableRow>
                
                {/* GASTOS DE OPERACIÓN */}
                <TableRow className="bg-muted/50 mt-4">
                  <TableCell colSpan={3} className="font-bold text-lg text-blue-800">
                    GASTOS DE OPERACIÓN:
                  </TableCell>
                </TableRow>
                
                {/* Gastos de Venta */}
                <TableRow>
                  <TableCell className="pl-8 text-blue-800 font-semibold">GASTOS DE VENTA</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(financials.totalSalesExpenses)}
                  </TableCell>
                </TableRow>
                
                {/* Gastos de Administración */}
                <TableRow>
                  <TableCell className="pl-4 text-blue-800">
                    <span className="inline-block w-16 text-right">más:</span> 
                    <span className="pl-4 font-semibold">GASTOS DE ADMINISTRACIÓN</span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(financials.totalAdminExpenses)}
                  </TableCell>
                </TableRow>
                
                {/* Total Gastos de Operación */}
                <TableRow className="border-t border-gray-300">
                  <TableCell className="pl-8 text-blue-800 font-semibold">
                    TOTAL GASTOS DE OPERACIÓN
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(financials.totalOperatingExpenses)}
                  </TableCell>
                </TableRow>
                
                {/* Utilidad de Operación */}
                <TableRow className="bg-muted/30">
                  <TableCell className="font-bold text-blue-800">UTILIDAD DE OPERACIÓN</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(financials.operatingIncome)}
                  </TableCell>
                </TableRow>
                
                {/* OTROS GASTOS Y PRODUCTOS */}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-bold text-lg text-blue-800">
                    OTROS GASTOS Y PRODUCTOS:
                  </TableCell>
                </TableRow>
                
                {/* Otros Gastos */}
                <TableRow>
                  <TableCell className="pl-4 text-blue-800">
                    <span className="inline-block w-16 text-right">menos:</span> 
                    <span className="pl-4 font-semibold">OTROS GASTOS</span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(financials.otherExpenses)}
                  </TableCell>
                </TableRow>
                
                {/* Otros Productos */}
                <TableRow>
                  <TableCell className="pl-4 text-blue-800">
                    <span className="inline-block w-16 text-right">más:</span> 
                    <span className="pl-4 font-semibold">OTROS PRODUCTOS</span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(financials.otherIncome)}
                  </TableCell>
                </TableRow>
                
                {/* RESULTADO INTEGRAL DE FINANCIAMIENTO */}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-bold text-lg text-blue-800">
                    RESULTADO INTEGRAL DE FINANCIAMIENTO:
                  </TableCell>
                </TableRow>
                
                {/* Gastos Financieros */}
                <TableRow>
                  <TableCell className="pl-4 text-blue-800">
                    <span className="inline-block w-16 text-right">menos:</span> 
                    <span className="pl-4 font-semibold">GASTOS FINANCIEROS</span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(financials.financialExpenses)}
                  </TableCell>
                </TableRow>
                
                {/* Productos Financieros */}
                <TableRow>
                  <TableCell className="pl-4 text-blue-800">
                    <span className="inline-block w-16 text-right">más:</span> 
                    <span className="pl-4 font-semibold">PRODUCTOS FINANCIEROS</span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(financials.financialIncome)}
                  </TableCell>
                </TableRow>
                
                {/* Utilidad antes de impuestos */}
                <TableRow className="bg-muted/30">
                  <TableCell className="font-bold text-blue-800">UTILIDAD ANTES DE IMPUESTOS Y P.T.U</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(financials.incomeBeforeTaxes)}
                  </TableCell>
                </TableRow>
                
                {/* Impuestos */}
                <TableRow>
                  <TableCell className="pl-8 text-blue-800 font-semibold">
                    IMPUESTO SOBRE LA RENTA 30%
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(financials.isr)}
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="pl-8 text-blue-800 font-semibold">
                    P.T.U. 10%
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(financials.ptu)}
                  </TableCell>
                </TableRow>
                
                {/* Utilidad Neta */}
                <TableRow className="bg-blue-100">
                  <TableCell className="font-bold text-blue-800 text-lg">UTILIDAD NETA</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    {formatCurrency(financials.netIncome)}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-blue-100">
                  <TableCell className="font-bold text-blue-800 text-lg">UTILIDAD NETA</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    {formatCurrency(financials.netIncome)}
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
