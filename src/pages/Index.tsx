
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AccountsList from "@/components/AccountsList";
import { AccountForm } from "@/components/AccountForm";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionsList } from "@/components/TransactionsList";
import { AccountingSummary } from "@/components/AccountingSummary";
import { AccountingProvider, useAccounting } from "@/contexts/AccountingContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpen, PieChart, LayoutDashboard } from "lucide-react";

// Inner component to access context
const IndexContent = () => {
  const { state } = useAccounting();
  
  useEffect(() => {
    console.info("Index Page - Current transactions:", state.transactions.length);
  }, [state.transactions]);
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contabilidad Mática</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Sistema de contabilidad que sigue la ecuación A = P + C
        </p>
      </header>
      
      <AccountingSummary />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Sistema Contable</h2>
        <div className="flex gap-2">
          <Link to="/diario">
            <Button className="gap-2">
              <BookOpen className="h-4 w-4" />
              Ir al Libro Diario
            </Button>
          </Link>
          <Link to="/mayor">
            <Button variant="secondary" className="gap-2 bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white hover:from-blue-600 hover:to-purple-600">
              <PieChart className="h-4 w-4" />
              Ir al Libro Mayor
            </Button>
          </Link>
        </div>
      </div>
      
      <p className="text-muted-foreground mt-1 mb-6">
        Gestiona tus cuentas contables y registra transacciones
      </p>
      
      {/* Formulario de transacción */}
      <TransactionForm onTransactionSuccess={() => {
        console.info("Transaction successfully registered from Index page");
      }} />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8 mt-8">
        <div>
          <AccountsList />
          <AccountForm />
        </div>
        
        <div>
          <TransactionsList limit={5} />
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AccountingProvider>
      <IndexContent />
    </AccountingProvider>
  );
};

export default Index;
