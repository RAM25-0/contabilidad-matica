
import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TableCell, TableRow } from "@/components/ui/table";
import { UepsOperation } from "@/hooks/useUepsInventory";
import { EditOperationDialog } from "./EditOperationDialog";
import { DeleteOperationDialog } from "./DeleteOperationDialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { InventoryOperation } from "@/types/inventory";

interface UepsTableRowProps {
  operation: UepsOperation;
  onEdit: (operationId: string, values: Partial<UepsOperation>) => void;
  onDelete: (operationId: string) => void;
}

export function UepsTableRow({ operation, onEdit, onDelete }: UepsTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Determine operation row background color
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

  // Format values for display
  const formattedDate = format(new Date(operation.date), "dd/MM/yyyy", {
    locale: es,
  });

  const operationTypeMap = {
    SALDO_INICIAL: "Saldo Inicial",
    COMPRA: "Compra",
    VENTA: "Venta",
    DEVOLUCION: "Devolución",
  };

  // Determine values for debe/haber/saldo
  const debeValue = operation.type === "SALDO_INICIAL" || operation.type === "COMPRA" || operation.type === "DEVOLUCION"
    ? operation.totalCost
    : 0;
  
  const haberValue = operation.type === "VENTA" ? operation.totalCost : 0;
  
  // Create a compatible inventory operation object for the EditOperationDialog
  const adaptedOperation: InventoryOperation = {
    id: operation.id,
    date: operation.date,
    type: operation.type,
    description: operation.description,
    units: operation.inUnits - operation.outUnits,
    unitCost: operation.unitCost,
    totalCost: operation.totalCost,
    averageCost: operation.unitCost,  // Use unitCost as averageCost
    balance: operation.balance,
    stockBalance: operation.lots.reduce((total, lot) => total + lot.remainingUnits, 0)
  };
  
  return (
    <TableRow className={`${bgColorClass} hover:bg-gray-100`}>
      <TableCell className="text-center">{formattedDate}</TableCell>
      <TableCell>
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
      <TableCell className="text-center">
        {operation.inUnits > 0 ? operation.inUnits : ""}
      </TableCell>
      <TableCell className="text-center">
        {operation.outUnits > 0 ? operation.outUnits : ""}
      </TableCell>
      <TableCell className="text-center">
        {/* Existence (stock balance) */}
        {operation.inUnits - operation.outUnits > 0
          ? operation.inUnits
          : operation.outUnits > 0
          ? operation.lots.reduce((total, lot) => total + lot.units, 0)
          : ""}
      </TableCell>
      <TableCell className="text-center">
        {operation.unitCost ? `$${operation.unitCost.toLocaleString("es-MX")}` : ""}
      </TableCell>
      <TableCell className="text-center">
        {debeValue > 0 ? `$${debeValue.toLocaleString("es-MX")}` : ""}
      </TableCell>
      <TableCell className="text-center">
        {haberValue > 0 ? `$${haberValue.toLocaleString("es-MX")}` : ""}
      </TableCell>
      <TableCell className="text-center">
        {`$${operation.balance.toLocaleString("es-MX")}`}
      </TableCell>
      <TableCell>
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
          onEdit={(values) => {
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
