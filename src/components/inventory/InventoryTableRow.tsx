
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { InventoryOperation } from "@/types/inventory";

interface InventoryTableRowProps {
  operation: InventoryOperation;
}

export function InventoryTableRow({ operation }: InventoryTableRowProps) {
  return (
    <TableRow>
      <TableCell className="w-[100px]">
        {new Date(operation.date).toLocaleDateString()}
      </TableCell>
      <TableCell className="w-[120px]">{operation.type}</TableCell>
      <TableCell className="w-[180px]">{operation.description}</TableCell>
      <TableCell className="text-right w-[90px]">
        {operation.type === 'COMPRA' || operation.type === 'DEVOLUCION' ? operation.units : ''}
      </TableCell>
      <TableCell className="text-right w-[90px]">
        {operation.type === 'VENTA' ? operation.units : ''}
      </TableCell>
      <TableCell className="text-right w-[100px]">{operation.stockBalance}</TableCell>
      <TableCell className="text-right w-[110px]">
        {(operation.type === 'COMPRA' || operation.type === 'DEVOLUCION') ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right w-[110px]">
        {operation.type === 'VENTA' ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right w-[110px]">
        {formatCurrency(operation.averageCost)}
      </TableCell>
      <TableCell className="text-right w-[90px]">
        {(operation.type === 'COMPRA' || operation.type === 'DEVOLUCION') ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right w-[90px]">
        {operation.type === 'VENTA' ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right w-[110px]">
        {formatCurrency(operation.balance)}
      </TableCell>
    </TableRow>
  );
}
