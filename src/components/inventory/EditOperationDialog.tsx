
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerField } from "./DatePickerField";
import { OperationTypeField } from "./OperationTypeField";
import { InventoryOperation } from "@/types/inventory";
import { inventoryOperationSchema, InventoryOperationFormValues } from "./types";

interface EditOperationDialogProps {
  operation: InventoryOperation;
  onSubmit: (values: Omit<InventoryOperation, 'id' | 'averageCost' | 'balance' | 'stockBalance' | 'totalCost'>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOperationDialog({ operation, onSubmit, open, onOpenChange }: EditOperationDialogProps) {
  const form = useForm<InventoryOperationFormValues>({
    resolver: zodResolver(inventoryOperationSchema),
    defaultValues: {
      date: operation.date,
      type: operation.type,
      units: operation.units,
      unitCost: operation.unitCost,
      description: operation.description,
    },
  });

  const handleSubmit = (values: InventoryOperationFormValues) => {
    // Ensure we're passing a complete object with all required properties
    onSubmit({
      date: values.date,
      type: values.type,
      units: values.units,
      unitCost: values.unitCost,
      description: values.description,
    });
    onOpenChange(false);
  };

  const operationType = form.watch("type");
  const showUnitCost = operationType === "COMPRA" || operationType === "SALDO_INICIAL";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Operación</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <DatePickerField />
            <OperationTypeField form={form} />
            
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
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value === undefined ? '' : field.value}
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
              Guardar Cambios
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
