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
  // Calculate purchase value
  const purchaseValue = state.purchaseType === 'units'
    ? state.purchaseUnits * state.purchaseUnitCost
    : state.purchaseMoney;

  // Calculate returns value
  const returnsValue = state.purchaseReturnsType === 'units'
    ? state.purchaseReturnsUnits * state.purchaseReturnsUnitCost
    : state.purchaseReturnsMoney;

  // Calculate discounts value
  const discountsValue = state.purchaseDiscountsType === 'percentage'
    ? (purchaseValue * state.purchaseDiscountsPercentage) / 100
    : state.purchaseDiscountsMoney;

  // Net Purchases Formula
  const netPurchases = purchaseValue + state.purchaseExpenses - returnsValue - discountsValue;

  return (
    <Card className="border-secondary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-secondary" />
          B) Compras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Purchase */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Tipo de valor</Label>
            <ValueTypeToggle 
              value={state.purchaseType} 
              onChange={(v) => onChange({ purchaseType: v as ValueType })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {state.purchaseType === 'units' ? (
              <>
                <div className="space-y-2">
                  <Label>Unidades</Label>
                  <Input
                    type="number"
                    min={0}
                    value={state.purchaseUnits || ''}
                    onChange={(e) => onChange({ purchaseUnits: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Costo Unitario ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={state.purchaseUnitCost || ''}
                    onChange={(e) => onChange({ purchaseUnitCost: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>Valor Total ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={state.purchaseMoney || ''}
                  onChange={(e) => onChange({ purchaseMoney: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          <div className="text-sm text-right text-muted-foreground">
            Compras: ${purchaseValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <Accordion type="multiple" className="w-full">
          {/* Purchase Expenses */}
          <AccordionItem value="expenses">
            <AccordionTrigger className="text-sm py-2">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                Gastos sobre Compras
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <Label>Gastos ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={state.purchaseExpenses || ''}
                  onChange={(e) => onChange({ purchaseExpenses: Number(e.target.value) })}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">
                  Solo se puede agregar en formato de dinero ($)
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Purchase Returns */}
          <AccordionItem value="returns">
            <AccordionTrigger className="text-sm py-2">
              <span className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                Devoluciones sobre Compras
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Tipo de valor</Label>
                  <ValueTypeToggle 
                    value={state.purchaseReturnsType} 
                    onChange={(v) => onChange({ purchaseReturnsType: v as ValueType })} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.purchaseReturnsType === 'units' ? (
                    <>
                      <div className="space-y-2">
                        <Label>Unidades</Label>
                        <Input
                          type="number"
                          min={0}
                          value={state.purchaseReturnsUnits || ''}
                          onChange={(e) => onChange({ purchaseReturnsUnits: Number(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Costo Unitario ($)</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={state.purchaseReturnsUnitCost || ''}
                          onChange={(e) => onChange({ purchaseReturnsUnitCost: Number(e.target.value) })}
                          placeholder="0.00"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label>Valor Total ($)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={state.purchaseReturnsMoney || ''}
                        onChange={(e) => onChange({ purchaseReturnsMoney: Number(e.target.value) })}
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Purchase Discounts */}
          <AccordionItem value="discounts">
            <AccordionTrigger className="text-sm py-2">
              <span className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                Descuentos sobre Compras
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Tipo de descuento</Label>
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
                      <Label>Porcentaje de Descuento (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        value={state.purchaseDiscountsPercentage || ''}
                        onChange={(e) => onChange({ purchaseDiscountsPercentage: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </>
                  ) : (
                    <>
                      <Label>Descuento ($)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={state.purchaseDiscountsMoney || ''}
                        onChange={(e) => onChange({ purchaseDiscountsMoney: Number(e.target.value) })}
                        placeholder="0.00"
                      />
                    </>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Net Purchases Formula */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="text-sm font-medium">Fórmula de Compras Netas</h4>
          <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm font-mono">
            <div className="flex justify-between">
              <span>Compras</span>
              <span>${purchaseValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>+ Gastos sobre Compras</span>
              <span>${state.purchaseExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>- Devoluciones sobre Compras</span>
              <span>${returnsValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>- Descuentos sobre Compras</span>
              <span>${discountsValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-1 mt-1">
              <span>= COMPRAS NETAS</span>
              <span>${netPurchases.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
