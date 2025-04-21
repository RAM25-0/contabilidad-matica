
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { PepsInventoryTable } from "./PepsInventoryTable";
import { usePepsInventory } from "@/hooks/usePepsInventory";

export function PepsInventoryPlaceholder() {
  const {
    state,
    handleAddInitialBalance,
    handleAddPurchase,
    handleAddSale,
    handleAddReturn,
    getAvailableLots,
  } = usePepsInventory();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-violet-500" />
          <CardTitle>Método de Valuación - PEPS</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <PepsInventoryTable 
          state={state}
          onAddInitialBalance={handleAddInitialBalance}
          onAddPurchase={handleAddPurchase}
          onAddSale={handleAddSale}
          onAddReturn={handleAddReturn}
          getAvailableLots={getAvailableLots}
        />
      </CardContent>
    </Card>
  );
}
