
import React from "react";
import AccountsList from "@/components/AccountsList";
import { AccountForm } from "@/components/AccountForm";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionsList } from "@/components/TransactionsList";
import { AccountingSummary } from "@/components/AccountingSummary";
import { AccountingProvider } from "@/contexts/AccountingContext";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <AccountingProvider>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Contabilidad Mática</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Sistema de contabilidad que sigue la ecuación A = P + C
          </p>
        </header>
        
        <AccountingSummary />
        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold tracking-tight">Sistema Contable</h2>
        </div>
        
        <p className="text-muted-foreground mt-1 mb-6">
          Gestiona tus cuentas contables y registra transacciones
        </p>
        
        {/* Nueva posición del formulario de transacción */}
        <TransactionForm />
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8 mt-8">
          <div>
            <AccountsList />
            <AccountForm />
          </div>
          
          <div>
            <TransactionsList />
          </div>
        </div>
      </div>
    </AccountingProvider>
  );
};

export default Index;
