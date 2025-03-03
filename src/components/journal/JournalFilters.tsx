
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Filter, X } from "lucide-react";
import { useAccounting } from "@/contexts/AccountingContext";

interface JournalFiltersProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedAccount: string | undefined;
  setSelectedAccount: (account: string | undefined) => void;
  isFiltering: boolean;
  setIsFiltering: (isFiltering: boolean) => void;
}

export function JournalFilters({
  selectedDate,
  setSelectedDate,
  selectedAccount,
  setSelectedAccount,
  isFiltering,
  setIsFiltering,
}: JournalFiltersProps) {
  const { state } = useAccounting();

  const clearFilters = () => {
    setSelectedDate(undefined);
    setSelectedAccount(undefined);
    setIsFiltering(false);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-semibold">Historial de Transacciones</h2>
      <div className="flex items-center gap-2">
        {isFiltering && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearFilters}
            className="gap-1"
          >
            <X size={16} />
            Limpiar filtros
          </Button>
        )}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter size={16} />
              Filtrar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Filtrar por fecha</h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setIsFiltering(true);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Filtrar por cuenta</h4>
                <Select 
                  value={selectedAccount} 
                  onValueChange={(value) => {
                    setSelectedAccount(value);
                    setIsFiltering(true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {state.accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
