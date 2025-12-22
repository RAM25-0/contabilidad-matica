import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ValueTypeToggle } from "./ValueTypeToggle";
import { RawMaterialState, ValueType } from "./types";
import { Package } from "lucide-react";

interface InitialInventorySectionProps {
  state: RawMaterialState;
  onChange: (updates: Partial<RawMaterialState>) => void;
}

export function InitialInventorySection({ state, onChange }: InitialInventorySectionProps) {
  const handleTypeChange = (type: ValueType) => {
    onChange({ initialInventoryType: type });
  };

  const totalValue = state.initialInventoryType === 'units'
    ? state.initialInventoryUnits * state.initialInventoryUnitCost
    : state.initialInventoryMoney;

  const totalUnits = state.initialInventoryType === 'units'
    ? state.initialInventoryUnits
    : state.initialInventoryUnitCost > 0 
      ? state.initialInventoryMoney / state.initialInventoryUnitCost 
      : 0;

  return (
    <Card className="border-border/50 bg-card/50 shadow-none transition-colors duration-200 hover:bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <Package className="h-3.5 w-3.5 text-primary" />
          </div>
          A) Inventario Inicial de Materia Prima
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tipo de valor
          </Label>
          <ValueTypeToggle 
            value={state.initialInventoryType} 
            onChange={(v) => handleTypeChange(v as ValueType)} 
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.initialInventoryType === 'units' ? (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Unidades</Label>
                <Input
                  type="number"
                  min={0}
                  value={state.initialInventoryUnits || ''}
                  onChange={(e) => onChange({ initialInventoryUnits: Number(e.target.value) })}
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
                  value={state.initialInventoryUnitCost || ''}
                  onChange={(e) => onChange({ initialInventoryUnitCost: Number(e.target.value) })}
                  placeholder="0.00"
                  className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Valor Total ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={state.initialInventoryMoney || ''}
                  onChange={(e) => onChange({ initialInventoryMoney: Number(e.target.value) })}
                  placeholder="0.00"
                  className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Costo Unitario ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={state.initialInventoryUnitCost || ''}
                  onChange={(e) => onChange({ initialInventoryUnitCost: Number(e.target.value) })}
                  placeholder="0.00"
                  className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Método de Inventario (Output)
          </Label>
          <Select 
            value={state.inventoryMethod} 
            onValueChange={(v) => onChange({ inventoryMethod: v as 'promedio' | 'peps' | 'ueps' })}
          >
            <SelectTrigger className="h-10 w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20 sm:w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="promedio">Promedio Ponderado</SelectItem>
              <SelectItem value="peps">PEPS (Primeras Entradas, Primeras Salidas)</SelectItem>
              <SelectItem value="ueps">UEPS (Últimas Entradas, Primeras Salidas)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Total Inventario Inicial:</span>
            <span className="font-semibold text-foreground tabular-nums">
              {totalUnits.toFixed(2)} U / ${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
