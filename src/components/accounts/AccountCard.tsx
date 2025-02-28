
import React from "react";
import { Account } from "@/types/accounting";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { AccountBadge, getIconForType, getTextColorForType } from "./AccountBadge";
import { formatCurrency } from "@/lib/utils";

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  getTypeLabel: (type: string) => string;
}

export const AccountCard = ({ account, onEdit, onDelete, getTypeLabel }: AccountCardProps) => {
  return (
    <Card 
      className={`account-card overflow-hidden border hover-scale ${
        account.balance !== 0 ? "border-gray-300" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <AccountBadge 
            type={account.type} 
            subcategory={account.subcategory}
            label={getTypeLabel(account.type)} 
            showIcon={false} 
          />
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => onEdit(account)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-destructive"
              onClick={() => onDelete(account.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg flex items-center gap-2">
          {getIconForType(account.type, account.subcategory)}
          <span className="truncate">{account.name}</span>
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
            {account.code}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
            {account.nature === "deudora" ? "Deudora" : "Acreedora"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {account.description && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {account.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 py-2">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm">Saldo:</span>
          <span className={`font-medium ${
            account.balance > 0 ? "text-emerald-700" : 
            account.balance < 0 ? "text-rose-700" : ""
          }`}>
            {formatCurrency(account.balance)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
