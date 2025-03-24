
import React from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AccountsList from "@/components/AccountsList";

export function CatalogPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <h1 className="text-lg font-semibold">Catálogo de Cuentas</h1>
        </header>
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Catálogo de Cuentas</h1>
              <p className="text-muted-foreground">
                Administra las cuentas contables de tu empresa
              </p>
            </div>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Panel Principal
              </Button>
            </Link>
          </div>

          <div className="grid gap-6">
            <AccountsList />
          </div>
        </main>
      </div>
    </div>
  );
}
