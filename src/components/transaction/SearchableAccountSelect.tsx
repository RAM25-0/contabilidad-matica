
import React, { useState, useEffect } from "react";
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
  const [filteredAccounts, setFilteredAccounts] = useState<typeof state.accounts>([]);
  
  const accountId = form.watch(`entries.${index}.accountId`);
  const selectedAccount = state.accounts?.find(account => account?.id === accountId);
  
  // Initialize filtered accounts when component mounts and when state.accounts changes
  useEffect(() => {
    if (Array.isArray(state.accounts)) {
      setFilteredAccounts(state.accounts);
    } else {
      setFilteredAccounts([]);
    }
  }, [state.accounts]);
  
  // Update filtered accounts whenever search query changes
  useEffect(() => {
    if (!Array.isArray(state.accounts)) {
      setFilteredAccounts([]);
      return;
    }
    
    const filtered = state.accounts.filter(account => 
      account && account.name && account.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAccounts(filtered);
  }, [searchQuery, state.accounts]);

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
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput 
                  placeholder="Buscar cuenta..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="h-9"
                />
                {(!filteredAccounts || filteredAccounts.length === 0) && (
                  <CommandEmpty>No se encontraron cuentas.</CommandEmpty>
                )}
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {filteredAccounts && filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account, idx) => {
                      if (!account) return null;
                      
                      const textColor = getTextColorForType(account.type, account.subcategory);
                      const bgColor = getBgColorForType(account.type, account.subcategory);
                      
                      return (
                        <CommandItem
                          key={account.id || idx}
                          value={account.id}
                          onSelect={() => {
                            form.setValue(`entries.${index}.accountId`, account.id);
                            setOpen(false);
                            setSearchQuery(""); // Reset search query when selecting an account
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
                    })
                  ) : (
                    <div className="py-6 text-center text-sm">No hay cuentas disponibles.</div>
                  )}
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
