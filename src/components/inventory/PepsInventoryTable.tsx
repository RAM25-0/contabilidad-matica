
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
          <div className="rounded-md border">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Fecha</TableHead>
                    <TableHead className="w-[200px]">Operación</TableHead>
                    <TableHead className="text-center">Entrada</TableHead>
                    <TableHead className="text-center">Salida</TableHead>
                    <TableHead className="text-center">Existencia</TableHead>
                    <TableHead className="text-center">UNITARIO</TableHead>
                    <TableHead className="text-right">Debe</TableHead>
                    <TableHead className="text-right">Haber</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.operations.map((operation) => {
                    // For sales and returns, we may need multiple rows
                    if (operation.type === 'VENTA' && operation.lots.length > 1) {
                      // First row has the operation description
                      const rows = [];
                      
                      // Create multiple rows, one for each lot used
                      operation.lots.forEach((lot, index) => {
                        rows.push(
                          <TableRow key={`${operation.id}-${index}`}>
                            {index === 0 && (
                              <>
                                <TableCell rowSpan={operation.lots.length}>{formatDate(operation.date)}</TableCell>
                                <TableCell rowSpan={operation.lots.length}>{operation.description}</TableCell>
                                <TableCell className="text-center" rowSpan={operation.lots.length}></TableCell>
                              </>
                            )}
                            {index !== 0 && <></>}
                            <TableCell className="text-center">{lot.units}</TableCell>
                            <TableCell className="text-center">
                              {index === operation.lots.length - 1 ? state.lots.reduce((sum, l) => sum + l.remainingUnits, 0) : ''}
                            </TableCell>
                            <TableCell className="text-center">{lot.unitCost}</TableCell>
                            <TableCell className="text-right"></TableCell>
                            <TableCell className="text-right">
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
                    
                    // Standard row for other operations
                    return (
                      <TableRow key={operation.id}>
                        <TableCell>{formatDate(operation.date)}</TableCell>
                        <TableCell>{operation.description}</TableCell>
                        <TableCell className="text-center">{operation.inUnits > 0 ? operation.inUnits : ''}</TableCell>
                        <TableCell className="text-center">{operation.outUnits > 0 ? operation.outUnits : ''}</TableCell>
                        <TableCell className="text-center">{state.lots.reduce((sum, lot) => sum + lot.remainingUnits, 0)}</TableCell>
                        <TableCell className="text-center">{operation.unitCost}</TableCell>
                        <TableCell className="text-right">{operation.totalCost > 0 && operation.type !== 'VENTA' ? formatCurrency(operation.totalCost) : ''}</TableCell>
                        <TableCell className="text-right">{operation.type === 'VENTA' ? formatCurrency(operation.totalCost) : ''}</TableCell>
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

      {/* Dialogs for different operations */}
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
