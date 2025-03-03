
import { useAccounting } from "@/contexts/AccountingContext";
import { useParams, Link } from "react-router-dom";
import { TAccount } from "@/components/TAccount";
import { useEffect, useState } from "react";
import { Account } from "@/types/accounting";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AccountMovement {
  id: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
}

export function LedgerPage() {
  const { accountId } = useParams();
  const { state } = useAccounting();
  const [account, setAccount] = useState<Account | null>(null);
  const [movements, setMovements] = useState<AccountMovement[]>([]);

  useEffect(() => {
    if (!accountId) return;

    const selectedAccount = state.accounts.find((acc) => acc.id === accountId);
    if (selectedAccount) {
      setAccount(selectedAccount);
    }

    // Get account movements
    const accountMovements = state.transactions
      .flatMap((tx) => 
        tx.entries
          .filter((entry) => entry.accountId === accountId)
          .map((entry) => ({
            id: entry.id,
            date: tx.date,
            description: tx.description,
            debit: entry.debit,
            credit: entry.credit
          }))
      );

    setMovements(accountMovements);
  }, [accountId, state]);

  if (!account) return (
    <div className="container mx-auto py-8 px-4">
      <div className="p-8 text-center">
        <p className="text-xl text-muted-foreground mb-4">Cuenta no encontrada</p>
        <Link to="/journal">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Libro Diario
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Libro Mayor: {account.name}</h1>
        <Link to="/journal">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Libro Diario
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Información de la cuenta</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground mr-2">Código:</span> {account.code}</p>
            <p><span className="text-muted-foreground mr-2">Tipo:</span> {account.type.charAt(0).toUpperCase() + account.type.slice(1)}</p>
            <p><span className="text-muted-foreground mr-2">Naturaleza:</span> {account.nature === "deudora" ? "Deudora" : "Acreedora"}</p>
            {account.subcategory && (
              <p>
                <span className="text-muted-foreground mr-2">Subcategoría:</span>
                {account.subcategory.charAt(0).toUpperCase() + account.subcategory.slice(1).replace("_", " ")}
              </p>
            )}
            {account.description && (
              <p><span className="text-muted-foreground mr-2">Descripción:</span> {account.description}</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Total de movimientos</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground mr-2">Cargos totales:</span>
              <span className="font-medium text-blue-600">
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                  movements.reduce((sum, m) => sum + m.debit, 0)
                )}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground mr-2">Abonos totales:</span>
              <span className="font-medium text-indigo-600">
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                  movements.reduce((sum, m) => sum + m.credit, 0)
                )}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground mr-2">Número de movimientos:</span>
              <span className="font-medium">{movements.length}</span>
            </p>
          </div>
        </div>
      </div>
      
      <TAccount account={account} movements={movements} />
    </div>
  );
}
