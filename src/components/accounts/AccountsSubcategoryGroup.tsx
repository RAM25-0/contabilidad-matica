
import React from "react";
import { Account, AccountSubcategory } from "@/types/accounting";
import { AccountCard } from "./AccountCard";
import { getSubcategoryLabel } from "./AccountBadge";

interface AccountsSubcategoryGroupProps {
  subcategory: AccountSubcategory;
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  getTypeLabel: (type: string) => string;
}

export const AccountsSubcategoryGroup = ({ 
  subcategory, 
  accounts, 
  onEdit, 
  onDelete, 
  getTypeLabel 
}: AccountsSubcategoryGroupProps) => {
  if (accounts.length === 0) return null;

  return (
    <div className="mb-6">
      {subcategory !== "none" && (
        <div className="flex items-center mb-3">
          <h3 className="text-lg font-semibold">
            {getSubcategoryLabel(subcategory)}
          </h3>
          <div className="h-px flex-1 bg-gray-200 ml-3"></div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(account => (
          <AccountCard 
            key={account.id} 
            account={account} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            getTypeLabel={getTypeLabel}
          />
        ))}
      </div>
    </div>
  );
};
