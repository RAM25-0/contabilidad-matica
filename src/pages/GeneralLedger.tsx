
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAccounting } from "@/contexts/AccountingContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TAccount } from "@/components/TAccount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccountType } from "@/types/accounting";
import { getAccountMovements } from "@/utils/accounting-utils";

export function GeneralLedger() {
  const { state } = useAccounting();
  
  // Group accounts by type
  const accountsByType = useMemo(() => {
    const types: Record<AccountType, typeof state.accounts> = {
      activo: [],
      pasivo: [],
      capital: [],
      ingreso: [],
      gasto: []
    };
    
    state.accounts.forEach(account => {
      types[account.type].push(account);
    });
    
    return types;
  }, [state.accounts]);
  
  // Get all account movements from transactions
  const accountMovements = useMemo(() => {
    const movements: Record<string, ReturnType<typeof getAccountMovements>> = {};
    
    state.accounts.forEach(account => {
      movements[account.id] = getAccountMovements(account.id, state.transactions);
    });
    
    return movements;
  }, [state.accounts, state.transactions]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Libro Mayor</h1>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel Principal
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="activo" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="activo">Activos</TabsTrigger>
          <TabsTrigger value="pasivo">Pasivos</TabsTrigger>
          <TabsTrigger value="capital">Capital</TabsTrigger>
          <TabsTrigger value="ingreso">Ingresos</TabsTrigger>
          <TabsTrigger value="gasto">Gastos</TabsTrigger>
        </TabsList>
        
        {(["activo", "pasivo", "capital", "ingreso", "gasto"] as AccountType[]).map(type => (
          <TabsContent key={type} value={type} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{type}s</CardTitle>
              </CardHeader>
              <CardContent>
                {accountsByType[type].length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No hay cuentas de {type} registradas
                  </p>
                ) : (
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {accountsByType[type].map(account => (
                        <div key={account.id} className="break-inside-avoid">
                          <Link to={`/ledger/${account.id}`} className="block">
                            <TAccount 
                              account={account} 
                              movements={accountMovements[account.id]} 
                              colors={{
                                border: getAccountColorsByType(type).border,
                                bg: getAccountColorsByType(type).bg,
                                text: "text-foreground",
                                title: "text-foreground",
                                header: ""
                              }}
                            />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Helper function to get colors based on account type
function getAccountColorsByType(type: AccountType) {
  switch (type) {
    case "activo":
      return { border: "border-blue-200", bg: "bg-blue-50/50" };
    case "pasivo":
      return { border: "border-purple-200", bg: "bg-purple-50/50" };
    case "capital":
      return { border: "border-green-200", bg: "bg-green-50/50" };
    case "ingreso":
      return { border: "border-emerald-200", bg: "bg-emerald-50/50" };
    case "gasto":
      return { border: "border-amber-200", bg: "bg-amber-50/50" };
    default:
      return { border: "", bg: "" };
  }
}
