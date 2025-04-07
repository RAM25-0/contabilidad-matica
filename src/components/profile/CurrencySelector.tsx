
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Control } from "react-hook-form";

interface CurrencySelectorProps {
  control: Control<any>;
  name: string;
}

export function CurrencySelector({ control, name }: CurrencySelectorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Moneda</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar moneda" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
              <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
