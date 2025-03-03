
import React, { useState, useEffect } from "react";
import { useAccounting } from "@/contexts/AccountingContext";
import { JournalHeader } from "@/components/journal/JournalHeader";
import { JournalTabs } from "@/components/journal/JournalTabs";
import { JournalLayout } from "@/components/journal/JournalLayout";
import { JournalList } from "@/components/journal/JournalList";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export default function JournalPage() {
  const { state } = useAccounting();
  const [activeTab, setActiveTab] = useState("register");

  // Log transactions to console for debugging
  useEffect(() => {
    console.info("Journal Page - Current transactions:", state.transactions.length);
    
    // Verificar si hay transacciones almacenadas
    if (state.transactions.length > 0) {
      toast({
        title: "Transacciones cargadas",
        description: `Se han cargado ${state.transactions.length} transacciones en el libro diario.`,
        variant: "default",
      });
    }
  }, []);

  return (
    <JournalLayout>
      <JournalHeader />
      <JournalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "history" && (
        <div className="mt-4">
          <JournalList />
        </div>
      )}
      
      {activeTab === "history" && state.transactions.length === 0 && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-2">No hay transacciones registradas en el libro diario.</p>
              <p>Puedes registrar una nueva transacción desde la pestaña "Registrar Transacción".</p>
            </div>
          </CardContent>
        </Card>
      )}
    </JournalLayout>
  );
}
