
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export function InventoryPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Inventarios</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Control de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gestione sus productos e inventario desde aquí.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

