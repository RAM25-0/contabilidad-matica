
import { Table, TableBody } from "@/components/ui/table";
import { InventoryOperation } from "@/types/inventory";
import { TableActions } from "./TableActions";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { InventoryTableRow } from "./InventoryTableRow";

interface InventoryTableProps {
  operations: InventoryOperation[];
  onAddOperation: (values: Omit<InventoryOperation, 'id' | 'averageCost' | 'balance' | 'stockBalance' | 'totalCost'>) => void;
  onCalculateAverage: () => void;
  onViewHistory: () => void;
}

export function InventoryTable({ 
  operations, 
  onAddOperation, 
  onCalculateAverage,
  onViewHistory 
}: InventoryTableProps) {
  return (
    <div className="space-y-4">
      <TableActions 
        onAddOperation={onAddOperation}
        onCalculateAverage={onCalculateAverage}
        onViewHistory={onViewHistory}
      />

      <div className="rounded-md border">
        <Table>
          <InventoryTableHeader />
          <TableBody>
            {operations.map((operation) => (
              <InventoryTableRow 
                key={operation.id} 
                operation={operation}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
