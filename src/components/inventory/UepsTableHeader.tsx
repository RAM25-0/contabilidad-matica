
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function UepsTableHeader() {
  const DividerCell = () => (
    <th
      style={{
        width: "2px",
        background: "#403E43",
        padding: 0,
        border: "none"
      }}
      aria-hidden
    ></th>
  );

  return (
    <TableHeader className="bg-[#e0e0e0]">
      <TableRow>
        <TableHead className="font-bold text-center border-r border-[#403E43] w-[120px]">
          Fecha
        </TableHead>
        <TableHead className="font-bold border-r border-[#403E43]">
          Operación
        </TableHead>
        <DividerCell />
        <TableHead colSpan={3} className="font-bold text-center text-lg bg-[#D3E4FD] p-1">
          UNIDADES
        </TableHead>
        <DividerCell />
        <TableHead className="font-bold text-center bg-[#E1FBE1]">
          COSTO
        </TableHead>
        <DividerCell />
        <TableHead colSpan={3} className="font-bold text-center text-lg bg-[#FFDEE2] p-1">
          VALORES
        </TableHead>
        <TableHead className="w-[80px]" />
      </TableRow>
      
      <TableRow>
        <TableHead className="font-bold text-center border-r border-[#403E43]" />
        <TableHead className="font-bold border-r border-[#403E43]" />
        <DividerCell />
        <TableHead className="font-bold text-center bg-[#D3E4FD] border-r border-[#403E43]">
          Entrada
        </TableHead>
        <TableHead className="font-bold text-center bg-[#D3E4FD] border-r border-[#403E43]">
          Salida
        </TableHead>
        <TableHead className="font-bold text-center bg-[#D3E4FD]">
          Existencia
        </TableHead>
        <DividerCell />
        <TableHead className="font-bold text-center bg-[#E1FBE1]">
          Unitario
        </TableHead>
        <DividerCell />
        <TableHead className="font-bold text-center bg-[#FFDEE2] border-r border-[#403E43]">
          Debe
        </TableHead>
        <TableHead className="font-bold text-center bg-[#FFDEE2] border-r border-[#403E43]">
          Haber
        </TableHead>
        <TableHead className="font-bold text-center bg-[#FFDEE2]">
          Saldo
        </TableHead>
        <TableHead className="font-bold text-center">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}
