
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccounting } from "@/contexts/AccountingContext";
import { TAccount } from "@/components/TAccount";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccountSubcategory, AccountType } from "@/types/accounting";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, CheckCircle, XCircle, BookOpen } from "lucide-react";

// Función para obtener la etiqueta de la subcategoría
function getSubcategoryLabel(subcategory: AccountSubcategory): string {
  switch (subcategory) {
    // Activos
    case "circulante": return "Activo Circulante";
    case "fijo": return "Activo Fijo";
    case "diferido": return "Activo No Circulante";
    
    // Pasivos
    case "corto_plazo": return "Pasivo a Corto Plazo";
    case "largo_plazo": return "Pasivo a Largo Plazo";
    
    // Capital
    case "contribuido": return "Capital Social";
    case "ganado": return "Resultados y Reservas";
    
    // Resultados
    case "operativos": return "Operativos";
    case "no_operativos": return "No Operativos";
    case "operativos_admin": return "Gastos de Administración";
    case "operativos_venta": return "Gastos de Venta";
    case "financieros": return "Financieros";
    case "otros": return "Otros";
    
    case "none":
    default:
      return "Sin clasificar";
  }
}

// Colores por tipo de cuenta
const typeColors = {
  activo: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    title: "text-emerald-800",
    header: "bg-emerald-100"
  },
  pasivo: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    title: "text-rose-800",
    header: "bg-rose-100"
  },
  capital: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    title: "text-purple-800",
    header: "bg-purple-100"
  },
  ingreso: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    title: "text-blue-800",
    header: "bg-blue-100"
  },
  gasto: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    title: "text-amber-800",
    header: "bg-amber-100"
  }
};

// Orden de subcategorías para mostrar
const subcategoryOrder: Record<AccountType, AccountSubcategory[]> = {
  activo: ["circulante", "fijo", "diferido"],
  pasivo: ["corto_plazo", "largo_plazo"],
  capital: ["contribuido", "ganado"],
  ingreso: ["operativos", "no_operativos"],
  gasto: ["operativos_admin", "operativos_venta", "financieros", "otros"]
};

export default function LedgerPage() {
  const { state, getTotalsByType } = useAccounting();
  const [activeTab, setActiveTab] = useState<AccountType>("activo");
  
  // Log transactions when component mounts or updates
  useEffect(() => {
    console.info("Ledger Page - Current transactions:", state.transactions.length);
  }, [state.transactions]);
  
  // Obtener los totales para la ecuación contable
  const { activos, pasivos, capital, equation } = getTotalsByType();
  
  // Procesar transacciones para obtener movimientos por cuenta
  const getAccountMovements = (accountId: string) => {
    return state.transactions.flatMap(transaction => {
      const entries = transaction.entries.filter(entry => entry.accountId === accountId);
      return entries.map(entry => ({
        id: entry.id,
        date: transaction.date,
        description: transaction.description,
        debit: entry.debit,
        credit: entry.credit
      }));
    });
  };
  
  // Filtrar cuentas por tipo y que tengan movimientos o saldo
  const accountsByType = (type: AccountType) => {
    return state.accounts
      .filter(account => account.type === type)
      .map(account => {
        const movements = getAccountMovements(account.id);
        return { account, movements };
      })
      .filter(({ account, movements }) => movements.length > 0 || account.balance !== 0);
  };
  
  // Agrupar cuentas por subcategoría
  const groupAccountsBySubcategory = (accounts: Array<{account: any, movements: any[]}>) => {
    const grouped: Record<string, Array<{account: any, movements: any[]}>> = {};
    
    accounts.forEach(item => {
      const subcategory = item.account.subcategory || "none";
      if (!grouped[subcategory]) {
        grouped[subcategory] = [];
      }
      grouped[subcategory].push(item);
    });
    
    return grouped;
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Libro Mayor</h1>
          <p className="text-muted-foreground mt-2">
            Visualización en formato de cuentas "T" para balance y resultados
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/diario">
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Ir al Libro Diario
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Inicio
            </Button>
          </Link>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle>Ecuación Contable</CardTitle>
          <CardDescription>Activo = Pasivo + Capital</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex flex-col items-center bg-emerald-50 rounded-lg p-4 w-full sm:w-auto">
              <span className="text-lg font-medium text-emerald-800">Activo</span>
              <span className="text-2xl font-bold text-emerald-700">{formatCurrency(activos)}</span>
            </div>
            <div className="text-2xl font-bold">=</div>
            <div className="flex flex-col items-center bg-rose-50 rounded-lg p-4 w-full sm:w-auto">
              <span className="text-lg font-medium text-rose-800">Pasivo</span>
              <span className="text-2xl font-bold text-rose-700">{formatCurrency(pasivos)}</span>
            </div>
            <div className="text-2xl font-bold">+</div>
            <div className="flex flex-col items-center bg-purple-50 rounded-lg p-4 w-full sm:w-auto">
              <span className="text-lg font-medium text-purple-800">Capital</span>
              <span className="text-2xl font-bold text-purple-700">{formatCurrency(capital)}</span>
            </div>
          </div>
          
          <div className="flex justify-center items-center pt-4">
            {equation ? (
              <Badge variant="outline" className="gap-1 py-1 px-4 border-green-500 text-green-600 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                La ecuación contable está balanceada
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 py-1 px-4 border-red-500 text-red-600 bg-red-50">
                <XCircle className="h-4 w-4" />
                La ecuación contable NO está balanceada
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as AccountType)}
        className="w-full"
      >
        <TabsList className="mb-4 grid grid-cols-5 md:flex md:w-auto">
          <TabsTrigger 
            value="activo" 
            className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
          >
            Activo
          </TabsTrigger>
          <TabsTrigger 
            value="pasivo" 
            className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800"
          >
            Pasivo
          </TabsTrigger>
          <TabsTrigger 
            value="capital" 
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
          >
            Capital
          </TabsTrigger>
          <TabsTrigger 
            value="ingreso" 
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
          >
            Ingresos
          </TabsTrigger>
          <TabsTrigger 
            value="gasto" 
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
          >
            Gastos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activo" className="mt-6">
          {renderAccountsByType("activo")}
        </TabsContent>
        
        <TabsContent value="pasivo" className="mt-6">
          {renderAccountsByType("pasivo")}
        </TabsContent>
        
        <TabsContent value="capital" className="mt-6">
          {renderAccountsByType("capital")}
        </TabsContent>
        
        <TabsContent value="ingreso" className="mt-6">
          {renderAccountsByType("ingreso")}
        </TabsContent>
        
        <TabsContent value="gasto" className="mt-6">
          {renderAccountsByType("gasto")}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Función para renderizar las cuentas por tipo
  function renderAccountsByType(type: AccountType) {
    const accounts = accountsByType(type);
    
    if (accounts.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          No hay cuentas del tipo {type} con movimientos.
        </div>
      );
    }
    
    const colors = typeColors[type];
    const groupedAccounts = groupAccountsBySubcategory(accounts);
    
    return (
      <div className="space-y-8">
        {subcategoryOrder[type].map(subcategory => {
          const accountsInSubcat = groupedAccounts[subcategory] || [];
          if (accountsInSubcat.length === 0) return null;
          
          return (
            <div key={subcategory} className={`p-6 rounded-lg ${colors.bg} ${colors.border} border`}>
              <h3 className={`text-lg font-semibold mb-4 ${colors.title}`}>
                {getSubcategoryLabel(subcategory)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accountsInSubcat.map(({ account, movements }) => (
                  <TAccount 
                    key={account.id} 
                    account={account} 
                    movements={movements} 
                    colors={colors}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
