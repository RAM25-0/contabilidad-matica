
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { InventoryOperation } from "@/types/inventory";

interface InventoryTableRowProps {
  operation: InventoryOperation;
}

export function InventoryTableRow({ operation }: InventoryTableRowProps) {
  const isEntry = operation.type === 'COMPRA' || operation.type === 'SALDO_INICIAL' || operation.type === 'DEVOLUCION';
  
  return (
    <TableRow className="hover:bg-[#F6F6F7]">
      <TableCell className="w-[100px] text-[#403E43]">
        {new Date(operation.date).toLocaleDateString()}
      </TableCell>
      <TableCell className="w-[120px] text-[#403E43]">{operation.type}</TableCell>
      <TableCell className="w-[180px] text-[#403E43]">{operation.description}</TableCell>
      <TableCell className="text-right w-[90px] text-[#403E43]">
        {isEntry ? operation.units : ''}
      </TableCell>
      <TableCell className="text-right w-[90px] text-[#403E43]">
        {!isEntry ? operation.units : ''}
      </TableCell>
      <TableCell className="text-right w-[100px] text-[#403E43]">{operation.stockBalance}</TableCell>
      <TableCell className="text-right w-[110px] text-[#403E43]">
        {isEntry ? formatCurrency(operation.unitCost || 0) : ''}
      </TableCell>
      <TableCell className="text-right w-[110px] text-[#403E43]">
        {formatCurrency(operation.averageCost)}
      </TableCell>
      <TableCell className="text-right w-[90px] text-[#403E43]">
        {isEntry ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right w-[90px] text-[#403E43]">
        {!isEntry ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-right w-[110px] text-[#403E43]">
        {formatCurrency(operation.balance)}
      </TableCell>
    </TableRow>
  );
}
