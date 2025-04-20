
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { InventoryOperationFormValues } from "./types";

interface OperationTypeFieldProps {
  form: UseFormReturn<InventoryOperationFormValues>;
}

export function OperationTypeField({ form }: OperationTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Operación</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="SALDO_INICIAL">Saldo Inicial</SelectItem>
              <SelectItem value="COMPRA">Compra</SelectItem>
              <SelectItem value="VENTA">Venta</SelectItem>
              <SelectItem value="DEVOLUCION">Devolución</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
