
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { TransactionEntryRow } from "./TransactionEntryRow";
import { FormData } from "./TransactionFormTypes";

interface TransactionEntriesProps {
  form: UseFormReturn<FormData>;
}

export function TransactionEntries({ form }: TransactionEntriesProps) {
  const entries = form.watch("entries");

  const addEntry = () => {
    const currentEntries = form.getValues("entries");
    form.setValue("entries", [
      ...currentEntries, 
      { accountId: "", type: "cargo", amount: 0 }
    ]);
  };
  
  const removeEntry = (index: number) => {
    const currentEntries = form.getValues("entries");
    if (currentEntries.length <= 2) {
      toast({
        title: "Error",
        description: "Una transacción debe tener al menos dos asientos contables.",
        variant: "destructive",
      });
      return;
    }
    
    const newEntries = currentEntries.filter((_, i) => i !== index);
    form.setValue("entries", newEntries);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {entries.map((_, index) => (
          <TransactionEntryRow 
            key={index} 
            index={index} 
            form={form} 
            removeEntry={removeEntry} 
          />
        ))}
      </div>
      
      <Button
        type="button"
        variant="outline"
        onClick={addEntry}
        className="gap-1 h-8 text-sm"
      >
        <Plus className="h-3 w-3" />
        Agregar entrada
      </Button>
    </div>
  );
}
