import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useAccounting } from "@/contexts/AccountingContext";
import { ScheduledPayment, PaymentFrequency } from "@/types/scheduled-payment";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const entrySchema = z.object({
  accountId: z.string().min(1, "Selecciona una cuenta"),
  type: z.enum(["cargo", "abono"]),
  amount: z.number().min(0.01, "El monto debe ser mayor a 0"),
});

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  frequency: z.enum(["once", "weekly", "biweekly", "monthly", "quarterly", "yearly"]),
  startDate: z.date({ required_error: "La fecha de inicio es requerida" }),
  endDate: z.date().optional(),
  entries: z.array(entrySchema).min(2, "Debe tener al menos 2 entradas"),
  description: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const frequencyLabels: Record<PaymentFrequency, string> = {
  once: "Una sola vez",
  weekly: "Semanal",
  biweekly: "Quincenal",
  monthly: "Mensual",
  quarterly: "Trimestral",
  yearly: "Anual",
};

interface PaymentFormProps {
  onSave: (payment: ScheduledPayment) => void;
}

export function PaymentForm({ onSave }: PaymentFormProps) {
  const [open, setOpen] = React.useState(false);
  const { state } = useAccounting();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      frequency: "monthly",
      description: "",
      entries: [
        { accountId: "", type: "cargo", amount: 0 },
        { accountId: "", type: "abono", amount: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  const entries = form.watch("entries");

  const totalCargos = entries
    .filter((e) => e.type === "cargo")
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  
  const totalAbonos = entries
    .filter((e) => e.type === "abono")
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const isBalanced = Math.abs(totalCargos - totalAbonos) < 0.01;

  const addEntry = () => {
    append({ accountId: "", type: "cargo", amount: 0 });
  };

  const removeEntry = (index: number) => {
    if (fields.length <= 2) {
      toast({
        title: "Error",
        description: "Debe tener al menos 2 entradas contables.",
        variant: "destructive",
      });
      return;
    }
    remove(index);
  };

  const onSubmit = (data: FormData) => {
    if (!isBalanced) {
      toast({
        title: "Error",
        description: "Los cargos y abonos deben estar balanceados.",
        variant: "destructive",
      });
      return;
    }

    const payment: ScheduledPayment = {
      id: uuidv4(),
      name: data.name,
      frequency: data.frequency,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate?.toISOString(),
      entries: data.entries.map((e) => ({
        accountId: e.accountId!,
        type: e.type!,
        amount: e.amount!,
      })),
      description: data.description,
      isActive: true,
    };
    onSave(payment);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Pago Programado
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Programar Nuevo Pago</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del pago</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Pago de electricidad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona frecuencia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(frequencyLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar</span>
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
                          locale={es}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha fin (opcional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Sin límite</span>
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
                          locale={es}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Entries Section */}
            <div className="space-y-3">
              <FormLabel>Entradas Contables</FormLabel>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <FormField
                      control={form.control}
                      name={`entries.${index}.accountId`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Cuenta" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {state.accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`entries.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cargo">Cargo</SelectItem>
                              <SelectItem value="abono">Abono</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`entries.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="w-28">
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Monto"
                              className="h-8 text-sm"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeEntry(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

              {/* Balance Summary */}
              <div className="flex justify-between text-sm p-2 rounded-md bg-muted">
                <div>
                  <span className="text-muted-foreground">Cargos: </span>
                  <span className="font-medium">${totalCargos.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Abonos: </span>
                  <span className="font-medium">${totalAbonos.toFixed(2)}</span>
                </div>
                <div className={cn(
                  "font-medium",
                  isBalanced ? "text-green-600" : "text-destructive"
                )}>
                  {isBalanced ? "✓ Balanceado" : "✗ Desbalanceado"}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción del pago..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!isBalanced}>
                Guardar Pago
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
