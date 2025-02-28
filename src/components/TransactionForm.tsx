
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAccounting } from "@/contexts/AccountingContext";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { formatCurrency } from "@/lib/utils";

const formSchema = z.object({
  description: z.string().min(3, "La descripción debe tener al menos 3 caracteres."),
  entries: z.array(
    z.object({
      accountId: z.string().min(1, "La cuenta es requerida."),
      type: z.enum(["cargo", "abono"]),
      amount: z.number().min(0.01, "El valor debe ser mayor a cero."),
    })
  ).refine(entries => entries.length >= 2, {
    message: "Debes agregar al menos dos asientos contables.",
  }).refine(entries => {
    const totalCargo = entries
      .filter(entry => entry.type === "cargo")
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const totalAbono = entries
      .filter(entry => entry.type === "abono")
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    return Math.abs(totalCargo - totalAbono) < 0.001; // Tolerancia para errores de punto flotante
  }, {
    message: "Los cargos deben ser iguales a los abonos.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function TransactionForm() {
  const { state, addTransaction } = useAccounting();
  
  const defaultValues: FormData = {
    description: "",
    entries: [
      { accountId: "", type: "cargo", amount: 0 },
      { accountId: "", type: "abono", amount: 0 },
    ],
  };
  
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
  
  const difference = totalCargo - totalAbono;
  const isBalanced = Math.abs(difference) < 0.001;
  
  const onSubmit = (data: FormData) => {
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
    
    addTransaction({
      date: new Date(),
      description: data.description,
      entries: transactionEntries,
    });
    
    toast({
      title: "Transacción registrada",
      description: "La transacción ha sido registrada exitosamente.",
    });
    
    form.reset(defaultValues);
  };
  
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
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-2xl">Nueva Transacción</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe la transacción" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div key={index} className="grid grid-cols-[1fr,1fr,1fr,auto] gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`entries.${index}.accountId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuenta</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {state.accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`entries.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cargo">Cargo</SelectItem>
                            <SelectItem value="abono">Abono</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`entries.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            value={field.value === 0 ? "" : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => removeEntry(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={addEntry}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar entrada
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between gap-4">
                  <span>Total Cargo:</span>
                  <span className={isBalanced ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(totalCargo)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Total Abono:</span>
                  <span className={isBalanced ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(totalAbono)}
                  </span>
                </div>
                {!isBalanced && (
                  <div className="flex justify-between gap-4 font-semibold">
                    <span>Diferencia:</span>
                    <span className="text-red-600">
                      {formatCurrency(Math.abs(difference))}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!isBalanced} 
                className="px-6 py-5 text-lg"
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
