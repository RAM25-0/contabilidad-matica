
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { PepsOperation } from "@/types/peps-inventory";

interface PepsRowActionsProps {
  operation: PepsOperation;
  onEdit: (op: PepsOperation) => void;
  onDelete: (op: PepsOperation) => void;
}

export function PepsRowActions({ operation, onEdit, onDelete }: PepsRowActionsProps) {
  return (
    <td className="w-[90px] bg-white border-l border-[#403E43] text-center">
      <div className="flex gap-1 justify-center">
        <button
          className="p-1 rounded hover:bg-violet-100"
          title="Editar"
          onClick={() => onEdit(operation)}
        >
          <Edit size={18} color="#7E69AB" />
        </button>
        <button
          className="p-1 rounded hover:bg-red-100"
          title="Borrar"
          onClick={() => onDelete(operation)}
        >
          <Trash2 size={18} color="#ea384c" />
        </button>
      </div>
    </td>
  );
}
