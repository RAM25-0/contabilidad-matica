
import React, { useEffect } from "react";
import AccountsList from "@/components/AccountsList";
import { AccountForm } from "@/components/AccountForm";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionsList } from "@/components/transactions/TransactionsList";
import { AccountingSummary } from "@/components/AccountingSummary";
import { AccountingProvider, useAccounting } from "@/contexts/AccountingContext";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { generateDemoTransactions } from "@/utils/demo-transactions";

const IndexContent = () => {
  const { state, addTransaction } = useAccounting();
  
  useEffect(() => {
    console.info("Sistema contable cargado - Transacciones disponibles:", state.transactions.length);
    
    // Mostrar notificación si hay transacciones cargadas
    if (state.transactions.length > 0) {
      toast({
        title: "Sistema contable iniciado",
        description: `Se han cargado ${state.transactions.length} transacciones existentes.`,
      });
    }
  }, []);
  
  const handleRunDemo = () => {
    if (state.transactions.length > 0) {
      if (!confirm("Ya existen transacciones en el sistema. ¿Desea agregar más transacciones de ejemplo?")) {
        return;
      }
    }
    
    generateDemoTransactions(state.accounts, addTransaction);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Sistema de Contabilidad</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Registro de transacciones siguiendo la ecuación contable A = P + C
        </p>
      </header>
      
      <AccountingSummary />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Sistema Contable</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleRunDemo}
          >
            <PlayCircle className="h-4 w-4" />
            Generar transacciones de ejemplo
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground mt-1 mb-6">
        Gestiona tus cuentas contables y registra transacciones
      </p>
      
      {/* Formulario de transacción */}
      <TransactionForm onSuccess={() => {
        console.log("Transaction registered successfully from Index page");
        toast({
          title: "Transacción registrada",
          description: "La transacción ha sido guardada exitosamente y está disponible en todos los módulos.",
        });
      }} />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8 mt-8">
        <div>
          <AccountsList />
          <AccountForm />
        </div>
        
        <div>
          <TransactionsList 
            limit={5} 
            showViewButton={true}
          />
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
