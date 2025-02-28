
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Landmark, 
  Wallet, 
  BarChart3, 
  Receipt, 
  Plus, 
  Pencil, 
  Trash2 
} from "lucide-react";
import { useAccounting } from "@/contexts/AccountingContext";
import { Account, AccountType } from "@/types/accounting";
import { formatCurrency } from "@/lib/utils";

export default function AccountsList() {
  const { 
    state, 
    setActiveAccount, 
    deleteAccount, 
    getTypeLabel, 
    filterAccounts 
  } = useAccounting();

  const accountTypes: { value: AccountType | "todos"; label: string; icon: React.ReactNode }[] = [
    { value: "todos", label: "Todos", icon: <CreditCard className="h-4 w-4" /> },
    { value: "activo", label: "Activos", icon: <Wallet className="h-4 w-4" /> },
    { value: "pasivo", label: "Pasivos", icon: <Landmark className="h-4 w-4" /> },
    { value: "capital", label: "Capital", icon: <BarChart3 className="h-4 w-4" /> },
    { value: "ingreso", label: "Ingresos", icon: <Receipt className="h-4 w-4 rotate-180" /> },
    { value: "gasto", label: "Gastos", icon: <Receipt className="h-4 w-4" /> },
  ];

  const getIconForType = (type: AccountType): React.ReactNode => {
    switch (type) {
      case "activo":
        return <Wallet className="h-5 w-5 text-green-600" />;
      case "pasivo":
        return <Landmark className="h-5 w-5 text-red-600" />;
      case "capital":
        return <BarChart3 className="h-5 w-5 text-purple-600" />;
      case "ingreso":
        return <Receipt className="h-5 w-5 text-blue-600 rotate-180" />;
      case "gasto":
        return <Receipt className="h-5 w-5 text-orange-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  const getColorForType = (type: AccountType): string => {
    switch (type) {
      case "activo":
        return "bg-green-50 text-green-700 border-green-200";
      case "pasivo":
        return "bg-red-50 text-red-700 border-red-200";
      case "capital":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "ingreso":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "gasto":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleTabChange = (value: string) => {
    filterAccounts(value as AccountType | "todos");
  };

  const filteredAccounts = state.selectedAccountType === "todos"
    ? state.accounts
    : state.accounts.filter(account => account.type === state.selectedAccountType);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Catálogo de Cuentas</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setActiveAccount({ 
            id: "", 
            name: "", 
            code: "", 
            type: "activo", 
            nature: "deudora", 
            balance: 0 
          })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cuenta
        </Button>
      </div>
      
      <Tabs 
        defaultValue="todos" 
        value={state.selectedAccountType} 
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <TabsList className="mb-4 w-full grid grid-cols-3 md:grid-cols-6">
          {accountTypes.map((type) => (
            <TabsTrigger 
              key={type.value} 
              value={type.value} 
              className="flex items-center gap-1.5"
            >
              {type.icon}
              <span className="hidden sm:inline">{type.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={state.selectedAccountType} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No hay cuentas en esta categoría. Crea una nueva cuenta.
              </p>
            ) : (
              filteredAccounts.map((account) => (
                <Card 
                  key={account.id} 
                  className={`account-card overflow-hidden border hover-scale ${
                    account.balance !== 0 ? "border-gray-300" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge 
                        variant="secondary" 
                        className={`${getColorForType(account.type)}`}
                      >
                        {getTypeLabel(account.type)}
                      </Badge>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => setActiveAccount(account)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive"
                          onClick={() => deleteAccount(account.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getIconForType(account.type)}
                      <span className="truncate">{account.name}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      <span>Código: {account.code}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
                        {account.nature === "deudora" ? "Deudora" : "Acreedora"}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {account.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {account.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="bg-muted/50 py-2">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm">Saldo:</span>
                      <span className={`font-medium ${
                        account.balance > 0 ? "text-green-700" : 
                        account.balance < 0 ? "text-red-700" : ""
                      }`}>
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
