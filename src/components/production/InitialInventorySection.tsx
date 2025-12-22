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
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          A) Inventario Inicial de Materia Prima
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Tipo de valor</Label>
          <ValueTypeToggle 
            value={state.initialInventoryType} 
            onChange={(v) => handleTypeChange(v as ValueType)} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {state.initialInventoryType === 'units' ? (
            <>
              <div className="space-y-2">
                <Label>Unidades</Label>
                <Input
                  type="number"
                  min={0}
                  value={state.initialInventoryUnits || ''}
                  onChange={(e) => onChange({ initialInventoryUnits: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Unitario ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={state.initialInventoryUnitCost || ''}
                  onChange={(e) => onChange({ initialInventoryUnitCost: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Valor Total ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={state.initialInventoryMoney || ''}
                  onChange={(e) => onChange({ initialInventoryMoney: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Unitario ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={state.initialInventoryUnitCost || ''}
                  onChange={(e) => onChange({ initialInventoryUnitCost: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Método de Inventario (Output)</Label>
          <Select 
            value={state.inventoryMethod} 
            onValueChange={(v) => onChange({ inventoryMethod: v as 'promedio' | 'peps' | 'ueps' })}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="promedio">Promedio Ponderado</SelectItem>
              <SelectItem value="peps">PEPS (Primeras Entradas, Primeras Salidas)</SelectItem>
              <SelectItem value="ueps">UEPS (Últimas Entradas, Primeras Salidas)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Inventario Inicial:</span>
            <span className="font-medium">
              {totalUnits.toFixed(2)} U / ${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
