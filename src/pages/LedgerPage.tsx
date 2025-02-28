
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAccounting } from "@/contexts/AccountingContext";
import { TAccount } from "@/components/TAccount";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

// Tipo para agrupar cuentas por tipo y subcategoría
type GroupedAccounts = {
  [key in AccountType]?: {
    [key in AccountSubcategory]?: {
      label: string;
      accounts: Array<{
        account: any;
        movements: any[];
      }>;
    };
  };
};

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
  const [activeTab, setActiveTab] = useState<AccountType | "todos">("activo");
  
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
  
  // Agrupar cuentas por tipo y subcategoría
  const groupedAccounts: GroupedAccounts = state.accounts.reduce((acc, account) => {
    const type = account.type as AccountType;
    const subcategory = account.subcategory || "none";
    
    if (!acc[type]) {
      acc[type] = {};
    }
    
    if (!acc[type]![subcategory]) {
      acc[type]![subcategory] = {
        label: getSubcategoryLabel(subcategory as AccountSubcategory),
        accounts: []
      };
    }
    
    const movements = getAccountMovements(account.id);
    
    if (movements.length > 0 || account.balance !== 0) {
      acc[type]![subcategory]!.accounts.push({
        account,
        movements
      });
    }
    
    return acc;
  }, {} as GroupedAccounts);
  
  // Renderizado de las cuentas T agrupadas por subcategoría
  const renderAccountsBySubcategory = (type: AccountType) => {
    if (!groupedAccounts[type]) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          No hay cuentas del tipo {type} con movimientos.
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        {subcategoryOrder[type].map(subcategory => {
          const group = groupedAccounts[type]?.[subcategory];
          if (!group || group.accounts.length === 0) return null;
          
          return (
            <div key={subcategory}>
              <h3 className="text-lg font-semibold mb-4">{group.label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.accounts.map(({ account, movements }) => (
                  <TAccount 
                    key={account.id} 
                    account={account} 
                    movements={movements} 
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
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
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Inicio
          </Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ecuación Contable</CardTitle>
          <CardDescription>Activo = Pasivo + Capital</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium">Activo</span>
              <span className="text-2xl font-bold">{formatCurrency(activos)}</span>
            </div>
            <div className="text-2xl font-bold">=</div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium">Pasivo</span>
              <span className="text-2xl font-bold">{formatCurrency(pasivos)}</span>
            </div>
            <div className="text-2xl font-bold">+</div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium">Capital</span>
              <span className="text-2xl font-bold">{formatCurrency(capital)}</span>
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            {equation ? (
              <Badge variant="outline" className="gap-1 py-1 border-green-500 text-green-600">
                <CheckCircle className="h-4 w-4" />
                La ecuación contable está balanceada
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 py-1 border-red-500 text-red-600">
                <XCircle className="h-4 w-4" />
                La ecuación contable NO está balanceada
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as AccountType | "todos")}
        className="w-full"
      >
        <ScrollArea className="w-full">
          <div className="p-1">
            <TabsList className="mb-4 grid grid-cols-3 md:flex md:w-auto">
              <TabsTrigger value="activo">Activo</TabsTrigger>
              <TabsTrigger value="pasivo">Pasivo</TabsTrigger>
              <TabsTrigger value="capital">Capital</TabsTrigger>
            </TabsList>
          </div>
        </ScrollArea>
        
        <TabsContent value="activo" className="mt-4">
          {renderAccountsBySubcategory("activo")}
        </TabsContent>
        
        <TabsContent value="pasivo" className="mt-4">
          {renderAccountsBySubcategory("pasivo")}
        </TabsContent>
        
        <TabsContent value="capital" className="mt-4">
          {renderAccountsBySubcategory("capital")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
