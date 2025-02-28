
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Trash2, Plus, ReceiptText } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAccounting } from "@/contexts/AccountingContext";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida.",
  }),
  description: z.string().min(3, "La descripción debe tener al menos 3 caracteres."),
  entries: z.array(
    z.object({
      accountId: z.string().min(1, "La cuenta es requerida."),
      debit: z.number().min(0, "El valor debe ser positivo o cero."),
      credit: z.number().min(0, "El valor debe ser positivo o cero."),
    })
  ).refine(entries => entries.length >= 2, {
    message: "Debes agregar al menos dos asientos contables.",
  }).refine(entries => {
    return Math.abs(
      entries.reduce((sum, entry) => sum + entry.debit, 0) -
      entries.reduce((sum, entry) => sum + entry.credit, 0)
    ) < 0.001; // Tolerancia para errores de punto flotante
  }, {
    message: "Los débitos deben ser iguales a los créditos.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function TransactionForm() {
  const [open, setOpen] = useState(false);
  const { state, addTransaction } = useAccounting();
  
  const defaultValues: FormData = {
    date: new Date(),
    description: "",
    entries: [
      { accountId: "", debit: 0, credit: 0 },
      { accountId: "", debit: 0, credit: 0 },
    ],
  };
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const entries = form.watch("entries");
  
  const totalDebits = entries.reduce((sum, entry) => sum + (Number(entry.debit) || 0), 0);
  const totalCredits = entries.reduce((sum, entry) => sum + (Number(entry.credit) || 0), 0);
  const difference = totalDebits - totalCredits;
  const isBalanced = Math.abs(difference) < 0.001;
  
  const onSubmit = (data: FormData) => {
    const formattedEntries = data.entries.map(entry => {
      const account = state.accounts.find(a => a.id === entry.accountId);
      if (!account) throw new Error("Cuenta no encontrada");
      
      return {
        ...entry,
        accountName: account.name,
        accountType: account.type,
      };
    });
    
    addTransaction({
      date: data.date,
      description: data.description,
      entries: formattedEntries,
    });
    
    toast({
      title: "Transacción registrada",
      description: "La transacción ha sido registrada exitosamente.",
    });
    
    setOpen(false);
    form.reset(defaultValues);
  };
  
  const addEntry = () => {
    const currentEntries = form.getValues("entries");
    form.setValue("entries", [
      ...currentEntries, 
      { accountId: "", debit: 0, credit: 0 }
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
  
  // Auto-balance suggestion
  const suggestBalance = () => {
    if (isBalanced) return;
    
    const currentEntries = form.getValues("entries");
    let nonZeroEntries = 0;
    let lastEmptyEntryIndex = -1;
    
    currentEntries.forEach((entry, index) => {
      if (entry.debit > 0 || entry.credit > 0) {
        nonZeroEntries++;
      } else if (entry.accountId && lastEmptyEntryIndex === -1) {
        lastEmptyEntryIndex = index;
      }
    });
    
    if (nonZeroEntries === 0 || lastEmptyEntryIndex === -1) {
      toast({
        title: "No se puede balancear",
        description: "Necesitas al menos una entrada con valores y una cuenta seleccionada sin valores para balancear.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedEntries = [...currentEntries];
    if (difference > 0) {
      // Más débitos que créditos, agregamos el faltante a créditos
      updatedEntries[lastEmptyEntryIndex].credit = difference;
      updatedEntries[lastEmptyEntryIndex].debit = 0;
    } else {
      // Más créditos que débitos, agregamos el faltante a débitos
      updatedEntries[lastEmptyEntryIndex].debit = Math.abs(difference);
      updatedEntries[lastEmptyEntryIndex].credit = 0;
    }
    
    form.setValue("entries", updatedEntries);
  };
  
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset(defaultValues);
    }
    setOpen(isOpen);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <ReceiptText className="h-4 w-4" />
          Nueva Transacción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Registrar nueva transacción</DialogTitle>
          <DialogDescription>
            Ingresa los detalles de la transacción contable.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccione fecha</span>
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
                      <Input placeholder="Ej: Pago a proveedores" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Asientos contables</h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={suggestBalance}
                    disabled={isBalanced}
                  >
                    Balancear
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEntry}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </div>
              
              <Card>
                <ScrollArea className="max-h-[300px]">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="grid grid-cols-[1fr,100px,100px,40px] gap-2 pb-1 border-b text-sm font-medium">
                        <div>Cuenta</div>
                        <div className="text-right">Debe</div>
                        <div className="text-right">Haber</div>
                        <div></div>
                      </div>
                      
                      {entries.map((entry, index) => (
                        <div key={index} className="grid grid-cols-[1fr,100px,100px,40px] gap-2 items-center">
                          <FormField
                            control={form.control}
                            name={`entries.${index}.accountId`}
                            render={({ field }) => (
                              <FormItem className="flex-1 space-y-0">
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <SelectTrigger className="h-9">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {state.accounts.map((account) => (
                                        <SelectItem key={account.id} value={account.id}>
                                          {account.name} ({account.code})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`entries.${index}.debit`}
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="text-right h-9"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                      // Si se ingresa un valor en Debe, limpiar el Haber
                                      if (Number(e.target.value) > 0) {
                                        form.setValue(`entries.${index}.credit`, 0);
                                      }
                                    }}
                                    value={field.value === 0 ? "" : field.value}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`entries.${index}.credit`}
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="text-right h-9"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                      // Si se ingresa un valor en Haber, limpiar el Debe
                                      if (Number(e.target.value) > 0) {
                                        form.setValue(`entries.${index}.debit`, 0);
                                      }
                                    }}
                                    value={field.value === 0 ? "" : field.value}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => removeEntry(index)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
              
              <div className="flex justify-between items-center mt-2 text-sm">
                <div>Totales</div>
                <div className="grid grid-cols-[100px,100px,40px] gap-2">
                  <div className={`text-right font-medium ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(totalDebits)}
                  </div>
                  <div className={`text-right font-medium ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(totalCredits)}
                  </div>
                  <div></div>
                </div>
              </div>
              
              {!isBalanced && (
                <div className="mt-1 text-sm text-red-600">
                  Diferencia: {formatCurrency(Math.abs(difference))}
                </div>
              )}
              
              <FormMessage>
                {form.formState.errors.entries?.message}
              </FormMessage>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!isBalanced}>
                Registrar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
