import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccounting } from "@/contexts/AccountingContext";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { isTransactionBalanced } from "@/utils/accounting-utils";
import { TransactionHeader } from "./transaction/TransactionHeader";
import { TransactionEntries } from "./transaction/TransactionEntries";
import { TransactionBalance } from "./transaction/TransactionBalance";
import { formSchema, FormData, defaultValues } from "./transaction/TransactionFormTypes";

export function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const { state, addTransaction } = useAccounting();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const entries = form.watch("entries");
  
  const totalCargo = entries
    .filter(entry => entry.type === "cargo")
    .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  
  const totalAbono = entries
    .filter(entry => entry.type === "abono")
    .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  
  const isBalanced = Math.abs(totalCargo - totalAbono) < 0.001;
  
  const onSubmit = (data: FormData) => {
    try {
      // Transformar las entradas al formato esperado por la función addTransaction
      const transactionEntries = data.entries.map(entry => {
        const account = state.accounts.find(a => a.id === entry.accountId);
        if (!account) throw new Error("Cuenta no encontrada");
        
        return {
          id: uuidv4(),
          accountId: entry.accountId,
          accountName: account.name,
          accountType: account.type,
          debit: entry.type === "cargo" ? entry.amount : 0,
          credit: entry.type === "abono" ? entry.amount : 0,
        };
      });
      
      // Añadir la transacción al contexto (esto actualizará el estado global)
      addTransaction({
        date: data.date,
        description: data.description,
        entries: transactionEntries,
      });
      
      // Notificar al usuario
      toast({
        title: "Transacción registrada",
        description: "La transacción ha sido registrada exitosamente y está disponible en todos los módulos.",
        variant: "default",
      });
      
      // Limpiar el formulario
      form.reset(defaultValues);
      
      // Registrar en consola para depuración
      console.log("Transacción guardada exitosamente:", {
        date: data.date,
        description: data.description,
        entries: transactionEntries,
      });
      
      // Call onSuccess callback
      onSuccess();
    } catch (error) {
      console.error("Error al guardar la transacción:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar la transacción. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="animate-fade-in shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Nueva Transacción</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <TransactionHeader form={form} />
            
            <TransactionEntries form={form} />
            
            <div className="flex justify-between items-center">
              <div>
                {/* Space reserved for future elements */}
              </div>
              
              <TransactionBalance 
                totalCargo={totalCargo}
                totalAbono={totalAbono}
                isBalanced={isBalanced}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!isBalanced} 
                className="px-4 py-2"
              >
                Registrar transacción
              </Button>
            </div>
            
            {form.formState.errors.entries?.message && (
              <p className="text-sm font-medium text-destructive text-center">
                {form.formState.errors.entries.message}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
