
import React from "react";
import { TransactionEntry as TransactionEntryType } from "@/types/accounting";
import { formatCurrency } from "@/lib/utils";
import { AccountBadge } from "@/components/accounts/AccountBadge";

type TransactionEntryProps = {
  entry: TransactionEntryType;
};

export function TransactionEntry({ entry }: TransactionEntryProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="flex items-center">
        {entry.debit > 0 && <span className="mr-2 text-blue-600">→</span>}
        {entry.credit > 0 && <span className="mr-2 text-indigo-600">←</span>}
        <AccountBadge
          type={entry.accountType}
          label={entry.accountName}
          showIcon={false}
        />
      </span>
      <span className="text-right ml-4">
        {entry.debit > 0 && formatCurrency(entry.debit)}
        {entry.credit > 0 && formatCurrency(entry.credit)}
      </span>
    </div>
  );
}
