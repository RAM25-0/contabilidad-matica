
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useAccounting } from "@/contexts/AccountingContext";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { PenLine } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
  accountId: z.string().min(1, "Selecciona una cuenta"),
  operation: z.enum(["cargo", "abono"]),
  amount: z.number().min(0.01, "El monto debe ser mayor a cero"),
  secondAccountId: z.string().min(1, "Selecciona la cuenta de contrapartida"),
});

type FormData = z.infer<typeof formSchema>;

export function SimpleTransactionForm() {
  const [open, setOpen] = useState(false);
  const { state, addTransaction } = useAccounting();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      accountId: "",
      operation: "cargo",
      amount: 0,
      secondAccountId: "",
    },
  });
  
  const resetForm = () => {
    form.reset({
      description: "",
      accountId: "",
      operation: "cargo",
      amount: 0,
      secondAccountId: "",
    });
  };
  
  const onSubmit = (data: FormData) => {
    const { description, accountId, operation, amount, secondAccountId } = data;
    
    // Obtenemos las cuentas seleccionadas
    const mainAccount = state.accounts.find(a => a.id === accountId);
    const secondAccount = state.accounts.find(a => a.id === secondAccountId);
    
    if (!mainAccount || !secondAccount) {
      toast({
        title: "Error",
        description: "No se encontraron las cuentas seleccionadas",
        variant: "destructive",
      });
      return;
    }
    
    // Preparamos las entradas según la operación seleccionada
    const entries = [
      {
        id: uuidv4(),
        accountId: mainAccount.id,
        accountName: mainAccount.name,
        accountType: mainAccount.type,
        debit: operation === "cargo" ? amount : 0,
        credit: operation === "abono" ? amount : 0,
      },
      {
        id: uuidv4(),
        accountId: secondAccount.id,
        accountName: secondAccount.name,
        accountType: secondAccount.type,
        debit: operation === "abono" ? amount : 0,
        credit: operation === "cargo" ? amount : 0,
      },
    ];
    
    // Registramos la transacción
    addTransaction({
      date: new Date(),
      description,
      entries,
    });
    
    toast({
      title: "Transacción registrada",
      description: "La transacción ha sido registrada exitosamente.",
    });
    
    setOpen(false);
    resetForm();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PenLine className="h-4 w-4" />
          Transacción Simple
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar transacción simple</DialogTitle>
          <DialogDescription>
            Ingresa los detalles de manera rápida y directa.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe brevemente esta transacción..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuenta principal</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cuenta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {state.accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.code})
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
                name="secondAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuenta de contrapartida</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cuenta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {state.accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="operation"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de operación</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cargo" />
                        </FormControl>
                        <FormLabel className="cursor-pointer">Cargar (Debe)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="abono" />
                        </FormControl>
                        <FormLabel className="cursor-pointer">Abonar (Haber)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Registrar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
