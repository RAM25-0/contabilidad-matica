
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionsList } from "@/components/TransactionsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAccounting } from "@/contexts/AccountingContext";
import { Sidebar } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Filter, X, ArrowLeft, PieChart } from "lucide-react";

export default function JournalPage() {
  const { state } = useAccounting();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined);
  const [isFiltering, setIsFiltering] = useState(false);

  const clearFilters = () => {
    setSelectedDate(undefined);
    setSelectedAccount(undefined);
    setIsFiltering(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Libro Diario</h1>
            <p className="text-muted-foreground mt-2">
              Registra y consulta las transacciones en el libro diario contable.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver a Inicio
              </Button>
            </Link>
            <Link to="/mayor">
              <Button variant="outline" className="gap-2">
                <PieChart className="h-4 w-4" />
                Ir al Libro Mayor
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="register">Registrar Transacción</TabsTrigger>
            <TabsTrigger value="history">Historial de Transacciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="register" className="space-y-4">
            <TransactionForm />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
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
            
            <TransactionsList 
              dateFilter={selectedDate}
              accountFilter={selectedAccount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
