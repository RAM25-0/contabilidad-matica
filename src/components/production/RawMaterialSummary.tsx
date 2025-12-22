import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RawMaterialState } from "./types";
import { Calculator, ArrowRight } from "lucide-react";

interface RawMaterialSummaryProps {
  state: RawMaterialState;
}

export function RawMaterialSummary({ state }: RawMaterialSummaryProps) {
  const initialInventoryValue = state.initialInventoryType === 'units'
    ? state.initialInventoryUnits * state.initialInventoryUnitCost
    : state.initialInventoryMoney;

  const initialInventoryUnits = state.initialInventoryType === 'units'
    ? state.initialInventoryUnits
    : state.initialInventoryUnitCost > 0 
      ? state.initialInventoryMoney / state.initialInventoryUnitCost 
      : 0;

  const purchaseValue = state.purchaseType === 'units'
    ? state.purchaseUnits * state.purchaseUnitCost
    : state.purchaseMoney;

  const purchaseUnits = state.purchaseType === 'units'
    ? state.purchaseUnits
    : state.purchaseUnitCost > 0 
      ? state.purchaseMoney / state.purchaseUnitCost 
      : 0;

  const returnsValue = state.purchaseReturnsType === 'units'
    ? state.purchaseReturnsUnits * state.purchaseReturnsUnitCost
    : state.purchaseReturnsMoney;

  const returnsUnits = state.purchaseReturnsType === 'units'
    ? state.purchaseReturnsUnits
    : state.purchaseReturnsUnitCost > 0 
      ? state.purchaseReturnsMoney / state.purchaseReturnsUnitCost 
      : 0;

  const discountsValue = state.purchaseDiscountsType === 'percentage'
    ? (purchaseValue * state.purchaseDiscountsPercentage) / 100
    : state.purchaseDiscountsMoney;

  const netPurchasesValue = purchaseValue + state.purchaseExpenses - returnsValue - discountsValue;
  const netPurchasesUnits = purchaseUnits - returnsUnits;

  const availableValue = initialInventoryValue + netPurchasesValue;
  const availableUnits = initialInventoryUnits + netPurchasesUnits;

  const methodLabels = {
    promedio: 'Promedio Ponderado',
    peps: 'PEPS',
    ueps: 'UEPS'
  };

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
            <Calculator className="h-3.5 w-3.5 text-primary" />
          </div>
          Resumen: Materia Prima Disponible
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Initial Inventory */}
            <div className="rounded-lg bg-background/80 p-4 backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Inventario Inicial M.P.
              </p>
              <p className="mt-2 text-lg font-semibold tabular-nums text-foreground">
                {initialInventoryUnits.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">U</span>
              </p>
              <p className="text-sm font-medium tabular-nums text-muted-foreground">
                ${initialInventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Net Purchases */}
            <div className="relative rounded-lg bg-background/80 p-4 backdrop-blur-sm">
              <div className="absolute -left-2 top-1/2 hidden -translate-y-1/2 sm:flex">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/20 text-success">
                  <span className="text-xs font-bold">+</span>
                </div>
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Compras Netas
              </p>
              <p className="mt-2 text-lg font-semibold tabular-nums text-foreground">
                {netPurchasesUnits.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">U</span>
              </p>
              <p className="text-sm font-medium tabular-nums text-success">
                ${netPurchasesValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Available Material */}
            <div className="relative rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
              <div className="absolute -left-2 top-1/2 hidden -translate-y-1/2 sm:flex">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                M.P. Disponible
              </p>
              <p className="mt-2 text-xl font-bold tabular-nums text-foreground">
                {availableUnits.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">U</span>
              </p>
              <p className="text-base font-semibold tabular-nums text-primary">
                ${availableValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Inventory method badge */}
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Método de inventario
            </span>
            <span className="inline-flex items-center rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
              {methodLabels[state.inventoryMethod]}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
