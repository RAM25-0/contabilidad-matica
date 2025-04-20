
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { InventoryOperation } from "@/types/inventory";

interface InventoryTableRowProps {
  operation: InventoryOperation;
}

export function InventoryTableRow({ operation }: InventoryTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        {new Date(operation.date).toLocaleDateString()}
      </TableCell>
      <TableCell>{operation.type}</TableCell>
      <TableCell>{operation.description}</TableCell>
      <TableCell className="text-right">
        {operation.type === 'COMPRA' || operation.type === 'DEVOLUCION' ? operation.units : ''}
      </TableCell>
      <TableCell className="text-right">
        {operation.type === 'VENTA' ? operation.units : ''}
      </TableCell>
      <TableCell className="text-right">{operation.stockBalance}</TableCell>
      <TableCell className="text-right">
        {(operation.type === 'COMPRA' || operation.type === 'DEVOLUCION') ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right">
        {operation.type === 'VENTA' ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(operation.averageCost)}
      </TableCell>
      <TableCell className="text-right">
        {(operation.type === 'COMPRA' || operation.type === 'DEVOLUCION') ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right">
        {operation.type === 'VENTA' ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(operation.balance)}
      </TableCell>
    </TableRow>
  );
}
