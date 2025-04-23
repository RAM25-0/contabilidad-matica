
import React, { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Package } from "lucide-react";
import { UepsState, UepsOperation } from "@/hooks/useUepsInventory";
import { UepsTableHeader } from "./UepsTableHeader";
import { UepsTableRow } from "./UepsTableRow";
import { UepsOperationDialog } from "./UepsOperationDialog";
import { EditOperationDialog } from "./EditOperationDialog";
import { DeleteOperationDialog } from "./DeleteOperationDialog";

interface UepsInventoryTableProps {
  state: UepsState;
  onAddInitialBalance: (date: Date, units: number, unitCost: number, description: string) => void;
  onAddPurchase: (date: Date, lotName: string, units: number, unitCost: number, description: string) => void;
  onAddSale: (date: Date, units: number, description: string) => void;
  onAddReturn: (date: Date, lotId: string, units: number, description: string) => void;
  getAvailableLots: () => any[];
  onEditOperation: (operationId: string, values: Partial<UepsOperation>) => void;
  onDeleteOperation: (operationId: string) => void;
}

export function UepsInventoryTable({
  state,
  onAddInitialBalance,
  onAddPurchase,
  onAddSale,
  onAddReturn,
  getAvailableLots,
  onEditOperation,
  onDeleteOperation,
}: UepsInventoryTableProps) {
  const [selectedOperationType, setSelectedOperationType] = useState<
    "SALDO_INICIAL" | "COMPRA" | "VENTA" | "DEVOLUCION" | null
  >(null);
  
  const handleCloseDialog = () => {
    setSelectedOperationType(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          className="gap-2 bg-[#586A84] hover:bg-[#465469]"
          disabled={state.hasInitialBalance}
          onClick={() => setSelectedOperationType("SALDO_INICIAL")}
        >
          <Plus className="h-4 w-4" />
          Saldo Inicial
        </Button>
        
        <Button
          className="gap-2 bg-[#8894A8] hover:bg-[#6A7487]"
          disabled={!state.hasInitialBalance}
          onClick={() => setSelectedOperationType("COMPRA")}
        >
          <Plus className="h-4 w-4" />
          Compra (Nuevo Lote)
        </Button>
        
        <Button
          className="gap-2"
          disabled={!state.hasInitialBalance || state.lots.every(l => l.remainingUnits <= 0)}
          onClick={() => setSelectedOperationType("VENTA")}
        >
          <Calendar className="h-4 w-4" />
          Venta
        </Button>
        
        <Button
          className="gap-2"
          disabled={!state.hasInitialBalance || !getAvailableLots().length}
          onClick={() => setSelectedOperationType("DEVOLUCION")}
        >
          <Calendar className="h-4 w-4" />
          Devolución
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <UepsTableHeader />
          <TableBody>
            {state.operations.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                    <Package className="h-8 w-8" />
                    <p>No hay operaciones registradas</p>
                    <p className="text-sm">
                      Comienza agregando un saldo inicial
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              state.operations.map((operation) => (
                <UepsTableRow
                  key={operation.id}
                  operation={operation}
                  onEdit={onEditOperation}
                  onDelete={onDeleteOperation}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UepsOperationDialog
        open={selectedOperationType !== null}
        onClose={handleCloseDialog}
        operationType={selectedOperationType}
        onAddInitialBalance={onAddInitialBalance}
        onAddPurchase={onAddPurchase}
        onAddSale={onAddSale}
        onAddReturn={onAddReturn}
        availableLots={getAvailableLots()}
      />
    </div>
  );
}
