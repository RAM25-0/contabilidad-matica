
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { useInventory } from "@/hooks/useInventory";
import { PepsInventoryTable } from "@/components/inventory/PepsInventoryTable";

export function InventoryPage() {
  const {
    state,
    handleAddOperation,
    handleCalculateAverage,
    handleViewHistory,
    handleEditOperation,
    handleDeleteOperation,
  } = useInventory();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link to="/">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Package className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Inventarios</h1>
      </div>
      <Tabs defaultValue="promedio" className="w-full">
        <TabsList className="w-full justify-start space-x-2">
          <TabsTrigger value="promedio">Promedio</TabsTrigger>
          <TabsTrigger value="peps">PEPS</TabsTrigger>
        </TabsList>
        <TabsContent value="promedio">
          <Card>
            <CardHeader>
              <CardTitle>Método de Valuación - Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryTable
                operations={state.operations}
                onAddOperation={handleAddOperation}
                onCalculateAverage={handleCalculateAverage}
                onViewHistory={handleViewHistory}
                onEditOperation={handleEditOperation}
                onDeleteOperation={handleDeleteOperation}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="peps">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
