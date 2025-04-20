
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-[#F6F6F7] border-b border-gray-200">
        <TableHead className="w-[100px] text-[#403E43]">Fecha</TableHead>
        <TableHead className="w-[120px] text-[#403E43]">Operación</TableHead>
        <TableHead className="w-[180px] text-[#403E43]">Descripción</TableHead>
        <TableHead className="text-right w-[90px] text-[#403E43]">Entrada</TableHead>
        <TableHead className="text-right w-[90px] text-[#403E43]">Salida</TableHead>
        <TableHead className="text-right w-[100px] text-[#403E43]">Existencia</TableHead>
        <TableHead className="text-right w-[110px] text-[#403E43]">Entrada $</TableHead>
        <TableHead className="text-right w-[110px] text-[#403E43]">Promedio</TableHead>
        <TableHead className="text-right w-[90px] text-[#403E43]">Debe</TableHead>
        <TableHead className="text-right w-[90px] text-[#403E43]">Haber</TableHead>
        <TableHead className="text-right w-[110px] text-[#403E43]">Saldo</TableHead>
      </TableRow>
    </TableHeader>
  );
}
