
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { PepsLot, PepsOperation, PepsState } from "@/types/peps-inventory";
import { formatCurrency } from "@/lib/utils";
import { PepsRowActions } from "./PepsRowActions";

interface PepsTableRowProps {
  operation: PepsOperation;
  state: PepsState;
  onEdit: (op: PepsOperation) => void;
  onDelete: (op: PepsOperation) => void;
}

function DividerCell() {
  return (
    <td
      style={{
        width: "2px",
        background: "#403E43",
        padding: 0,
        border: "none",
      }}
      aria-hidden
    ></td>
  );
}

export function PepsTableRow({
  operation,
  state,
  onEdit,
  onDelete,
}: PepsTableRowProps) {
  // Handle VENTA operation with multiple lots (multi-row)
  if (operation.type === "VENTA" && operation.lots.length > 1) {
    const rows = [];
    rows.push(
      <TableRow key={`${operation.id}-main`} className="hover:bg-[#F6F6F7] border-b border-[#403E43]">
        <TableCell 
          className="w-[120px] text-[#403E43] bg-white border-r border-[#403E43]"
          rowSpan={operation.lots.length}
        >
          {new Intl.DateTimeFormat("es-MX", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }).format(operation.date)}
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
        <PepsRowActions operation={operation} onEdit={onEdit} onDelete={onDelete} />
      </TableRow>
    );

    for (let i = 1; i < operation.lots.length; i++) {
      const lot = operation.lots[i];
      const isLastRow = i === operation.lots.length - 1;
      rows.push(
        <TableRow key={`${operation.id}-${i}`} className="hover:bg-[#F6F6F7] border-b border-[#403E43]">
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
    return <>{rows}</>;
  }

  // Default case: single row operation
  return (
    <TableRow key={operation.id} className="hover:bg-[#F6F6F7] border-b border-[#403E43]">
      <TableCell className="w-[120px] text-[#403E43] bg-white border-r border-[#403E43]">
        {new Intl.DateTimeFormat("es-MX", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }).format(operation.date)}
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
      <PepsRowActions operation={operation} onEdit={onEdit} onDelete={onDelete} />
    </TableRow>
  );
}
