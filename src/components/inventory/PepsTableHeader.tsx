
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PepsTableHeader() {
  const divider = (
    <th
      style={{
        width: "2px",
        background: "#403E43",
        padding: 0,
        border: "none",
      }}
      aria-hidden
    />
  );

  return (
    <TableHeader>
      <TableRow>
        <TableHead
          className="w-[220px] bg-[#F6F6F7] text-[#403E43] border-b border-gray-200"
          colSpan={2}
        >
          <div className="font-semibold text-center">
            MÉTODO DE VALUACIÓN: PEPS
          </div>
        </TableHead>
        {divider}
        <TableHead
          className="text-[#403E43] bg-[#D3E4FD] text-center border-r border-[#403E43]"
          colSpan={3}
        >
          UNIDADES
        </TableHead>
        {divider}
        <TableHead
          className="text-[#403E43] bg-[#E1FBE1] text-center"
          colSpan={1}
        >
          COSTO
        </TableHead>
        {divider}
        <TableHead
          className="text-[#403E43] bg-[#FFDEE2] text-center"
          colSpan={3}
        >
          VALORES
        </TableHead>
      </TableRow>
      <TableRow className="border-b border-[#403E43]">
        <TableHead className="w-[120px] text-[#403E43] border-r border-[#403E43] bg-[#F6F6F7]">
          Fecha
        </TableHead>
        <TableHead className="w-[100px] text-[#403E43] border-r border-[#403E43] bg-[#F6F6F7]">
          Operación
        </TableHead>
        {divider}

        <TableHead className="w-[90px] bg-[#D3E4FD] text-center text-[#403E43] border-r border-[#403E43]">
          Entrada
        </TableHead>
        <TableHead className="w-[90px] bg-[#D3E4FD] text-center text-[#403E43] border-r border-[#403E43]">
          Salida
        </TableHead>
        <TableHead className="w-[90px] bg-[#D3E4FD] text-center text-[#403E43]">
          Existencia
        </TableHead>
        {divider}

        <TableHead className="w-[90px] bg-[#E1FBE1] text-center text-[#403E43]">
          C/Unitario
        </TableHead>
        {divider}

        <TableHead className="w-[90px] bg-[#FFDEE2] text-center text-[#403E43] border-r border-[#403E43]">
          Debe
        </TableHead>
        <TableHead className="w-[90px] bg-[#FFDEE2] text-center text-[#403E43] border-r border-[#403E43]">
          Haber
        </TableHead>
        <TableHead className="w-[90px] bg-[#FFDEE2] text-center text-[#403E43]">
          Saldo
        </TableHead>
        <TableHead className="w-[90px] text-[#403E43] bg-[#F6F6F7]">
          Acciones
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
