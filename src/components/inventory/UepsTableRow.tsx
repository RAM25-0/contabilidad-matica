
import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TableCell, TableRow } from "@/components/ui/table";
import { UepsOperation } from "@/types/ueps-inventory";
import { EditOperationDialog } from "./EditOperationDialog";
import { DeleteOperationDialog } from "./DeleteOperationDialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { InventoryOperation } from "@/types/inventory";
import { formatCurrency } from "@/lib/utils";

interface UepsTableRowProps {
  operation: UepsOperation & { stockBalance?: number };
  onEdit: (operationId: string, values: Partial<UepsOperation>) => void;
  onDelete: (operationId: string) => void;
}

export function UepsTableRow({ operation, onEdit, onDelete }: UepsTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  let bgColorClass = "";
  switch (operation.type) {
    case "SALDO_INICIAL":
      bgColorClass = "bg-blue-50";
      break;
    case "COMPRA":
      bgColorClass = "bg-green-50";
      break;
    case "VENTA":
      bgColorClass = "bg-amber-50";
      break;
    case "DEVOLUCION":
      bgColorClass = "bg-purple-50";
      break;
  }

  const formattedDate = format(new Date(operation.date), "dd MMM yyyy", {
    locale: es,
  });

  const operationTypeMap = {
    SALDO_INICIAL: "Saldo Inicial",
    COMPRA: "Compra",
    VENTA: "Venta",
    DEVOLUCION: "Devolución",
  };

  const debeValue = operation.type === "SALDO_INICIAL" || operation.type === "COMPRA"
    ? operation.totalCost
    : 0;
  
  const haberValue = operation.type === "VENTA" || operation.type === "DEVOLUCION" 
    ? operation.totalCost 
    : 0;
  
  const adaptedOperation: InventoryOperation = {
    id: operation.id,
    date: operation.date,
    type: operation.type,
    description: operation.description,
    units: operation.inUnits - operation.outUnits,
    unitCost: operation.unitCost,
    totalCost: operation.totalCost,
    averageCost: operation.unitCost,
    balance: operation.balance,
    stockBalance: operation.stockBalance || 0
  };
  
  // Helper function to create vertical dividers
  const renderDivider = () => (
    <TableCell 
      style={{
        width: "2px",
        padding: 0,
        background: "#403E43",
        border: "none"
      }}
      aria-hidden
    />
  );

  return (
    <TableRow className={`${bgColorClass} hover:bg-gray-100`}>
      <TableCell className="text-center text-sm border-r border-[#403E43] w-[120px]">
        {formattedDate}
      </TableCell>
      <TableCell className="text-sm border-r border-[#403E43] w-[100px]">
        {operationTypeMap[operation.type]}
        {operation.type === "COMPRA" && operation.lots.length > 0 && (
          <span className="block text-xs text-gray-500">
            {operation.lots[0].lotName}
          </span>
        )}
        {operation.description && (
          <span className="block text-xs text-gray-500">
            {operation.description}
          </span>
        )}
      </TableCell>
      {renderDivider()}
      <TableCell className="text-center text-sm bg-[#D3E4FD] border-r border-[#403E43] w-[90px]">
        {operation.inUnits > 0 ? operation.inUnits : ""}
      </TableCell>
      <TableCell className="text-center text-sm bg-[#D3E4FD] border-r border-[#403E43] w-[90px]">
        {operation.outUnits > 0 ? operation.outUnits : ""}
      </TableCell>
      <TableCell className="text-center text-sm bg-[#D3E4FD] w-[90px]">
        {operation.stockBalance}
      </TableCell>
      {renderDivider()}
      <TableCell className="text-center text-sm bg-[#E1FBE1] w-[90px]">
        {operation.unitCost ? formatCurrency(operation.unitCost) : ""}
      </TableCell>
      {renderDivider()}
      <TableCell className="text-right text-sm bg-[#FFDEE2] border-r border-[#403E43] w-[90px]">
        {debeValue > 0 ? formatCurrency(debeValue) : ""}
      </TableCell>
      <TableCell className="text-right text-sm bg-[#FFDEE2] border-r border-[#403E43] w-[90px]">
        {haberValue > 0 ? formatCurrency(haberValue) : ""}
      </TableCell>
      <TableCell className="text-right text-sm bg-[#FFDEE2] w-[90px]">
        {formatCurrency(operation.balance)}
      </TableCell>
      <TableCell className="bg-[#F6F6F7] w-[80px]">
        <div className="flex space-x-1 justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            disabled={operation.type === "SALDO_INICIAL"}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        <EditOperationDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          operation={adaptedOperation}
          onSubmit={(values) => {
            onEdit(operation.id, values);
            setShowEditDialog(false);
          }}
        />

        <DeleteOperationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => {
            onDelete(operation.id);
            setShowDeleteDialog(false);
          }}
        />
      </TableCell>
    </TableRow>
  );
}
