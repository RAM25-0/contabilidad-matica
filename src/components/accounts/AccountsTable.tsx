
import React from "react";
import { Account } from "@/types/accounting";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { AccountBadge, getSubcategoryLabel, getTextColorForType } from "./AccountBadge";
import { formatCurrency } from "@/lib/utils";

interface AccountsTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

export const AccountsTable = ({ accounts, onEdit, onDelete }: AccountsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Tipo</TableHead>
            <TableHead className="w-[120px]">Categoría</TableHead>
            <TableHead className="w-[200px]">Nombre</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead className="w-[100px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No hay cuentas en esta categoría. Crea una nueva cuenta.
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <AccountBadge 
                    type={account.type} 
                    subcategory={account.subcategory} 
                  />
                </TableCell>
                <TableCell>
                  {account.subcategory && account.subcategory !== "none" && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                      {getSubcategoryLabel(account.subcategory)}
                    </span>
                  )}
                </TableCell>
                <TableCell className={`font-medium ${getTextColorForType(account.type, account.subcategory)}`}>
                  {account.name}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-medium ${
                    account.balance > 0 ? "text-emerald-700" : 
                    account.balance < 0 ? "text-rose-700" : "text-slate-500"
                  }`}>
                    {formatCurrency(account.balance)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
