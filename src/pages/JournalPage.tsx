
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionsList } from "@/components/TransactionsList";

export default function JournalPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Libro Diario</h1>
        <p className="text-muted-foreground">
          Registra y consulta las transacciones en el libro diario contable.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div>
          <TransactionForm />
        </div>
        <div>
          <TransactionsList />
        </div>
      </div>
    </div>
  );
}
