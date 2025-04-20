
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-24">Fecha</TableHead>
        <TableHead className="w-28">Operación</TableHead>
        <TableHead className="w-40">Descripción</TableHead>
        <TableHead className="text-right w-20">Entrada</TableHead>
        <TableHead className="text-right w-20">Salida</TableHead>
        <TableHead className="text-right w-24">Existencia</TableHead>
        <TableHead className="text-right w-24">Entrada $</TableHead>
        <TableHead className="text-right w-24">Salida $</TableHead>
        <TableHead className="text-right w-24">Promedio</TableHead>
        <TableHead className="text-right w-20">Debe</TableHead>
        <TableHead className="text-right w-20">Haber</TableHead>
        <TableHead className="text-right w-24">Saldo</TableHead>
      </TableRow>
    </TableHeader>
  );
}
