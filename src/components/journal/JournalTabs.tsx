
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionsList } from "@/components/transactions/TransactionsList";
import { JournalFilters } from "./JournalFilters";

interface JournalTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function JournalTabs({ activeTab, setActiveTab }: JournalTabsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined);
  const [isFiltering, setIsFiltering] = useState(false);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="register">Registrar Transacción</TabsTrigger>
        <TabsTrigger value="history">Historial de Transacciones</TabsTrigger>
      </TabsList>
      
      <TabsContent value="register" className="space-y-4">
        <TransactionForm onSuccess={() => setActiveTab("history")} />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4">
        <JournalFilters
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          isFiltering={isFiltering}
          setIsFiltering={setIsFiltering}
        />
        
        <TransactionsList 
          dateFilter={selectedDate}
          accountFilter={selectedAccount}
        />
      </TabsContent>
    </Tabs>
  );
}
