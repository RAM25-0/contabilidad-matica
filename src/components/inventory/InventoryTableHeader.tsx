
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Fecha</TableHead>
        <TableHead>Operación</TableHead>
        <TableHead>Descripción</TableHead>
        <TableHead className="text-right">Entrada</TableHead>
        <TableHead className="text-right">Salida</TableHead>
        <TableHead className="text-right">Existencia</TableHead>
        <TableHead className="text-right">Entrada $</TableHead>
        <TableHead className="text-right">Salida $</TableHead>
        <TableHead className="text-right">Promedio</TableHead>
        <TableHead className="text-right">Debe</TableHead>
        <TableHead className="text-right">Haber</TableHead>
        <TableHead className="text-right">Saldo</TableHead>
      </TableRow>
    </TableHeader>
  );
}
