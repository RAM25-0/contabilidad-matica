
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { X } from "lucide-react";
import { useAccounting } from "@/contexts/AccountingContext";
import { UseFormReturn } from "react-hook-form";
import { getTextColorForType, getBgColorForType } from "@/components/accounts/AccountBadge";
import { FormData } from "./TransactionFormTypes";

interface TransactionEntryRowProps {
  index: number;
  form: UseFormReturn<FormData>;
  removeEntry: (index: number) => void;
}

export function TransactionEntryRow({ index, form, removeEntry }: TransactionEntryRowProps) {
  const { state } = useAccounting();

  return (
    <div className="grid grid-cols-[1fr,auto,1fr,auto] gap-2 items-center">
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
  );
}
