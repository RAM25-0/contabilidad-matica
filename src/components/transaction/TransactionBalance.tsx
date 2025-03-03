
import React from "react";
import { formatCurrency } from "@/lib/utils";

interface TransactionBalanceProps {
  totalCargo: number;
  totalAbono: number;
  isBalanced: boolean;
}

export function TransactionBalance({ totalCargo, totalAbono, isBalanced }: TransactionBalanceProps) {
  const difference = totalCargo - totalAbono;
  
  return (
    <div className="text-sm text-muted-foreground">
      <div className="flex justify-between gap-4">
        <span>Cargo:</span>
        <span className={isBalanced ? "text-green-600" : "text-red-600"}>
          {formatCurrency(totalCargo)}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Abono:</span>
        <span className={isBalanced ? "text-green-600" : "text-red-600"}>
          {formatCurrency(totalAbono)}
        </span>
      </div>
      {!isBalanced && (
        <div className="flex justify-between gap-4 font-semibold">
          <span>Diferencia:</span>
          <span className="text-red-600">
            {formatCurrency(Math.abs(difference))}
          </span>
        </div>
      )}
    </div>
  );
}
