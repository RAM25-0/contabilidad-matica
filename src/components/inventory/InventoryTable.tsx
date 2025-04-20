
import { Table, TableBody } from "@/components/ui/table";
import { InventoryOperation } from "@/types/inventory";
import { TableActions } from "./TableActions";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { InventoryTableRow } from "./InventoryTableRow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { EditOperationDialog } from "./EditOperationDialog";
import { DeleteOperationDialog } from "./DeleteOperationDialog";
import { useToast } from "@/hooks/use-toast";

interface InventoryTableProps {
  operations: InventoryOperation[];
  onAddOperation: (values: Omit<InventoryOperation, 'id' | 'averageCost' | 'balance' | 'stockBalance' | 'totalCost'>) => void;
  onCalculateAverage: () => void;
  onViewHistory: () => void;
  onEditOperation: (id: string, values: Omit<InventoryOperation, 'id' | 'averageCost' | 'balance' | 'stockBalance' | 'totalCost'>) => void;
  onDeleteOperation: (id: string) => void;
}

export function InventoryTable({ 
  operations, 
  onAddOperation, 
  onCalculateAverage,
  onViewHistory,
  onEditOperation,
  onDeleteOperation
}: InventoryTableProps) {
  const [editingOperation, setEditingOperation] = useState<InventoryOperation | null>(null);
  const [deletingOperation, setDeletingOperation] = useState<InventoryOperation | null>(null);
  const { toast } = useToast();

  const handleEdit = (operation: InventoryOperation) => {
    setEditingOperation(operation);
  };

  const handleDelete = (operation: InventoryOperation) => {
    setDeletingOperation(operation);
  };

  const handleEditSubmit = (values: Omit<InventoryOperation, 'id' | 'averageCost' | 'balance' | 'stockBalance' | 'totalCost'>) => {
    if (editingOperation) {
      onEditOperation(editingOperation.id, values);
      toast({
        title: "Operación actualizada",
        description: "La operación se ha actualizado correctamente.",
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingOperation) {
      onDeleteOperation(deletingOperation.id);
      setDeletingOperation(null);
      toast({
        title: "Operación eliminada",
        description: "La operación se ha eliminado correctamente.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <TableActions 
        onAddOperation={onAddOperation}
        onCalculateAverage={onCalculateAverage}
        onViewHistory={onViewHistory}
      />

      <div className="rounded-md border">
        <ScrollArea className="h-[600px]">
          <Table>
            <InventoryTableHeader />
            <TableBody>
              {operations.map((operation) => (
                <InventoryTableRow 
                  key={operation.id} 
                  operation={operation}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {editingOperation && (
        <EditOperationDialog
          operation={editingOperation}
          onSubmit={handleEditSubmit}
          open={!!editingOperation}
          onOpenChange={(open) => !open && setEditingOperation(null)}
        />
      )}

      <DeleteOperationDialog
        open={!!deletingOperation}
        onOpenChange={(open) => !open && setDeletingOperation(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
