import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RawMaterialState } from "./types";
import { Calculator } from "lucide-react";

interface RawMaterialSummaryProps {
  state: RawMaterialState;
}

export function RawMaterialSummary({ state }: RawMaterialSummaryProps) {
  // Calculate Initial Inventory values
  const initialInventoryValue = state.initialInventoryType === 'units'
    ? state.initialInventoryUnits * state.initialInventoryUnitCost
    : state.initialInventoryMoney;

  const initialInventoryUnits = state.initialInventoryType === 'units'
    ? state.initialInventoryUnits
    : state.initialInventoryUnitCost > 0 
      ? state.initialInventoryMoney / state.initialInventoryUnitCost 
      : 0;

  // Calculate purchase value
  const purchaseValue = state.purchaseType === 'units'
    ? state.purchaseUnits * state.purchaseUnitCost
    : state.purchaseMoney;

  const purchaseUnits = state.purchaseType === 'units'
    ? state.purchaseUnits
    : state.purchaseUnitCost > 0 
      ? state.purchaseMoney / state.purchaseUnitCost 
      : 0;

  // Calculate returns value
  const returnsValue = state.purchaseReturnsType === 'units'
    ? state.purchaseReturnsUnits * state.purchaseReturnsUnitCost
    : state.purchaseReturnsMoney;

  const returnsUnits = state.purchaseReturnsType === 'units'
    ? state.purchaseReturnsUnits
    : state.purchaseReturnsUnitCost > 0 
      ? state.purchaseReturnsMoney / state.purchaseReturnsUnitCost 
      : 0;

  // Calculate discounts value
  const discountsValue = state.purchaseDiscountsType === 'percentage'
    ? (purchaseValue * state.purchaseDiscountsPercentage) / 100
    : state.purchaseDiscountsMoney;

  // Net Purchases
  const netPurchasesValue = purchaseValue + state.purchaseExpenses - returnsValue - discountsValue;
  const netPurchasesUnits = purchaseUnits - returnsUnits;

  // Available Raw Material
  const availableValue = initialInventoryValue + netPurchasesValue;
  const availableUnits = initialInventoryUnits + netPurchasesUnits;

  const methodLabels = {
    promedio: 'Promedio Ponderado',
    peps: 'PEPS',
    ueps: 'UEPS'
  };

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="h-4 w-4 text-accent" />
          Resumen: Materia Prima Disponible
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-background rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Inventario Inicial M.P.</p>
              <p className="font-medium">
                {initialInventoryUnits.toFixed(2)} U
              </p>
              <p className="text-primary font-semibold">
                ${initialInventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">+ Compras Netas</p>
              <p className="font-medium">
                {netPurchasesUnits.toFixed(2)} U
              </p>
              <p className="text-green-600 font-semibold">
                ${netPurchasesValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="space-y-1 border-l-2 border-primary pl-4">
              <p className="text-muted-foreground">= M.P. Disponible</p>
              <p className="font-bold text-lg">
                {availableUnits.toFixed(2)} U
              </p>
              <p className="text-primary font-bold text-lg">
                ${availableValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t text-sm text-muted-foreground">
            <span>Método de inventario seleccionado: </span>
            <span className="font-medium text-foreground">{methodLabels[state.inventoryMethod]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
