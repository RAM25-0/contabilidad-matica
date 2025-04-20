
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { InventoryOperation } from "@/types/inventory";

interface InventoryTableRowProps {
  operation: InventoryOperation;
}

export function InventoryTableRow({ operation }: InventoryTableRowProps) {
  return (
    <TableRow>
      <TableCell className="w-24">
        {new Date(operation.date).toLocaleDateString()}
      </TableCell>
      <TableCell className="w-28">{operation.type}</TableCell>
      <TableCell className="w-40">{operation.description}</TableCell>
      <TableCell className="text-right w-20">
        {operation.type === 'COMPRA' || operation.type === 'DEVOLUCION' ? operation.units : ''}
      </TableCell>
      <TableCell className="text-right w-20">
        {operation.type === 'VENTA' ? operation.units : ''}
      </TableCell>
      <TableCell className="text-right w-24">{operation.stockBalance}</TableCell>
      <TableCell className="text-right w-24">
        {(operation.type === 'COMPRA' || operation.type === 'DEVOLUCION') ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right w-24">
        {operation.type === 'VENTA' ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right w-24">
        {formatCurrency(operation.averageCost)}
      </TableCell>
      <TableCell className="text-right w-20">
        {(operation.type === 'COMPRA' || operation.type === 'DEVOLUCION') ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right w-20">
        {operation.type === 'VENTA' ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right w-24">
        {formatCurrency(operation.balance)}
      </TableCell>
    </TableRow>
  );
}
