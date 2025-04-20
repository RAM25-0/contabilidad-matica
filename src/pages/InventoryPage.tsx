
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InventoryPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Inventarios</h1>
      </div>
      
      <Tabs defaultValue="promedio" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="promedio">Promedio</TabsTrigger>
        </TabsList>

        <TabsContent value="promedio">
          <Card>
            <CardHeader>
              <CardTitle>Método de Valuación - Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sistema de valuación de inventarios por método de Costo Promedio.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
