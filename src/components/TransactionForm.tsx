
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAccounting } from "@/contexts/AccountingContext";
import { formatCurrency } from "@/lib/utils";
import { Account, Transaction, TransactionEntry } from "@/types/accounting";

interface TransactionFormProps {
  onSuccess?: () => void;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { state, addTransaction } = useAccounting();
  const { toast } = useToast();
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [description, setDescription] = useState<string>("");
  const [entries, setEntries] = useState<Array<Partial<TransactionEntry & { isNew?: boolean }>>>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isDebit, setIsDebit] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para calcular el saldo de débitos y créditos
  const calculateBalance = () => {
    const totalDebits = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredits = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    return { totalDebits, totalCredits, balanced: Math.abs(totalDebits - totalCredits) < 0.001 };
  };

  const { totalDebits, totalCredits, balanced } = calculateBalance();
  
  const resetForm = () => {
    setDate(new Date().toISOString().substring(0, 10));
    setDescription("");
    setEntries([]);
    setSelectedAccount("");
    setAmount("");
    setIsDebit(true);
    setError(null);
  };

  const addEntry = () => {
    if (!selectedAccount || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Por favor selecciona una cuenta y un monto válido mayor a cero.");
      return;
    }
    
    const account = state.accounts.find(a => a.id === selectedAccount);
    if (!account) {
      setError("Cuenta no encontrada.");
      return;
    }
    
    const newEntry: Partial<TransactionEntry & { isNew?: boolean }> = {
      accountId: account.id,
      accountName: account.name,
      accountType: account.type,
      debit: isDebit ? Number(amount) : 0,
      credit: !isDebit ? Number(amount) : 0,
      isNew: true
    };
    
    setEntries([...entries, newEntry]);
    setSelectedAccount("");
    setAmount("");
    setError(null);
  };
  
  const removeEntry = (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError("Por favor ingresa una descripción para la transacción.");
      return;
    }
    
    if (entries.length < 2) {
      setError("La transacción debe tener al menos dos entradas.");
      return;
    }
    
    const { balanced } = calculateBalance();
    if (!balanced) {
      setError("La transacción debe estar balanceada. Los débitos deben ser iguales a los créditos.");
      return;
    }
    
    // Crear la transacción
    const transaction: Omit<Transaction, "id" | "isBalanced"> = {
      date: new Date(date),
      description,
      entries: entries.map((entry) => ({
        id: "", // El ID se asignará en el contexto
        accountId: entry.accountId!,
        accountName: entry.accountName!,
        accountType: entry.accountType!,
        debit: entry.debit || 0,
        credit: entry.credit || 0,
      })),
    };
    
    try {
      addTransaction(transaction);
      console.log("Transaction added successfully:", transaction);
      
      // Mostrar notificación de éxito
      toast({
        title: "Transacción registrada",
        description: "La transacción ha sido registrada exitosamente y está disponible en todos los módulos.",
      });
      
      // Limpiar el formulario
      resetForm();
      
      // Llamar a la función de éxito si se proporciona
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError(`Error al registrar la transacción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };
  
  // Helper para obtener el color de fondo según el tipo de cuenta
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "activo": return "bg-emerald-100 text-emerald-800";
      case "pasivo": return "bg-rose-100 text-rose-800";
      case "capital": return "bg-purple-100 text-purple-800";
      case "ingreso": return "bg-blue-100 text-blue-800";
      case "gasto": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="shadow-sm max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Registrar Transacción</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción de la transacción"
                required
              />
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
              <div className="md:col-span-5">
                <Label htmlFor="account">Cuenta</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Seleccionar cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.accounts.map((account) => (
                      <SelectItem 
                        key={account.id} 
                        value={account.id}
                        className={getAccountTypeColor(account.type)}
                      >
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-3 flex gap-2">
                <Button
                  type="button"
                  variant={isDebit ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIsDebit(true)}
                >
                  Cargo
                </Button>
                <Button
                  type="button"
                  variant={!isDebit ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIsDebit(false)}
                >
                  Abono
                </Button>
              </div>
              <div className="md:col-span-1">
                <Button
                  type="button"
                  size="icon"
                  onClick={addEntry}
                  title="Agregar entrada"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="border rounded-md">
              <ScrollArea className="h-60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cuenta</TableHead>
                      <TableHead className="text-right">Cargo</TableHead>
                      <TableHead className="text-right">Abono</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                          No hay entradas. Agrega una entrada para comenzar.
                        </TableCell>
                      </TableRow>
                    ) : (
                      entries.map((entry, index) => (
                        <TableRow key={index} className={entry.isNew ? "bg-primary/5" : undefined}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{entry.accountName}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-sm inline-block w-fit mt-1 ${getAccountTypeColor(entry.accountType || "")}`}>
                                {entry.accountType}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {entry.debit ? formatCurrency(entry.debit) : "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {entry.credit ? formatCurrency(entry.credit) : "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeEntry(index)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
              
              <div className="bg-muted/40 p-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total:</span>
                  <div className="space-x-4">
                    <span>
                      Cargos: <span className="font-bold">{formatCurrency(totalDebits)}</span>
                    </span>
                    <span>
                      Abonos: <span className="font-bold">{formatCurrency(totalCredits)}</span>
                    </span>
                    <span className={balanced ? "text-green-600" : "text-red-600"}>
                      {balanced ? "✓ Balanceado" : "✗ No balanceado"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              type="submit" 
              disabled={entries.length < 2 || !balanced}
              className="w-full md:w-auto"
            >
              Registrar Transacción
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
