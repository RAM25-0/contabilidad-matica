
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface PasswordFieldProps {
  control: Control<any>;
  name: string;
  showField: boolean;
}

export function PasswordField({ control, name, showField }: PasswordFieldProps) {
  if (!showField) return null;
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contraseña</FormLabel>
          <FormControl>
            <Input type="password" placeholder="Ingrese su contraseña" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
