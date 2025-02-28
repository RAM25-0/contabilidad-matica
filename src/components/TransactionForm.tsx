
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
import { X, Plus, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAccounting } from "@/contexts/AccountingContext";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { formatCurrency } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AccountBadge, getTextColorForType, getBgColorForType } from "@/components/accounts/AccountBadge";

const formSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida.",
  }),
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
    date: new Date(),
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
      });
      
      // Limpiar el formulario
      form.reset(defaultValues);
      
      // Registrar en consola para depuración
      console.log("Transacción guardada exitosamente:", {
        date: data.date,
        description: data.description,
        entries: transactionEntries,
      });
    } catch (error) {
      console.error("Error al guardar la transacción:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar la transacción. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    }
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
    <Card className="animate-fade-in shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Nueva Transacción</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal h-9"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe la transacción" 
                        className="resize-none h-9 py-2" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {entries.map((entry, index) => (
                <div key={index} className="grid grid-cols-[1fr,auto,1fr,auto] gap-2 items-center">
                  <FormField
                    control={form.control}
                    name={`entries.${index}.accountId`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="sr-only">Cuenta</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Selecciona cuenta" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {state.accounts.map((account) => {
                              const textColor = getTextColorForType(account.type, account.subcategory);
                              const bgColor = getBgColorForType(account.type, account.subcategory);
                              
                              return (
                                <SelectItem 
                                  key={account.id} 
                                  value={account.id}
                                  className={`${textColor} ${bgColor} rounded my-1`}
                                >
                                  {account.name}
                                </SelectItem>
                              );
                            })}
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
                      <FormItem className="space-y-1">
                        <FormLabel className="sr-only">Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-24 h-9">
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cargo" className="text-blue-600 bg-blue-50 rounded my-1">Cargo</SelectItem>
                            <SelectItem value="abono" className="text-indigo-600 bg-indigo-50 rounded my-1">Abono</SelectItem>
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
                      <FormItem className="space-y-1">
                        <FormLabel className="sr-only">Monto</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Monto"
                            className="h-9"
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
                    className="rounded-full h-8 w-8"
                    onClick={() => removeEntry(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={addEntry}
                className="gap-1 h-8 text-sm"
              >
                <Plus className="h-3 w-3" />
                Agregar entrada
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between gap-4">
                  <span>Cargo:</span>
                  <span className={isBalanced ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(totalCargo)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Abono:</span>
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
