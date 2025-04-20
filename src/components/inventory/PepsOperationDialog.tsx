
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "./DatePickerField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PepsLot } from "@/types/peps-inventory";

interface PepsOperationDialogProps {
  type: 'SALDO_INICIAL' | 'COMPRA' | 'VENTA' | 'DEVOLUCION';
  onClose: () => void;
  onAddInitialBalance: (date: Date, units: number, unitCost: number, description: string) => void;
  onAddPurchase: (date: Date, lotName: string, units: number, unitCost: number, description: string) => void;
  onAddSale: (date: Date, units: number, description: string) => void;
  onAddReturn: (date: Date, lotId: string, units: number, description: string) => void;
  availableLots: PepsLot[];
}

// Form schemas for each operation type
const initialBalanceSchema = z.object({
  date: z.date(),
  units: z.coerce.number().positive("Las unidades deben ser mayores a 0"),
  unitCost: z.coerce.number().positive("El costo unitario debe ser mayor a 0"),
  description: z.string().default("Saldo Inicial"),
});

const purchaseSchema = z.object({
  date: z.date(),
  lotName: z.string().min(1, "El nombre del lote es requerido"),
  units: z.coerce.number().positive("Las unidades deben ser mayores a 0"),
  unitCost: z.coerce.number().positive("El costo unitario debe ser mayor a 0"),
  description: z.string().default(""),
});

const saleSchema = z.object({
  date: z.date(),
  units: z.coerce.number().positive("Las unidades deben ser mayores a 0"),
  description: z.string().default(""),
});

const returnSchema = z.object({
  date: z.date(),
  lotId: z.string().min(1, "Debe seleccionar un lote"),
  units: z.coerce.number().positive("Las unidades deben ser mayores a 0"),
  description: z.string().default(""),
});

export function PepsOperationDialog({
  type,
  onClose,
  onAddInitialBalance,
  onAddPurchase,
  onAddSale,
  onAddReturn,
  availableLots,
}: PepsOperationDialogProps) {
  let form;
  let title = "";
  
  // Setup form based on operation type
  if (type === 'SALDO_INICIAL') {
    title = "Agregar Saldo Inicial";
    form = useForm<z.infer<typeof initialBalanceSchema>>({
      resolver: zodResolver(initialBalanceSchema),
      defaultValues: {
        date: new Date(),
        units: undefined,
        unitCost: undefined,
        description: "Saldo Inicial",
      },
    });
  } else if (type === 'COMPRA') {
    title = "Registrar Nueva Compra";
    form = useForm<z.infer<typeof purchaseSchema>>({
      resolver: zodResolver(purchaseSchema),
      defaultValues: {
        date: new Date(),
        lotName: "",
        units: undefined,
        unitCost: undefined,
        description: "",
      },
    });
  } else if (type === 'VENTA') {
    title = "Registrar Venta";
    form = useForm<z.infer<typeof saleSchema>>({
      resolver: zodResolver(saleSchema),
      defaultValues: {
        date: new Date(),
        units: undefined,
        description: "Venta de unidades",
      },
    });
  } else { // DEVOLUCION
    title = "Registrar Devolución";
    form = useForm<z.infer<typeof returnSchema>>({
      resolver: zodResolver(returnSchema),
      defaultValues: {
        date: new Date(),
        lotId: "",
        units: undefined,
        description: "Devolución de unidades",
      },
    });
  }

  const onSubmit = (values: any) => {
    if (type === 'SALDO_INICIAL') {
      onAddInitialBalance(values.date, values.units, values.unitCost, values.description);
    } else if (type === 'COMPRA') {
      onAddPurchase(values.date, values.lotName, values.units, values.unitCost, values.description || `Compra lote ${values.lotName}`);
    } else if (type === 'VENTA') {
      onAddSale(values.date, values.units, values.description || "Venta de unidades");
    } else if (type === 'DEVOLUCION') {
      onAddReturn(values.date, values.lotId, values.units, values.description || "Devolución de unidades");
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Date Field - common to all forms */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lot Name - only for Purchase */}
            {type === 'COMPRA' && (
              <FormField
                control={form.control}
                name="lotName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Lote</FormLabel>
                    <FormControl>
                      <Input placeholder="Lote A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Units - common to all forms */}
            <FormField
              control={form.control}
              name="units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidades</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unit Cost - for Initial Balance and Purchase */}
            {(type === 'SALDO_INICIAL' || type === 'COMPRA') && (
              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo Unitario</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Lot Selector - only for Returns */}
            {type === 'DEVOLUCION' && (
              <FormField
                control={form.control}
                name="lotId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seleccionar Lote</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar lote" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableLots.map(lot => (
                          <SelectItem key={lot.id} value={lot.id}>
                            {lot.lotName} - {lot.remainingUnits} unidades a ${lot.unitCost}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Description - common to all forms */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la operación"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
