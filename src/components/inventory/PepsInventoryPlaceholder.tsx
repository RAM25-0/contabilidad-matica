
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { PepsInventoryTable } from "./PepsInventoryTable";
import { usePepsInventory } from "@/hooks/usePepsInventory";
import { EditPepsOperationDialog } from "./EditPepsOperationDialog";
import { DeletePepsOperationDialog } from "./DeletePepsOperationDialog";
import type { PepsOperation } from "@/types/peps-inventory";

export function PepsInventoryPlaceholder() {
  const {
    state,
    handleAddInitialBalance,
    handleAddPurchase,
    handleAddSale,
    handleAddReturn,
    getAvailableLots,
    handleEditOperation,
    handleDeleteOperation,
  } = usePepsInventory();

  // Estados para controlar el diálogo de edición/borrado
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [operationToEdit, setOperationToEdit] = useState<PepsOperation | null>(null);
  const [operationToDelete, setOperationToDelete] = useState<PepsOperation | null>(null);

  // Funciones de apertura de diálogos
  const openEditDialog = (operation: PepsOperation) => {
    setOperationToEdit(operation);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (operation: PepsOperation) => {
    setOperationToDelete(operation);
    setDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-violet-500" />
          <CardTitle>Método de Valuación - PEPS</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <PepsInventoryTable 
          state={state}
          onAddInitialBalance={handleAddInitialBalance}
          onAddPurchase={handleAddPurchase}
          onAddSale={handleAddSale}
          onAddReturn={handleAddReturn}
          getAvailableLots={getAvailableLots}
          onEditOperation={openEditDialog}
          onDeleteOperation={openDeleteDialog}
        />

        {/* Diálogo de edición */}
        <EditPepsOperationDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          operation={operationToEdit}
          onSubmit={(values) => {
            if (operationToEdit) {
              handleEditOperation(operationToEdit.id, values);
            }
          }}
        />

        {/* Diálogo de borrado */}
        <DeletePepsOperationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          operation={operationToDelete}
          onConfirm={() => {
            if (operationToDelete) {
              handleDeleteOperation(operationToDelete.id);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
