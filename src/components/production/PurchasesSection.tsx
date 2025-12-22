import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ValueTypeToggle } from "./ValueTypeToggle";
import { RawMaterialState, ValueType, DiscountType } from "./types";
import { ShoppingCart, Truck, RotateCcw, Percent } from "lucide-react";

interface PurchasesSectionProps {
  state: RawMaterialState;
  onChange: (updates: Partial<RawMaterialState>) => void;
}

export function PurchasesSection({ state, onChange }: PurchasesSectionProps) {
  const purchaseValue = state.purchaseType === 'units'
    ? state.purchaseUnits * state.purchaseUnitCost
    : state.purchaseMoney;

  const returnsValue = state.purchaseReturnsType === 'units'
    ? state.purchaseReturnsUnits * state.purchaseReturnsUnitCost
    : state.purchaseReturnsMoney;

  const discountsValue = state.purchaseDiscountsType === 'percentage'
    ? (purchaseValue * state.purchaseDiscountsPercentage) / 100
    : state.purchaseDiscountsMoney;

  const netPurchases = purchaseValue + state.purchaseExpenses - returnsValue - discountsValue;

  return (
    <Card className="border-border/50 bg-card/50 shadow-none transition-colors duration-200 hover:bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
            <ShoppingCart className="h-3.5 w-3.5 text-secondary-foreground" />
          </div>
          B) Compras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Main Purchase */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Tipo de valor
            </Label>
            <ValueTypeToggle 
              value={state.purchaseType} 
              onChange={(v) => onChange({ purchaseType: v as ValueType })} 
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.purchaseType === 'units' ? (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Unidades</Label>
                  <Input
                    type="number"
                    min={0}
                    value={state.purchaseUnits || ''}
                    onChange={(e) => onChange({ purchaseUnits: Number(e.target.value) })}
                    placeholder="0"
                    className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Costo Unitario ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={state.purchaseUnitCost || ''}
                    onChange={(e) => onChange({ purchaseUnitCost: Number(e.target.value) })}
                    placeholder="0.00"
                    className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Valor Total ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={state.purchaseMoney || ''}
                  onChange={(e) => onChange({ purchaseMoney: Number(e.target.value) })}
                  placeholder="0.00"
                  className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <span className="text-sm tabular-nums text-muted-foreground">
              Compras: <span className="font-medium text-foreground">${purchaseValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </span>
          </div>
        </div>

        <Accordion type="multiple" className="w-full space-y-2">
          {/* Purchase Expenses */}
          <AccordionItem value="expenses" className="rounded-lg border border-border/50 bg-background/50 px-4">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
              <span className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                  <Truck className="h-3 w-3 text-muted-foreground" />
                </div>
                Gastos sobre Compras
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-2 pt-2">
                <Label className="text-sm font-medium">Gastos ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={state.purchaseExpenses || ''}
                  onChange={(e) => onChange({ purchaseExpenses: Number(e.target.value) })}
                  placeholder="0.00"
                  className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  Solo se puede agregar en formato de dinero ($)
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Purchase Returns */}
          <AccordionItem value="returns" className="rounded-lg border border-border/50 bg-background/50 px-4">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
              <span className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                  <RotateCcw className="h-3 w-3 text-muted-foreground" />
                </div>
                Devoluciones sobre Compras
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Tipo de valor
                  </Label>
                  <ValueTypeToggle 
                    value={state.purchaseReturnsType} 
                    onChange={(v) => onChange({ purchaseReturnsType: v as ValueType })} 
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {state.purchaseReturnsType === 'units' ? (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Unidades</Label>
                        <Input
                          type="number"
                          min={0}
                          value={state.purchaseReturnsUnits || ''}
                          onChange={(e) => onChange({ purchaseReturnsUnits: Number(e.target.value) })}
                          placeholder="0"
                          className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Costo Unitario ($)</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={state.purchaseReturnsUnitCost || ''}
                          onChange={(e) => onChange({ purchaseReturnsUnitCost: Number(e.target.value) })}
                          placeholder="0.00"
                          className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Valor Total ($)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={state.purchaseReturnsMoney || ''}
                        onChange={(e) => onChange({ purchaseReturnsMoney: Number(e.target.value) })}
                        placeholder="0.00"
                        className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Purchase Discounts */}
          <AccordionItem value="discounts" className="rounded-lg border border-border/50 bg-background/50 px-4">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
              <span className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                  <Percent className="h-3 w-3 text-muted-foreground" />
                </div>
                Descuentos sobre Compras
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Tipo de descuento
                  </Label>
                  <ValueTypeToggle 
                    value={state.purchaseDiscountsType} 
                    onChange={(v) => onChange({ purchaseDiscountsType: v as DiscountType })} 
                    options={[
                      { value: 'percentage', label: 'Porcentaje (%)' },
                      { value: 'money', label: 'Dinero ($)' }
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  {state.purchaseDiscountsType === 'percentage' ? (
                    <>
                      <Label className="text-sm font-medium">Porcentaje de Descuento (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        value={state.purchaseDiscountsPercentage || ''}
                        onChange={(e) => onChange({ purchaseDiscountsPercentage: Number(e.target.value) })}
                        placeholder="0"
                        className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </>
                  ) : (
                    <>
                      <Label className="text-sm font-medium">Descuento ($)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={state.purchaseDiscountsMoney || ''}
                        onChange={(e) => onChange({ purchaseDiscountsMoney: Number(e.target.value) })}
                        placeholder="0.00"
                        className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Net Purchases Formula */}
        <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Fórmula de Compras Netas
          </h4>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Compras</span>
              <span className="tabular-nums text-foreground">${purchaseValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between py-1 text-success">
              <span>+ Gastos sobre Compras</span>
              <span className="tabular-nums">${state.purchaseExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between py-1 text-destructive">
              <span>- Devoluciones sobre Compras</span>
              <span className="tabular-nums">${returnsValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between py-1 text-destructive">
              <span>- Descuentos sobre Compras</span>
              <span className="tabular-nums">${discountsValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 font-semibold">
              <span className="text-foreground">= COMPRAS NETAS</span>
              <span className="tabular-nums text-primary">${netPurchases.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
