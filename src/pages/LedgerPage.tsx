
import { useAccounting } from "@/contexts/AccountingContext";
import { useParams } from "react-router-dom";
import { TAccount } from "@/components/TAccount";
import { useEffect, useState } from "react";
import { Account } from "@/types/accounting";

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

  if (!account) return <div className="p-8 text-center">Cuenta no encontrada</div>;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Libro Mayor: {account.name}</h1>
      <TAccount account={account} movements={movements} />
    </div>
  );
}
