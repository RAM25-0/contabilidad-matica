
import React from "react";
import { Account } from "@/types/accounting";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { getTextColorForType } from "./AccountBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface AccountsCompactListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

export const AccountsCompactList = ({ accounts, onEdit, onDelete }: AccountsCompactListProps) => {
  return (
    <div className="rounded-md border overflow-hidden bg-white">
      {accounts.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No hay cuentas en esta categoría. Crea una nueva cuenta.
        </div>
      ) : (
        <div className="divide-y">
          {accounts.map((account, index) => (
            <div key={account.id}>
              <div className="flex items-center justify-between py-4 px-4">
                <div className="flex-1">
                  <span className={`text-lg font-medium ${getTextColorForType(account.type, account.subcategory)}`}>
                    {account.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-0">
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                  </Badge>
                  
                  <span className={`text-lg font-medium ${
                    account.balance > 0 ? "text-emerald-700" : 
                    account.balance < 0 ? "text-rose-700" : "text-slate-500"
                  }`}>
                    {formatCurrency(account.balance)}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(account)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => onDelete(account.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
