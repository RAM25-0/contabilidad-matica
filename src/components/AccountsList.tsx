
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
  Trash2,
  DollarSign,
  ShoppingBag
} from "lucide-react";
import { useAccounting } from "@/contexts/AccountingContext";
import { Account, AccountType } from "@/types/accounting";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    { value: "ingreso", label: "Ingresos", icon: <DollarSign className="h-4 w-4" /> },
    { value: "gasto", label: "Egresos", icon: <Receipt className="h-4 w-4" /> },
  ];

  const getIconForType = (type: AccountType): React.ReactNode => {
    switch (type) {
      case "activo":
        return <Wallet className="h-5 w-5 text-emerald-600" />;
      case "pasivo":
        return <Landmark className="h-5 w-5 text-rose-600" />;
      case "capital":
        return <BarChart3 className="h-5 w-5 text-indigo-600" />;
      case "ingreso":
        return <DollarSign className="h-5 w-5 text-amber-600" />;
      case "gasto":
        return <Receipt className="h-5 w-5 text-violet-600" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-600" />;
    }
  };

  const getColorForType = (type: AccountType): string => {
    switch (type) {
      case "activo":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pasivo":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "capital":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "ingreso":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "gasto":
        return "bg-violet-50 text-violet-700 border-violet-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTextColorForType = (type: AccountType): string => {
    switch (type) {
      case "activo":
        return "text-emerald-700";
      case "pasivo":
        return "text-rose-700";
      case "capital":
        return "text-indigo-700";
      case "ingreso":
        return "text-amber-700";
      case "gasto":
        return "text-violet-700";
      default:
        return "text-gray-700";
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

        <TabsContent value="todos" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Listado Completo de Cuentas</CardTitle>
              <CardDescription>Vista compacta de todas las cuentas del catálogo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Tipo</TableHead>
                      <TableHead className="w-[200px]">Nombre</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead className="w-[100px] text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                          No hay cuentas en esta categoría. Crea una nueva cuenta.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={`${getColorForType(account.type)}`}
                            >
                              {getIconForType(account.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className={`font-medium ${getTextColorForType(account.type)}`}>
                            {account.name}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-medium ${
                              account.balance > 0 ? "text-emerald-700" : 
                              account.balance < 0 ? "text-rose-700" : "text-slate-500"
                            }`}>
                              {formatCurrency(account.balance)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setActiveAccount(account)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive"
                                onClick={() => deleteAccount(account.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {accountTypes.filter(type => type.value !== "todos").map((type) => (
          <TabsContent key={type.value} value={type.value} className="mt-0">
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
                      <CardDescription className="flex items-center justify-end">
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
                          account.balance > 0 ? "text-emerald-700" : 
                          account.balance < 0 ? "text-rose-700" : ""
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
        ))}
      </Tabs>
    </div>
  );
}
