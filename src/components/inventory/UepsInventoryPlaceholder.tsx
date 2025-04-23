
import React from "react";
import { Archive } from "lucide-react";

export function UepsInventoryPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Archive className="h-10 w-10 mb-4 text-[#9b87f5]" />
      <p className="text-lg font-semibold mb-2">UEPS Próximamente</p>
      <p className="text-gray-500 text-center max-w-md">
        Aquí aparecerá la herramienta para el Método de Valuación de Inventarios por UEPS (Últimas Entradas, Primeras Salidas).
      </p>
    </div>
  );
}
