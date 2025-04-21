import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Calculator, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";
import { formatCurrency } from "@/lib/utils";
import { PepsOperationDialog } from "./PepsOperationDialog";
import { EditPepsOperationDialog } from "./EditPepsOperationDialog";
import { DeletePepsOperationDialog } from "./DeletePepsOperationDialog";

interface PepsInventoryTableProps {
  state: PepsState;
  onAddInitialBalance: (date: Date, units: number, unitCost: number, description: string) => void;
  onAddPurchase: (date: Date, lotName: string, units: number, unitCost: number, description: string) => void;
  onAddSale: (date: Date, units: number, description: string) => void;
  onAddReturn: (date: Date, lotId: string, units: number, description: string) => void;
  getAvailableLots: () => PepsLot[];
}

export function PepsInventoryTable({
  state,
  onAddInitialBalance,
  onAddPurchase,
  onAddSale,
  onAddReturn,
  getAvailableLots
}: PepsInventoryTableProps) {
  const [operationType, setOperationType] = useState<
    "SALDO_INICIAL" | "COMPRA" | "VENTA" | "DEVOLUCION" | null
  >(null);

  const [editingOperation, setEditingOperation] = useState<PepsOperation | null>(null);
  const [deletingOperation, setDeletingOperation] = useState<PepsOperation | null>(null);

  const handleCloseDialog = () => setOperationType(null);

  // Formato de fecha para mostrar
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  // DIVIDER CELL: similar a tabla de promedio
  const DividerCell = () => (
    <td
      style={{
        width: "2px",
        background: "#403E43",
        padding: 0,
        border: "none"
      }}
      aria-hidden
    ></td>
  );

  // NUEVO: Renderizar columna de acciones solo para registros de operaciones
  const renderActionsCell = (operation: PepsOperation) => (
    <td className="w-[90px] bg-white border-l border-[#403E43] text-center">
      <div className="flex gap-1 justify-center">
        <button
          className="p-1 rounded hover:bg-violet-100"
          title="Editar"
          onClick={() => setEditingOperation(operation)}
        >
          <Edit size={18} color="#7E69AB" />
        </button>
        <button
          className="p-1 rounded hover:bg-red-100"
          title="Borrar"
          onClick={() => setDeletingOperation(operation)}
        >
          <Trash2 size={18} color="#ea384c" />
        </button>
      </div>
    </td>
  );

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
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="w-[220px] bg-[#F6F6F7] text-[#403E43] border-b border-gray-200"
                      colSpan={2}
                    >
                      <div className="font-semibold text-center">
                        MÉTODO DE VALUACIÓN: PEPS
                      </div>
                    </TableHead>
                    <DividerCell />
                    <TableHead
                      className="text-[#403E43] bg-[#D3E4FD] text-center border-r border-[#403E43]"
                      colSpan={3}
                    >
                      UNIDADES
                    </TableHead>
                    <DividerCell />
                    <TableHead
                      className="text-[#403E43] bg-[#E1FBE1] text-center"
                      colSpan={1}
                    >
                      COSTO
                    </TableHead>
                    <DividerCell />
                    <TableHead
                      className="text-[#403E43] bg-[#FFDEE2] text-center"
                      colSpan={3}
                    >
                      VALORES
                    </TableHead>
                  </TableRow>
                  <TableRow className="border-b border-[#403E43]">
                    <TableHead className="w-[120px] text-[#403E43] border-r border-[#403E43] bg-[#F6F6F7]">
                      Fecha
                    </TableHead>
                    <TableHead className="w-[100px] text-[#403E43] border-r border-[#403E43] bg-[#F6F6F7]">
                      Operación
                    </TableHead>
                    <DividerCell />
                    <TableHead className="w-[90px] bg-[#D3E4FD] text-center text-[#403E43] border-r border-[#403E43]">
                      Entrada
                    </TableHead>
                    <TableHead className="w-[90px] bg-[#D3E4FD] text-center text-[#403E43] border-r border-[#403E43]">
                      Salida
                    </TableHead>
                    <TableHead className="w-[90px] bg-[#D3E4FD] text-center text-[#403E43]">
                      Existencia
                    </TableHead>
                    <DividerCell />
                    <TableHead className="w-[90px] bg-[#E1FBE1] text-center text-[#403E43]">
                      C/Unitario
                    </TableHead>
                    <DividerCell />
                    <TableHead className="w-[90px] bg-[#FFDEE2] text-center text-[#403E43] border-r border-[#403E43]">
                      Debe
                    </TableHead>
                    <TableHead className="w-[90px] bg-[#FFDEE2] text-center text-[#403E43] border-r border-[#403E43]">
                      Haber
                    </TableHead>
                    <TableHead className="w-[90px] bg-[#FFDEE2] text-center text-[#403E43]">
                      Saldo
                    </TableHead>
                    <TableHead className="w-[90px] text-[#403E43] bg-[#F6F6F7]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.operations.map((operation) => {
                    if (operation.type === "VENTA" && operation.lots.length > 1) {
                      // Manejo especial para ventas con múltiples lotes
                      const rows = [];
                      // Primera fila de venta múltiple
                      rows.push(
                        <TableRow key={`${operation.id}-main`} className="hover:bg-[#F6F6F7] border-b border-[#403E43]">
                          <TableCell 
                            className="w-[120px] text-[#403E43] bg-white border-r border-[#403E43]"
                            rowSpan={operation.lots.length}
                          >
                            {formatDate(operation.date)}
                          </TableCell>
                          <TableCell 
                            className="w-[100px] text-[#403E43] bg-white border-r border-[#403E43]"
                            rowSpan={operation.lots.length}
                          >
                            {operation.description}
                          </TableCell>
                          <DividerCell />
                          <TableCell className="text-center w-[90px] bg-[#D3E4FD] border-r border-[#403E43]" />
                          <TableCell className="text-center w-[90px] bg-[#D3E4FD] border-r border-[#403E43]">
                            {operation.lots[0].units}
                          </TableCell>
                          <TableCell className="text-center w-[90px] bg-[#D3E4FD]" />
                          <DividerCell />
                          <TableCell className="text-center w-[90px] bg-[#E1FBE1]">
                            {operation.lots[0].unitCost}
                          </TableCell>
                          <DividerCell />
                          <TableCell className="text-right w-[90px] bg-[#FFDEE2] border-r border-[#403E43]" />
                          <TableCell className="text-right w-[90px] bg-[#FFDEE2] border-r border-[#403E43]">
                            {formatCurrency(operation.lots[0].units * operation.lots[0].unitCost)}
                          </TableCell>
                          <TableCell className="text-right w-[90px] bg-[#FFDEE2]" />
                          {renderActionsCell(operation)}
                        </TableRow>
                      );

                      // Filas subsecuentes de la venta múltiple
                      for (let i = 1; i < operation.lots.length; i++) {
                        const lot = operation.lots[i];
                        const isLastRow = i === operation.lots.length - 1;
                        
                        rows.push(
                          <TableRow key={`${operation.id}-${i}`} className="hover:bg-[#F6F6F7] border-b border-[#403E43]">
                            {/* Fecha y operación ya están en rowSpan de la primera fila */}
                            <DividerCell />
                            <TableCell className="text-center w-[90px] bg-[#D3E4FD] border-r border-[#403E43]" />
                            <TableCell className="text-center w-[90px] bg-[#D3E4FD] border-r border-[#403E43]">
                              {lot.units}
                            </TableCell>
                            <TableCell className="text-center w-[90px] bg-[#D3E4FD]">
                              {isLastRow ? state.lots.reduce((sum, l) => sum + l.remainingUnits, 0) : ""}
                            </TableCell>
                            <DividerCell />
                            <TableCell className="text-center w-[90px] bg-[#E1FBE1]">
                              {lot.unitCost}
                            </TableCell>
                            <DividerCell />
                            <TableCell className="text-right w-[90px] bg-[#FFDEE2] border-r border-[#403E43]" />
                            <TableCell className="text-right w-[90px] bg-[#FFDEE2] border-r border-[#403E43]">
                              {formatCurrency(lot.units * lot.unitCost)}
                            </TableCell>
                            <TableCell className="text-right w-[90px] bg-[#FFDEE2]">
                              {isLastRow ? formatCurrency(operation.balance) : ""}
                            </TableCell>
                          </TableRow>
                        );
                      }
                      
                      return rows;
                    }

                    // Operaciones normales (Saldo Inicial, Compra, Venta simple, Devolución)
                    return (
                      <TableRow key={operation.id} className="hover:bg-[#F6F6F7] border-b border-[#403E43]">
                        <TableCell className="w-[120px] text-[#403E43] bg-white border-r border-[#403E43]">
                          {formatDate(operation.date)}
                        </TableCell>
                        <TableCell className="w-[100px] text-[#403E43] bg-white border-r border-[#403E43]">
                          {operation.description}
                        </TableCell>
                        <DividerCell />
                        <TableCell className="text-center w-[90px] bg-[#D3E4FD] border-r border-[#403E43]">
                          {operation.inUnits > 0 ? operation.inUnits : ""}
                        </TableCell>
                        <TableCell className="text-center w-[90px] bg-[#D3E4FD] border-r border-[#403E43]">
                          {operation.outUnits > 0 ? operation.outUnits : ""}
                        </TableCell>
                        <TableCell className="text-center w-[90px] bg-[#D3E4FD]">
                          {state.lots.reduce((sum, lot) => sum + lot.remainingUnits, 0)}
                        </TableCell>
                        <DividerCell />
                        <TableCell className="text-center w-[90px] bg-[#E1FBE1]">
                          {operation.unitCost}
                        </TableCell>
                        <DividerCell />
                        <TableCell className="text-right w-[90px] bg-[#FFDEE2] border-r border-[#403E43]">
                          {operation.totalCost > 0 && operation.type !== "VENTA"
                            ? formatCurrency(operation.totalCost)
                            : ""}
                        </TableCell>
                        <TableCell className="text-right w-[90px] bg-[#FFDEE2] border-r border-[#403E43]">
                          {operation.type === "VENTA"
                            ? formatCurrency(operation.totalCost)
                            : ""}
                        </TableCell>
                        <TableCell className="text-right w-[90px] bg-[#FFDEE2]">
                          {formatCurrency(operation.balance)}
                        </TableCell>
                        {renderActionsCell(operation)}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
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
      <EditPepsOperationDialog
        open={!!editingOperation}
        onOpenChange={(open) => !open && setEditingOperation(null)}
        operation={editingOperation}
        onSubmit={(values) => {
          if (editingOperation) {
            onAddInitialBalance?.handleEditOperation?.(editingOperation.id, values);
            setEditingOperation(null);
          }
        }}
      />
      <DeletePepsOperationDialog
        open={!!deletingOperation}
        onOpenChange={(open) => !open && setDeletingOperation(null)}
        operation={deletingOperation}
        onConfirm={() => {
          if (deletingOperation) {
            onAddInitialBalance?.handleDeleteOperation?.(deletingOperation.id);
            setDeletingOperation(null);
          }
        }}
      />
    </div>
  );
}
