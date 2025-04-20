
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHeader() {
  // Colores de fondo: UNIDADES #D3E4FD, COSTO #F2FCE2, VALORES #FFDEE2
  // Color divisor sugerido: #C8C8C9 (Light Gray)
  const divider = (
    <th
      style={{
        width: "2px",
        background: "#C8C8C9",
        padding: 0,
        border: "none",
      }}
      aria-hidden
    />
  );
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[350px] bg-[#F6F6F7] text-[#403E43] border-b border-gray-200" colSpan={2}>
          <div className="font-semibold text-center">MÉTODO DE VALUACIÓN: COSTO PROMEDIO</div>
        </TableHead>
      </TableRow>
      <TableRow className="border-b border-gray-200">
        <TableHead className="w-[120px] text-[#403E43]">Fecha</TableHead>
        <TableHead className="w-[230px] text-[#403E43]">Operación</TableHead>
        {divider}
        {/* UNIDADES Section */}
        <TableHead className="text-[#403E43] bg-[#D3E4FD] text-center" colSpan={3}>
          UNIDADES
        </TableHead>
        {divider}
        {/* COSTO Section */}
        <TableHead className="text-[#403E43] bg-[#F2FCE2] text-center" colSpan={2}>
          COSTO
        </TableHead>
        {divider}
        {/* VALORES Section */}
        <TableHead className="text-[#403E43] bg-[#FFDEE2] text-center" colSpan={3}>
          VALORES
        </TableHead>
      </TableRow>
      <TableRow className="bg-[#F6F6F7] border-b border-gray-200">
        <TableHead className="w-[120px] text-[#403E43]"></TableHead>
        <TableHead className="w-[230px] text-[#403E43]"></TableHead>
        {divider}
        {/* UNIDADES Subheaders */}
        <TableHead className="w-[120px] text-[#403E43] bg-[#D3E4FD] text-center">Entrada</TableHead>
        <TableHead className="w-[120px] text-[#403E43] bg-[#D3E4FD] text-center">Salida</TableHead>
        <TableHead className="w-[120px] text-[#403E43] bg-[#D3E4FD] text-center">Existencia</TableHead>
        {divider}
        {/* COSTO Subheaders */}
        <TableHead className="w-[120px] text-[#403E43] bg-[#F2FCE2] text-center">Entrada $</TableHead>
        <TableHead className="w-[120px] text-[#403E43] bg-[#F2FCE2] text-center">Promedio</TableHead>
        {divider}
        {/* VALORES Subheaders */}
        <TableHead className="w-[120px] text-[#403E43] bg-[#FFDEE2] text-center">Debe</TableHead>
        <TableHead className="w-[120px] text-[#403E43] bg-[#FFDEE2] text-center">Haber</TableHead>
        <TableHead className="w-[120px] text-[#403E43] bg-[#FFDEE2] text-center">Saldo</TableHead>
      </TableRow>
    </TableHeader>
  );
}
