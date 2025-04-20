
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { InventoryOperation } from "@/types/inventory";

interface InventoryTableRowProps {
  operation: InventoryOperation;
}

export function InventoryTableRow({ operation }: InventoryTableRowProps) {
  const isEntry = operation.type === 'COMPRA' || operation.type === 'SALDO_INICIAL' || operation.type === 'DEVOLUCION';

  // Helper para divisor de columnas
  const DividerCell = () => (
    <td
      style={{
        width: "2px",
        background: "#C8C8C9",
        padding: 0,
        border: "none"
      }}
      aria-hidden
    ></td>
  );

  return (
    <TableRow className="hover:bg-[#F6F6F7]">
      <TableCell className="w-[120px] text-[#403E43] bg-white">{new Date(operation.date).toLocaleDateString()}</TableCell>
      <TableCell className="w-[230px] text-[#403E43] bg-white">{operation.description || operation.type}</TableCell>
      <DividerCell />

      {/* UNIDADES */}
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#D3E4FD]">
        {isEntry ? operation.units : ''}
      </TableCell>
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#D3E4FD]">
        {!isEntry ? operation.units : ''}
      </TableCell>
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#D3E4FD]">
        {operation.stockBalance}
      </TableCell>
      <DividerCell />

      {/* COSTO */}
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#F2FCE2]">
        {isEntry && operation.unitCost ? formatCurrency(operation.unitCost) : ''}
      </TableCell>
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#F2FCE2]">
        {formatCurrency(operation.averageCost)}
      </TableCell>
      <DividerCell />

      {/* VALORES */}
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#FFDEE2]">
        {isEntry ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#FFDEE2]">
        {!isEntry ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#FFDEE2]">
        {formatCurrency(operation.balance)}
      </TableCell>
    </TableRow>
  );
}
