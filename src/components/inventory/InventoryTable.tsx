
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calculator, List } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { InventoryOperation } from "@/types/inventory";
import { AddOperationDialog } from "./AddOperationDialog";

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Operación</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Entrada</TableHead>
              <TableHead className="text-right">Salida</TableHead>
              <TableHead className="text-right">Existencia</TableHead>
              <TableHead className="text-right">Entrada $</TableHead>
              <TableHead className="text-right">Salida $</TableHead>
              <TableHead className="text-right">Promedio</TableHead>
              <TableHead className="text-right">Debe</TableHead>
              <TableHead className="text-right">Haber</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations.map((op) => (
              <TableRow key={op.id}>
                <TableCell>
                  {new Date(op.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{op.type}</TableCell>
                <TableCell>{op.description}</TableCell>
                <TableCell className="text-right">
                  {op.type === 'COMPRA' || op.type === 'DEVOLUCION' ? op.units : ''}
                </TableCell>
                <TableCell className="text-right">
                  {op.type === 'VENTA' ? op.units : ''}
                </TableCell>
                <TableCell className="text-right">{op.stockBalance}</TableCell>
                <TableCell className="text-right">
                  {(op.type === 'COMPRA' || op.type === 'DEVOLUCION') ? formatCurrency(op.totalCost) : ''}
                </TableCell>
                <TableCell className="text-right">
                  {op.type === 'VENTA' ? formatCurrency(op.totalCost) : ''}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(op.averageCost)}
                </TableCell>
                <TableCell className="text-right">
                  {(op.type === 'COMPRA' || op.type === 'DEVOLUCION') ? formatCurrency(op.totalCost) : ''}
                </TableCell>
                <TableCell className="text-right">
                  {op.type === 'VENTA' ? formatCurrency(op.totalCost) : ''}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(op.balance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
