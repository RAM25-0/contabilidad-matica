
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PepsOperation } from "@/types/peps-inventory";
import { formatCurrency } from "@/lib/utils";
import { PepsOperationDialog } from "./PepsOperationDialog";
import { usePepsInventory } from "@/hooks/usePepsInventory";

export function PepsInventoryTable() {
  const {
    state,
    handleAddInitialBalance,
    handleAddPurchase,
    handleAddSale,
    handleAddReturn,
    getAvailableLots,
  } = usePepsInventory();
  
  const [operationType, setOperationType] = useState<'SALDO_INICIAL' | 'COMPRA' | 'VENTA' | 'DEVOLUCION' | null>(null);

  const handleCloseDialog = () => {
    setOperationType(null);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {/* Botones de operaciones (igual que antes) */}
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={() => setOperationType('SALDO_INICIAL')}
          disabled={state.hasInitialBalance}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Saldo Inicial
        </Button>
        
        <Button 
          onClick={() => setOperationType('COMPRA')} 
          disabled={!state.hasInitialBalance}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Compra (Nuevo Lote)
        </Button>
        
        <Button 
          onClick={() => setOperationType('VENTA')} 
          disabled={!state.hasInitialBalance || state.lots.every(lot => lot.remainingUnits === 0)}
          className="gap-2"
        >
          <Calculator className="h-4 w-4" />
          Venta
        </Button>
        
        <Button 
          onClick={() => setOperationType('DEVOLUCION')} 
          disabled={!state.operations.some(op => op.type === 'VENTA')}
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
                {/* Primera fila de encabezados agrupados */}
                <thead>
                  <TableRow>
                    <TableHead className="border-b border-r bg-gray-50 font-semibold text-base" style={{ minWidth: 110 }}>MÉTODO DE VALUACIÓN: PEPS</TableHead>
                    <TableHead colSpan={3} className="border-b border-r bg-blue-100 text-center font-semibold text-base">UNIDADES</TableHead>
                    <TableHead colSpan={1} className="border-b border-r bg-green-100 text-center font-semibold text-base">COSTO</TableHead>
                    <TableHead colSpan={3} className="border-b bg-rose-100 text-center font-semibold text-base">VALORES</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="border-b border-r bg-gray-50">Fecha</TableHead>
                    <TableHead className="border-b border-r bg-gray-50">Operación</TableHead>
                    <TableHead className="border-b border-r bg-blue-50 text-center">Entrada</TableHead>
                    <TableHead className="border-b border-r bg-blue-50 text-center">Salida</TableHead>
                    <TableHead className="border-b border-r bg-blue-50 text-center">Existencia</TableHead>
                    <TableHead className="border-b border-r bg-green-50 text-center">Entrada $</TableHead>
                    <TableHead className="border-b border-r bg-rose-50 text-center">Debe</TableHead>
                    <TableHead className="border-b border-r bg-rose-50 text-center">Haber</TableHead>
                    <TableHead className="border-b bg-rose-50 text-center">Saldo</TableHead>
                  </TableRow>
                </thead>
                <TableBody>
                  {state.operations.map((operation) => {
                    // Lógica de filas (como antes, sin cambios)
                    if (operation.type === 'VENTA' && operation.lots.length > 1) {
                      const rows = [];
                      operation.lots.forEach((lot, index) => {
                        rows.push(
                          <TableRow key={`${operation.id}-${index}`}>
                            {index === 0 && (
                              <>
                                <TableCell rowSpan={operation.lots.length} className="border-r">{formatDate(operation.date)}</TableCell>
                                <TableCell rowSpan={operation.lots.length} className="border-r">{operation.description}</TableCell>
                                <TableCell className="border-r text-center" rowSpan={operation.lots.length}></TableCell>
                              </>
                            )}
                            {index !== 0 && <></>}
                            <TableCell className="border-r text-center">{lot.units}</TableCell>
                            <TableCell className="border-r text-center">
                              {index === operation.lots.length - 1 ? state.lots.reduce((sum, l) => sum + l.remainingUnits, 0) : ''}
                            </TableCell>
                            <TableCell className="border-r text-center">{lot.unitCost}</TableCell>
                            <TableCell className="border-r text-right"></TableCell>
                            <TableCell className="border-r text-right">
                              {index === operation.lots.length - 1 ? formatCurrency(operation.totalCost) : formatCurrency(lot.units * lot.unitCost)}
                            </TableCell>
                            <TableCell className="text-right">
                              {index === operation.lots.length - 1 ? formatCurrency(operation.balance) : ''}
                            </TableCell>
                          </TableRow>
                        );
                      });
                      return rows;
                    }
                    return (
                      <TableRow key={operation.id}>
                        <TableCell className="border-r">{formatDate(operation.date)}</TableCell>
                        <TableCell className="border-r">{operation.description}</TableCell>
                        <TableCell className="border-r text-center">{operation.inUnits > 0 ? operation.inUnits : ''}</TableCell>
                        <TableCell className="border-r text-center">{operation.outUnits > 0 ? operation.outUnits : ''}</TableCell>
                        <TableCell className="border-r text-center">{state.lots.reduce((sum, lot) => sum + lot.remainingUnits, 0)}</TableCell>
                        <TableCell className="border-r text-center">{operation.unitCost}</TableCell>
                        <TableCell className="border-r text-right">{operation.totalCost > 0 && operation.type !== 'VENTA' ? formatCurrency(operation.totalCost) : ''}</TableCell>
                        <TableCell className="border-r text-right">{operation.type === 'VENTA' ? formatCurrency(operation.totalCost) : ''}</TableCell>
                        <TableCell className="text-right">{formatCurrency(operation.balance)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs para operaciones */}
      {operationType && (
        <PepsOperationDialog
          type={operationType}
          onClose={handleCloseDialog}
          onAddInitialBalance={handleAddInitialBalance}
          onAddPurchase={handleAddPurchase}
          onAddSale={handleAddSale}
          onAddReturn={handleAddReturn}
          availableLots={getAvailableLots()}
        />
      )}
    </div>
  );
}
