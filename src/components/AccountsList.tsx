
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
  ShoppingBag,
  CircleDollarSign,
  Building,
  Clock,
  Banknote
} from "lucide-react";
import { useAccounting } from "@/contexts/AccountingContext";
import { Account, AccountSubcategory, AccountType } from "@/types/accounting";
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

  const getIconForType = (type: AccountType, subcategory?: AccountSubcategory): React.ReactNode => {
    if (type === "activo") {
      if (subcategory === "circulante") return <CircleDollarSign className="h-5 w-5 text-emerald-600" />;
      if (subcategory === "fijo") return <Building className="h-5 w-5 text-emerald-700" />;
      if (subcategory === "diferido") return <Clock className="h-5 w-5 text-cyan-600" />;
      return <Wallet className="h-5 w-5 text-emerald-600" />;
    } else if (type === "pasivo") {
      return <Landmark className="h-5 w-5 text-rose-600" />;
    } else if (type === "capital") {
      return <BarChart3 className="h-5 w-5 text-indigo-600" />;
    } else if (type === "ingreso") {
      return <DollarSign className="h-5 w-5 text-amber-600" />;
    } else if (type === "gasto") {
      return <Receipt className="h-5 w-5 text-violet-600" />;
    } else {
      return <ShoppingBag className="h-5 w-5 text-gray-600" />;
    }
  };

  const getColorForType = (type: AccountType, subcategory?: AccountSubcategory): string => {
    switch (type) {
      case "activo":
        if (subcategory === "circulante") return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (subcategory === "fijo") return "bg-teal-50 text-teal-700 border-teal-200";
        if (subcategory === "diferido") return "bg-cyan-50 text-cyan-700 border-cyan-200";
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

  const getTextColorForType = (type: AccountType, subcategory?: AccountSubcategory): string => {
    switch (type) {
      case "activo":
        if (subcategory === "circulante") return "text-emerald-700";
        if (subcategory === "fijo") return "text-teal-700";
        if (subcategory === "diferido") return "text-cyan-700";
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

  const getSubcategoryLabel = (subcategory?: AccountSubcategory): string => {
    if (!subcategory || subcategory === "none") return "";
    
    const labels: Record<AccountSubcategory, string> = {
      circulante: "Circulante",
      fijo: "Fijo",
      diferido: "No Circulante",
      corto_plazo: "Corto Plazo",
      largo_plazo: "Largo Plazo",
      contribuido: "Contribuido",
      ganado: "Ganado",
      operativos: "Operativos",
      no_operativos: "No Operativos",
      operativos_admin: "Operativos (Admin)",
      operativos_venta: "Operativos (Ventas)",
      financieros: "Financieros",
      otros: "Otros",
      none: ""
    };
    
    return labels[subcategory];
  };

  const handleTabChange = (value: string) => {
    filterAccounts(value as AccountType | "todos");
  };

  const groupAccountsBySubcategory = (accounts: Account[]) => {
    const grouped: Record<string, Account[]> = {};
    
    accounts.forEach(account => {
      const key = account.subcategory || "none";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(account);
    });
    
    return grouped;
  };

  const filteredAccounts = state.selectedAccountType === "todos"
    ? state.accounts
    : state.accounts.filter(account => account.type === state.selectedAccountType);

  const groupedAccounts = groupAccountsBySubcategory(filteredAccounts);

  // Define el orden para mostrar las subcategorías
  const subcategoryOrder: AccountSubcategory[] = ["circulante", "fijo", "diferido", "corto_plazo", "largo_plazo", "contribuido", "ganado", "operativos", "no_operativos", "operativos_admin", "operativos_venta", "financieros", "otros", "none"];

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
                      <TableHead className="w-[120px]">Categoría</TableHead>
                      <TableHead className="w-[200px]">Nombre</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead className="w-[100px] text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No hay cuentas en esta categoría. Crea una nueva cuenta.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={`${getColorForType(account.type, account.subcategory)}`}
                            >
                              {getIconForType(account.type, account.subcategory)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {account.subcategory && account.subcategory !== "none" && (
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                                {getSubcategoryLabel(account.subcategory)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className={`font-medium ${getTextColorForType(account.type, account.subcategory)}`}>
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
            {Object.keys(groupedAccounts).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay cuentas en esta categoría. Crea una nueva cuenta.
              </p>
            ) : (
              subcategoryOrder.map(subcategory => {
                const accounts = groupedAccounts[subcategory] || [];
                if (accounts.length === 0) return null;
                
                return (
                  <div key={subcategory} className="mb-6">
                    {subcategory !== "none" && (
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-semibold">
                          {getSubcategoryLabel(subcategory)}
                        </h3>
                        <div className="h-px flex-1 bg-gray-200 ml-3"></div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {accounts.map(account => (
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
                                className={`${getColorForType(account.type, account.subcategory)}`}
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
                              {getIconForType(account.type, account.subcategory)}
                              <span className="truncate">{account.name}</span>
                            </CardTitle>
                            <CardDescription className="flex items-center justify-between">
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
                                {account.code}
                              </span>
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
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
