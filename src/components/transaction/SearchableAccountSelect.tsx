
import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccounting } from "@/contexts/AccountingContext";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./TransactionFormTypes";
import { getTextColorForType, getBgColorForType } from "@/components/accounts/AccountBadge";

interface SearchableAccountSelectProps {
  index: number;
  form: UseFormReturn<FormData>;
}

export function SearchableAccountSelect({ index, form }: SearchableAccountSelectProps) {
  const { state } = useAccounting();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const accountId = form.watch(`entries.${index}.accountId`);
  const selectedAccount = state.accounts.find(account => account.id === accountId);
  
  // Filter accounts based on search query
  const filteredAccounts = state.accounts.filter(account => 
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FormField
      control={form.control}
      name={`entries.${index}.accountId`}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="sr-only">Cuenta</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full h-9 justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {selectedAccount ? selectedAccount.name : "Selecciona cuenta"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput 
                  placeholder="Buscar cuenta..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="h-9"
                />
                <CommandEmpty>No se encontraron cuentas.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {filteredAccounts.map(account => {
                    const textColor = getTextColorForType(account.type, account.subcategory);
                    const bgColor = getBgColorForType(account.type, account.subcategory);
                    
                    return (
                      <CommandItem
                        key={account.id}
                        value={account.id}
                        onSelect={() => {
                          form.setValue(`entries.${index}.accountId`, account.id);
                          setOpen(false);
                        }}
                        className={`${textColor} ${bgColor} rounded my-1`}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            account.id === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {account.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
