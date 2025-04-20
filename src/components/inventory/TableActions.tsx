
import { Button } from "@/components/ui/button";
import { Calculator, List } from "lucide-react";
import { AddOperationDialog } from "./AddOperationDialog";
import { InventoryOperation } from "@/types/inventory";

interface TableActionsProps {
  onAddOperation: (values: Omit<InventoryOperation, 'id' | 'averageCost' | 'balance' | 'stockBalance' | 'totalCost'>) => void;
  onCalculateAverage: () => void;
  onViewHistory: () => void;
}

export function TableActions({ onAddOperation, onCalculateAverage, onViewHistory }: TableActionsProps) {
  return (
    <div className="flex gap-2">
      <AddOperationDialog onSubmit={onAddOperation} />
      <Button onClick={onCalculateAverage} variant="secondary" className="gap-2">
        <Calculator className="h-4 w-4" />
        Calcular Promedio Automático
      </Button>
      <Button onClick={onViewHistory} variant="outline" className="gap-2">
        <List className="h-4 w-4" />
        Ver Historial Completo
      </Button>
    </div>
  );
}
