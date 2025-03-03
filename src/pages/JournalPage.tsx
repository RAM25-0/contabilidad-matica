
import React, { useState, useEffect } from "react";
import { useAccounting } from "@/contexts/AccountingContext";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function JournalPage() {
  const { state } = useAccounting();
  const [filteredTransactions, setFilteredTransactions] = useState(state.transactions);
  const [searchTerm, setSearchTerm] = useState("");

  // Update filtered transactions when state changes or search term changes
  useEffect(() => {
    // Si hay un término de búsqueda, filtramos las transacciones
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = state.transactions.filter(transaction => 
        transaction.description.toLowerCase().includes(term) ||
        transaction.entries.some(entry => 
          entry.accountName.toLowerCase().includes(term)
        )
      );
      setFilteredTransactions(filtered);
    } else {
      // Si no hay término de búsqueda, mostramos todas
      setFilteredTransactions(state.transactions);
    }
  }, [state.transactions, searchTerm]);

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-4xl">
      {/* Header with filters and navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold">Libro Diario</h1>
        <div className="flex w-full sm:w-auto gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar transacciones..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/" className="text-primary hover:underline whitespace-nowrap self-center">
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Transaction count summary */}
      <p className="text-sm text-muted-foreground">
        Mostrando {sortedTransactions.length} {sortedTransactions.length === 1 ? 'transacción' : 'transacciones'} {searchTerm && " (filtradas)"}
      </p>

      {/* Transactions list */}
      <div className="space-y-4">
        {sortedTransactions.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              {searchTerm 
                ? "No se encontraron transacciones que coincidan con la búsqueda" 
                : "No hay transacciones registradas"}
            </CardContent>
          </Card>
        ) : (
          sortedTransactions.map((transaction) => (
            <Card key={transaction.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(
                        transaction.entries.reduce(
                          (sum, entry) => sum + (entry.debit > 0 ? entry.debit : 0),
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>

                <Separator className="my-3" />

                {/* Entries detail */}
                <div className="space-y-2">
                  {transaction.entries.map((entry) => (
                    <div key={entry.id} className="flex justify-between text-sm">
                      <div className="flex items-center">
                        {entry.debit > 0 && <span className="mr-2 text-blue-600">→</span>}
                        {entry.credit > 0 && <span className="ml-6 mr-2 text-indigo-600">←</span>}
                        <Link to={`/ledger/${entry.accountId}`} className="hover:underline">
                          <span className={entry.credit > 0 ? "ml-4" : ""}>{entry.accountName}</span>
                        </Link>
                      </div>
                      <div className="flex gap-6 w-40 justify-end">
                        <span className="text-blue-600 w-16 text-right">
                          {entry.debit > 0 && formatCurrency(entry.debit)}
                        </span>
                        <span className="text-indigo-600 w-16 text-right">
                          {entry.credit > 0 && formatCurrency(entry.credit)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
