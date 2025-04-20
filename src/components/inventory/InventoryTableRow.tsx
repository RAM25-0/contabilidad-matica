
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { InventoryOperation } from "@/types/inventory";

interface InventoryTableRowProps {
  operation: InventoryOperation;
}

export function InventoryTableRow({ operation }: InventoryTableRowProps) {
  const isEntry = operation.type === 'COMPRA' || operation.type === 'SALDO_INICIAL' || operation.type === 'DEVOLUCION';

  const DividerCell = () => (
    <td
      style={{
        width: "2px",
        background: "#403E43", // Darker divider color
        padding: 0,
        border: "none"
      }}
      aria-hidden
    ></td>
  );

  return (
    <TableRow className="hover:bg-[#F6F6F7] border-b border-[#403E43]">
      <TableCell className="w-[120px] text-[#403E43] bg-white border-r border-[#403E43]">
        {new Date(operation.date).toLocaleDateString()}
      </TableCell>
      <TableCell className="w-[230px] text-[#403E43] bg-white border-r border-[#403E43]">
        {operation.description || operation.type}
      </TableCell>
      <DividerCell />

      {/* UNIDADES */}
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#D3E4FD] border-r border-[#403E43]">
        {isEntry ? operation.units : ''}
      </TableCell>
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#D3E4FD] border-r border-[#403E43]">
        {!isEntry ? operation.units : ''}
      </TableCell>
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#D3E4FD]">
        {operation.stockBalance}
      </TableCell>
      <DividerCell />

      {/* COSTO */}
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#F2FCE2] border-r border-[#403E43]">
        {isEntry && operation.unitCost ? formatCurrency(operation.unitCost) : ''}
      </TableCell>
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#F2FCE2]">
        {formatCurrency(operation.averageCost)}
      </TableCell>
      <DividerCell />

      {/* VALORES */}
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#FFDEE2] border-r border-[#403E43]">
        {isEntry ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#FFDEE2] border-r border-[#403E43]">
        {!isEntry ? formatCurrency(operation.totalCost) : ''}
      </TableCell>
      <TableCell className="text-center w-[120px] text-[#403E43] bg-[#FFDEE2]">
        {formatCurrency(operation.balance)}
      </TableCell>
    </TableRow>
  );
}
