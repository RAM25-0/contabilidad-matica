
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { PepsInventoryTable } from "./PepsInventoryTable";

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
        <PepsInventoryTable />
      </CardContent>
    </Card>
  );
}
