
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
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
  SelectValue 
} from "@/components/ui/select";
import { DatePickerField } from "./DatePickerField";
import { inventoryOperationSchema, InventoryOperationFormValues } from "./types";
import { UepsLot } from "@/hooks/useUepsInventory";

interface UepsOperationDialogProps {
  open: boolean;
  onClose: () => void;
  operationType: "SALDO_INICIAL" | "COMPRA" | "VENTA" | "DEVOLUCION" | null;
  onAddInitialBalance: (date: Date, units: number, unitCost: number, description: string) => void;
  onAddPurchase: (date: Date, lotName: string, units: number, unitCost: number, description: string) => void;
  onAddSale: (date: Date, units: number, description: string) => void;
  onAddReturn: (date: Date, lotId: string, units: number, description: string) => void;
  availableLots: UepsLot[];
}

export function UepsOperationDialog({
  open,
  onClose,
  operationType,
  onAddInitialBalance,
  onAddPurchase,
  onAddSale,
  onAddReturn,
  availableLots,
}: UepsOperationDialogProps) {
  const form = useForm<InventoryOperationFormValues>({
    resolver: zodResolver(inventoryOperationSchema),
    defaultValues: {
      date: new Date(),
      type: operationType || "SALDO_INICIAL",
      description: "",
      units: 0,
      unitCost: undefined,
    },
  });

  React.useEffect(() => {
    if (operationType) {
      form.reset({
        date: new Date(),
        type: operationType,
        description: "",
        units: 0,
        unitCost: undefined,
        lotName: "",
        lotId: "",
      });
    }
  }, [operationType, form]);

  const handleSubmit = (values: InventoryOperationFormValues) => {
    switch (values.type) {
      case "SALDO_INICIAL":
        if (values.unitCost !== undefined) {
          onAddInitialBalance(
            values.date,
            values.units,
            values.unitCost,
            values.description
          );
        }
        break;
      case "COMPRA":
        if (values.unitCost !== undefined && values.lotName) {
          onAddPurchase(
            values.date,
            values.lotName,
            values.units,
            values.unitCost,
            values.description
          );
        }
        break;
      case "VENTA":
        onAddSale(values.date, values.units, values.description);
        break;
      case "DEVOLUCION":
        if (values.lotId) {
          onAddReturn(
            values.date,
            values.lotId,
            values.units,
            values.description
          );
        }
        break;
    }
    onClose();
  };

  // Determine title based on operation type
  let dialogTitle = "Agregar Operación";
  switch (operationType) {
    case "SALDO_INICIAL":
      dialogTitle = "Agregar Saldo Inicial";
      break;
    case "COMPRA":
      dialogTitle = "Agregar Compra";
      break;
    case "VENTA":
      dialogTitle = "Registrar Venta";
      break;
    case "DEVOLUCION":
      dialogTitle = "Registrar Devolución";
      break;
  }

  const showUnitCost = operationType === "SALDO_INICIAL" || operationType === "COMPRA";
  const showLotName = operationType === "COMPRA";
  const showLotSelector = operationType === "DEVOLUCION";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <input type="hidden" {...form.register("type")} />

            <DatePickerField />

            {showLotName && (
              <FormField
                control={form.control}
                name="lotName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Lote</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Lote A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showLotSelector && (
              <FormField
                control={form.control}
                name="lotId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lote a Devolver</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar lote" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableLots.map((lot) => (
                          <SelectItem key={lot.id} value={lot.id}>
                            {lot.lotName} - {lot.units} unidades - ${lot.unitCost}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidades</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showUnitCost && (
              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo Unitario</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        value={field.value === undefined ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escriba una descripción breve..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
