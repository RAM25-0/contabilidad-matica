
import React from "react";
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

export default function AccountsList() {
  const { 
    state, 
    setActiveAccount, 
    deleteAccount, 
    getTypeLabel, 
    filterAccounts 
  } = useAccounting();

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
  const subcategoryOrder: AccountSubcategory[] = [
    "circulante", "fijo", "diferido", 
    "corto_plazo", "largo_plazo", 
    "contribuido", "ganado", 
    "operativos", "no_operativos", 
    "operativos_admin", "operativos_venta", 
    "financieros", "otros", "none"
  ];

  // Renderiza el contenido para la pestaña "todos"
  const renderAllAccountsContent = () => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Listado Completo de Cuentas</CardTitle>
        <CardDescription>Vista compacta de todas las cuentas del catálogo</CardDescription>
      </CardHeader>
      <CardContent>
        <AccountsTable 
          accounts={filteredAccounts} 
          onEdit={setActiveAccount} 
          onDelete={deleteAccount} 
        />
      </CardContent>
    </Card>
  );

  // Renderiza el contenido para las pestañas de tipos específicos
  const renderTypeAccountsContent = () => {
    if (Object.keys(groupedAccounts).length === 0) {
      return (
        <p className="text-muted-foreground text-center py-8">
          No hay cuentas en esta categoría. Crea una nueva cuenta.
        </p>
      );
    }

    return (
      <>
        {subcategoryOrder.map(subcategory => {
          const accounts = groupedAccounts[subcategory] || [];
          return (
            <AccountsSubcategoryGroup
              key={subcategory}
              subcategory={subcategory}
              accounts={accounts}
              onEdit={setActiveAccount}
              onDelete={deleteAccount}
              getTypeLabel={getTypeLabel}
            />
          );
        })}
      </>
    );
  };

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
