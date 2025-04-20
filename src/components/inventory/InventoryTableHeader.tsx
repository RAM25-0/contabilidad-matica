
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[220px] bg-[#F6F6F7] text-[#403E43] border-b border-gray-200" colSpan={2}>
          <div className="font-semibold text-center">MÉTODO DE VALUACIÓN: COSTO PROMEDIO</div>
        </TableHead>
      </TableRow>
      <TableRow className="border-b border-gray-200">
        <TableHead className="w-[100px] text-[#403E43]">Fecha</TableHead>
        <TableHead className="w-[120px] text-[#403E43]">Operación</TableHead>
        
        {/* UNIDADES Section */}
        <TableHead className="w-[90px] text-[#403E43] bg-[#D3E4FD] text-center" colSpan={3}>
          UNIDADES
        </TableHead>
        
        {/* COSTO Section */}
        <TableHead className="w-[220px] text-[#403E43] bg-[#F2FCE2] text-center" colSpan={2}>
          COSTO
        </TableHead>
        
        {/* VALORES Section */}
        <TableHead className="w-[310px] text-[#403E43] bg-[#FFDEE2] text-center" colSpan={3}>
          VALORES
        </TableHead>
      </TableRow>
      <TableRow className="bg-[#F6F6F7] border-b border-gray-200">
        <TableHead className="w-[100px] text-[#403E43]"></TableHead>
        <TableHead className="w-[120px] text-[#403E43]"></TableHead>
        
        {/* UNIDADES Subheaders */}
        <TableHead className="w-[90px] text-[#403E43] bg-[#D3E4FD]">Entrada</TableHead>
        <TableHead className="w-[90px] text-[#403E43] bg-[#D3E4FD]">Salida</TableHead>
        <TableHead className="w-[100px] text-[#403E43] bg-[#D3E4FD]">Existencia</TableHead>
        
        {/* COSTO Subheaders */}
        <TableHead className="w-[110px] text-[#403E43] bg-[#F2FCE2]">Entrada $</TableHead>
        <TableHead className="w-[110px] text-[#403E43] bg-[#F2FCE2]">Promedio</TableHead>
        
        {/* VALORES Subheaders */}
        <TableHead className="w-[90px] text-[#403E43] bg-[#FFDEE2]">Debe</TableHead>
        <TableHead className="w-[90px] text-[#403E43] bg-[#FFDEE2]">Haber</TableHead>
        <TableHead className="w-[110px] text-[#403E43] bg-[#FFDEE2]">Saldo</TableHead>
      </TableRow>
    </TableHeader>
  );
}
