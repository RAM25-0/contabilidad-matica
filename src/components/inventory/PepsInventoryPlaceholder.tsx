
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export function PepsInventoryPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-violet-500" />
          <CardTitle>Método de Valuación - PEPS</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded bg-violet-50 text-violet-700 mb-4">
          Esta sección está lista para implementar la herramienta de inventarios PEPS (Primeras Entradas, Primeras Salidas).
        </div>
        <div className="text-sm text-gray-500">
          Proximamente podrás registrar operaciones bajo la metodología PEPS y comparar sus efectos respecto al método de Promedio.
        </div>
      </CardContent>
    </Card>
  );
}
