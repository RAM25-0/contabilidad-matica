
import React, { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Package } from "lucide-react";
import { UepsState, UepsOperation } from "@/hooks/useUepsInventory";
import { UepsTableHeader } from "./UepsTableHeader";
import { UepsTableRow } from "./UepsTableRow";
import { UepsOperationDialog } from "./UepsOperationDialog";

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

// Helper to calculate the running stock balance at each point
function calculateRunningStock(operations: UepsOperation[], currentIndex: number): number {
  let stockBalance = 0;
  
  for (let i = 0; i <= currentIndex; i++) {
    const op = operations[i];
    stockBalance += op.inUnits; // Add entries
    stockBalance -= op.outUnits; // Subtract outputs
  }
  
  return stockBalance;
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

  // Prepare operations with stock balance
  const operationsWithStock = state.operations.map((op, index) => {
    // Calculate running stock up to this operation
    const stockBalance = calculateRunningStock(state.operations, index);
    
    return {
      ...op,
      stockBalance
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          className="gap-2 bg-[#A9B4C2] hover:bg-[#96A0AD]"
          disabled={state.hasInitialBalance}
          onClick={() => setSelectedOperationType("SALDO_INICIAL")}
        >
          <Plus className="h-4 w-4" />
          Saldo Inicial
        </Button>
        
        <Button
          className="gap-2 bg-[#A9B4C2] hover:bg-[#96A0AD]"
          disabled={!state.hasInitialBalance}
          onClick={() => setSelectedOperationType("COMPRA")}
        >
          <Plus className="h-4 w-4" />
          Compra (Nuevo Lote)
        </Button>
        
        <Button
          className="gap-2 bg-[#52525B] hover:bg-[#3F3F46]"
          disabled={!state.hasInitialBalance || state.lots.every(l => l.remainingUnits <= 0)}
          onClick={() => setSelectedOperationType("VENTA")}
        >
          <Calendar className="h-4 w-4" />
          Venta
        </Button>
        
        <Button
          className="gap-2 bg-[#52525B] hover:bg-[#3F3F46]"
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
                <td colSpan={13} className="text-center py-4">
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
              state.operations.map((operation, index) => {
                // Calculate running stock up to this operation
                const stockBalance = calculateRunningStock(state.operations, index);
                
                // Create a modified version of the operation with stock balance
                const enhancedOperation = {
                  ...operation,
                  stockBalance
                };
                
                return (
                  <tr key={operation.id}>
                    <td colSpan={12} className="p-0 border-none">
                      <UepsTableRow
                        operation={enhancedOperation}
                        onEdit={onEditOperation}
                        onDelete={onDeleteOperation}
                      />
                    </td>
                  </tr>
                );
              })
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
