
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Fecha</TableHead>
        <TableHead className="w-[120px]">Operación</TableHead>
        <TableHead className="w-[180px]">Descripción</TableHead>
        <TableHead className="text-right w-[90px]">Entrada</TableHead>
        <TableHead className="text-right w-[90px]">Salida</TableHead>
        <TableHead className="text-right w-[100px]">Existencia</TableHead>
        <TableHead className="text-right w-[110px]">Entrada $</TableHead>
        <TableHead className="text-right w-[110px]">Salida $</TableHead>
        <TableHead className="text-right w-[110px]">Promedio</TableHead>
        <TableHead className="text-right w-[90px]">Debe</TableHead>
        <TableHead className="text-right w-[90px]">Haber</TableHead>
        <TableHead className="text-right w-[110px]">Saldo</TableHead>
      </TableRow>
    </TableHeader>
  );
}
