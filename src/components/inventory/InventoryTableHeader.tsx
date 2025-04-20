import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHeader() {
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
        <TableHead className="w-[350px] bg-[#F6F6F7] text-[#403E43] border-b border-gray-200" colSpan={2}>
          <div className="font-semibold text-center">MÉTODO DE VALUACIÓN: COSTO PROMEDIO</div>
        </TableHead>
      </TableRow>
      <TableRow className="border-b border-[#403E43]">
        <TableHead className="w-[120px] text-[#403E43] border-r border-[#403E43]">Fecha</TableHead>
        <TableHead className="w-[230px] text-[#403E43] border-r border-[#403E43]">Operación</TableHead>
        {divider}
        {/* UNIDADES Section */}
        <TableHead className="text-[#403E43] bg-[#D3E4FD] text-center border-r border-[#403E43]" colSpan={3}>
          UNIDADES
        </TableHead>
        {divider}
        {/* COSTO Section */}
        <TableHead className="text-[#403E43] bg-[#F2FCE2] text-center border-r border-[#403E43]" colSpan={2}>
          COSTO
        </TableHead>
        {divider}
        {/* VALORES Section */}
        <TableHead className="text-[#403E43] bg-[#FFDEE2] text-center" colSpan={3}>
          VALORES
        </TableHead>
      </TableRow>
      <TableRow className="bg-[#F6F6F7] border-b border-[#403E43]">
        <TableHead className="w-[120px] text-[#403E43] border-r border-[#403E43]"></TableHead>
        <TableHead className="w-[230px] text-[#403E43] border-r border-[#403E43]"></TableHead>
        {divider}
        {/* UNIDADES Subheaders */}
        <TableHead className="w-[120px] text-[#403E43] bg-[#D3E4FD] text-center border-r border-[#403E43]">Entrada</TableHead>
        <TableHead className="w-[120px] text-[#403E43] bg-[#D3E4FD] text-center border-r border-[#403E43]">Salida</TableHead>
        <TableHead className="w-[120px] text-[#403E43] bg-[#D3E4FD] text-center">Existencia</TableHead>
        {divider}
        {/* COSTO Subheaders */}
        <TableHead className="w-[120px] text-[#403E43] bg-[#F2FCE2] text-center border-r border-[#403E43]">Entrada $</TableHead>
        <TableHead className="w-[120px] text-[#403E43] bg-[#F2FCE2] text-center">Promedio</TableHead>
        {divider}
        {/* VALORES Subheaders */}
        <TableHead className="w-[120px] text-[#403E43] bg-[#FFDEE2] text-center border-r border-[#403E43]">Debe</TableHead>
        <TableHead className="w-[120px] text-[#403E43] bg-[#FFDEE2] text-center border-r border-[#403E43]">Haber</TableHead>
        <TableHead className="w-[120px] text-[#403E43] bg-[#FFDEE2] text-center">Saldo</TableHead>
      </TableRow>
    </TableHeader>
  );
}
