
import React, { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";
import { PepsOperationDialog } from "./PepsOperationDialog";
import { PepsTableHeader } from "./PepsTableHeader";
import { PepsTableRow } from "./PepsTableRow";
import { EditPepsOperationDialog } from "./EditPepsOperationDialog";
import { DeletePepsOperationDialog } from "./DeletePepsOperationDialog";

interface PepsInventoryTableProps {
  state: PepsState;
  onAddInitialBalance: (date: Date, units: number, unitCost: number, description: string) => void;
  onAddPurchase: (date: Date, lotName: string, units: number, unitCost: number, description: string) => void;
  onAddSale: (date: Date, units: number, description: string) => void;
  onAddReturn: (date: Date, lotId: string, units: number, description: string) => void;
  getAvailableLots: () => PepsLot[];
  onEditOperation: (operation: PepsOperation) => void;
  onDeleteOperation: (operation: PepsOperation) => void;
}

export function PepsInventoryTable({
  state,
  onAddInitialBalance,
  onAddPurchase,
  onAddSale,
  onAddReturn,
  getAvailableLots,
  onEditOperation,
  onDeleteOperation
}: PepsInventoryTableProps) {
  const [operationType, setOperationType] = useState<
    "SALDO_INICIAL" | "COMPRA" | "VENTA" | "DEVOLUCION" | null
  >(null);

  // Estados para controlar los diálogos de edición y eliminación
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [operationToEdit, setOperationToEdit] = useState<PepsOperation | null>(null);
  const [operationToDelete, setOperationToDelete] = useState<PepsOperation | null>(null);

  const handleCloseDialog = () => setOperationType(null);

  // Funciones para manejar la edición
  const handleEditClick = (operation: PepsOperation) => {
    setOperationToEdit(operation);
    setEditDialogOpen(true);
  };

  // Funciones para manejar la eliminación
  const handleDeleteClick = (operation: PepsOperation) => {
    setOperationToDelete(operation);
    setDeleteDialogOpen(true);
  };

  // Función para confirmar la edición
  const handleEditConfirm = (values: Partial<Omit<PepsOperation, "id" | "balance">>) => {
    if (operationToEdit) {
      onEditOperation(operationToEdit);
      setEditDialogOpen(false);
    }
  };

  // Función para confirmar la eliminación
  const handleDeleteConfirm = () => {
    if (operationToDelete) {
      onDeleteOperation(operationToDelete);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setOperationType("SALDO_INICIAL")}
          disabled={state.hasInitialBalance}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Saldo Inicial
        </Button>
        <Button
          onClick={() => setOperationType("COMPRA")}
          disabled={!state.hasInitialBalance}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Compra (Nuevo Lote)
        </Button>
        <Button
          onClick={() => setOperationType("VENTA")}
          disabled={
            !state.hasInitialBalance ||
            state.lots.every((lot) => lot.remainingUnits === 0)
          }
          className="gap-2"
        >
          <Calculator className="h-4 w-4" />
          Venta
        </Button>
        <Button
          onClick={() => setOperationType("DEVOLUCION")}
          disabled={!state.operations.some((op) => op.type === "VENTA")}
          className="gap-2"
        >
          <Calculator className="h-4 w-4" />
          Devolución
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto">
            <ScrollArea className="h-[600px]">
              <Table>
                <PepsTableHeader />
                <TableBody>
                  {state.operations.map((operation) => (
                    <PepsTableRow
                      key={operation.id}
                      operation={operation}
                      state={state}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para agregar operaciones */}
      {operationType && (
        <PepsOperationDialog
          type={operationType}
          onClose={handleCloseDialog}
          onAddInitialBalance={onAddInitialBalance}
          onAddPurchase={onAddPurchase}
          onAddSale={onAddSale}
          onAddReturn={onAddReturn}
          availableLots={getAvailableLots()}
        />
      )}

      {/* Diálogo para editar operaciones */}
      <EditPepsOperationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        operation={operationToEdit}
        onSubmit={handleEditConfirm}
      />

      {/* Diálogo para eliminar operaciones */}
      <DeletePepsOperationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        operation={operationToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
