
import React from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import AccountsList from "@/components/AccountsList";
import { AccountForm } from "@/components/AccountForm";
import { useAccounting } from "@/contexts/AccountingContext";
import { ProfileBadge } from "@/components/profile/ProfileBadge";

export function CatalogPage() {
  const { setActiveAccount } = useAccounting();

  const handleCreateAccount = () => {
    setActiveAccount({ 
      id: "", 
      name: "", 
      code: "",
      type: "activo", 
      nature: "deudora", 
      balance: 0 
    });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <h1 className="text-lg font-semibold">Catálogo de Cuentas</h1>
          <div className="ml-auto">
            <ProfileBadge />
          </div>
        </header>
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Catálogo de Cuentas</h1>
              <p className="text-muted-foreground">
                Administra las cuentas contables de tu empresa
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleCreateAccount}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Cuenta
              </Button>
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Panel Principal
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <AccountsList />
          </div>
        </main>
      </div>
      <AccountForm />
    </div>
  );
}
