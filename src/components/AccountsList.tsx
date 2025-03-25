import React, { useState, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAccounting } from "@/contexts/AccountingContext";
import { Account, AccountSubcategory, AccountType } from "@/types/accounting";
import { AccountsTable } from "./accounts/AccountsTable";
import { AccountsTabs } from "./accounts/AccountsTabs";
import { AccountsSubcategoryGroup } from "./accounts/AccountsSubcategoryGroup";
import { AccountsCompactList } from "./accounts/AccountsCompactList";
import { getSubcategoryLabel } from "./accounts/AccountBadge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { SearchInput } from "./SearchInput";

export default function AccountsList() {
  const { 
    state, 
    setActiveAccount, 
    deleteAccount, 
    getTypeLabel, 
    filterAccounts 
  } = useAccounting();

  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (value: string) => {
    filterAccounts(value as AccountType | "todos");
  };

  const filteredAccounts = useMemo(() => {
    let accounts = state.selectedAccountType === "todos"
      ? state.accounts
      : state.accounts.filter(account => account.type === state.selectedAccountType);
      
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      accounts = accounts.filter(account => 
        account.name.toLowerCase().includes(query) || 
        (account.code && account.code.toLowerCase().includes(query))
      );
    }
    
    return accounts;
  }, [state.accounts, state.selectedAccountType, searchQuery]);

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

  const groupAccountsByType = (accounts: Account[]) => {
    const grouped: Record<string, Account[]> = {};
    
    accounts.forEach(account => {
      const key = account.type;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(account);
    });
    
    return grouped;
  };

  const groupedAccounts = state.selectedAccountType === "todos" 
    ? groupAccountsByType(filteredAccounts)
    : groupAccountsBySubcategory(filteredAccounts);

  const subcategoryOrder: AccountSubcategory[] = [
    "circulante", "fijo", "diferido", 
    "corto_plazo", "largo_plazo", 
    "contribuido", "ganado", 
    "operativos", "no_operativos", 
    "operativos_admin", "operativos_venta", 
    "financieros", "otros", "none"
  ];

  const typeOrder: AccountType[] = [
    "activo", "pasivo", "capital", "ingreso", "gasto"
  ];

  const renderAllAccountsContent = () => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Catálogo de Cuentas</CardTitle>
        <CardDescription>Resumen por tipo de cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Total Cuentas</TableHead>
                <TableHead className="text-right">Saldo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typeOrder.map(type => {
                const accounts = groupedAccounts[type] || [];
                if (accounts.length === 0) return null;
                
                const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
                
                return (
                  <TableRow key={type} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {getTypeLabel(type)}
                    </TableCell>
                    <TableCell>{accounts.length}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      totalBalance > 0 ? "text-emerald-700" : 
                      totalBalance < 0 ? "text-rose-700" : "text-slate-500"
                    }`}>
                      {formatCurrency(totalBalance)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderTypeAccountsContent = () => {
    if (Object.keys(groupedAccounts).length === 0) {
      return (
        <p className="text-muted-foreground text-center py-8">
          No hay cuentas que coincidan con tu búsqueda. Intenta con otro término o crea una nueva cuenta.
        </p>
      );
    }

    return (
      <>
        {subcategoryOrder.map(subcategory => {
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
              <AccountsCompactList 
                accounts={accounts} 
                onEdit={setActiveAccount} 
                onDelete={deleteAccount} 
              />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Catálogo de Cuentas</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchInput 
            placeholder="Buscar cuenta..." 
            value={searchQuery} 
            onChange={setSearchQuery}
            className="w-full sm:w-64"
          />
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
      </div>
      
      <AccountsTabs 
        selectedTab={state.selectedAccountType} 
        onTabChange={handleTabChange} 
      />
      
      {state.selectedAccountType === "todos" 
        ? renderAllAccountsContent() 
        : renderTypeAccountsContent()
      }
    </div>
  );
}
