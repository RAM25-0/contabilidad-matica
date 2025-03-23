
import React from "react";
import { Link } from "react-router-dom";
import { useAccounting } from "@/contexts/AccountingContext";
import { Sidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, CircleDollarSign, Users, Package, BookText, BookOpen } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { TransactionsList } from "@/components/transactions/TransactionsList";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { TransactionForm } from "@/components/TransactionForm";

const CHART_COLORS = ["#3498db", "#9b59b6", "#2ecc71", "#e74c3c", "#f39c12"];

export default function IndexPage() {
  const { state, getTotalsByType } = useAccounting();
  
  const totals = getTotalsByType();

  const chartData = React.useMemo(() => {
    return [
      { name: "Activos", value: state.accounts.filter(a => a.type === "activo").length },
      { name: "Pasivos", value: state.accounts.filter(a => a.type === "pasivo").length },
      { name: "Capital", value: state.accounts.filter(a => a.type === "capital").length },
      { name: "Ingresos", value: state.accounts.filter(a => a.type === "ingreso").length },
      { name: "Gastos", value: state.accounts.filter(a => a.type === "gasto").length },
    ];
  }, [state.accounts]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <h1 className="text-lg font-semibold">Panel Principal</h1>
        </header>
        <main className="grid flex-1 gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Activos Totales
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totals.activos)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pasivos Totales
                </CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totals.pasivos)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Capital Total
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totals.capital)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ecuación Contable
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-2xl font-bold",
                  totals.equation ? "text-green-600" : "text-red-600"
                )}>
                  {totals.equation ? "Balanceado" : "Desbalanceado"}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full md:col-span-4">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Nueva Transacción</CardTitle>
                  <CardDescription>
                    Registra una nueva transacción en el sistema
                  </CardDescription>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button asChild variant="outline">
                    <Link to="/diario">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Ver Libro Diario
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/general-ledger">
                      <BookText className="mr-2 h-4 w-4" />
                      Ver Libro Mayor
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TransactionForm onSuccess={() => {}} />
              </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-3">
              <CardHeader>
                <CardTitle>Transacciones Recientes</CardTitle>
                <CardDescription>
                  Historial de las últimas transacciones registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsList 
                  showViewButton={true}
                  maxHeight="400px"
                />
              </CardContent>
            </Card>
            
            <Card className="col-span-full md:col-span-3">
              <CardHeader>
                <CardTitle>Distribución de Cuentas</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  id="accounts-distribution"
                  className="aspect-square w-full p-2"
                  config={{
                    activo: { color: "#3498db" },
                    pasivo: { color: "#9b59b6" },
                    capital: { color: "#2ecc71" },
                    ingreso: { color: "#27ae60" },
                    gasto: { color: "#f39c12" },
                  }}
                >
                  <PieChart data={chartData}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      fill="#8884d8"
                      label
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
