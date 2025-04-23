
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChevronLeft, Archive } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { useInventory } from "@/hooks/useInventory";
import { PepsInventoryTable } from "@/components/inventory/PepsInventoryTable";
import { usePepsInventory } from "@/hooks/usePepsInventory";
import { PepsOperation } from "@/types/peps-inventory";
import { UepsInventoryTable } from "@/components/inventory/UepsInventoryTable";
import { useUepsInventory } from "@/hooks/useUepsInventory";
import { UepsOperation } from "@/hooks/useUepsInventory";

export function InventoryPage() {
  const {
    state,
    handleAddOperation,
    handleCalculateAverage,
    handleViewHistory,
    handleEditOperation,
    handleDeleteOperation,
  } = useInventory();

  const pepsInventory = usePepsInventory();
  const uepsInventory = useUepsInventory();
  const [activeTab, setActiveTab] = useState<string>("promedio");
  
  // Adapter functions to match expected prop types
  const handlePepsEdit = (operation: PepsOperation) => {
    pepsInventory.handleEditOperation(operation.id, {
      date: operation.date,
      type: operation.type,
      description: operation.description,
      lots: operation.lots,
      inUnits: operation.inUnits,
      outUnits: operation.outUnits,
      unitCost: operation.unitCost,
      totalCost: operation.totalCost,
      targetLotId: operation.targetLotId
    });
  };
  
  const handlePepsDelete = (operation: PepsOperation) => {
    pepsInventory.handleDeleteOperation(operation.id);
  };

  // Adapter functions for UEPS
  const handleUepsEdit = (operation: UepsOperation) => {
    uepsInventory.handleEditOperation(operation.id, {
      date: operation.date,
      type: operation.type,
      description: operation.description,
      lots: operation.lots,
      inUnits: operation.inUnits,
      outUnits: operation.outUnits,
      unitCost: operation.unitCost,
      totalCost: operation.totalCost,
      targetLotId: operation.targetLotId
    });
  };
  
  const handleUepsDelete = (operation: UepsOperation) => {
    uepsInventory.handleDeleteOperation(operation.id);
  };

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
      <Tabs 
        defaultValue="promedio" 
        className="w-full" 
        value={activeTab} 
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full justify-start space-x-2">
          <TabsTrigger value="promedio">Promedio</TabsTrigger>
          <TabsTrigger value="peps">PEPS</TabsTrigger>
          <TabsTrigger value="ueps">
            <Archive className="h-4 w-4 mr-1 text-[#9b87f5]" />
            UEPS
          </TabsTrigger>
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
              <PepsInventoryTable 
                state={pepsInventory.state}
                onAddInitialBalance={pepsInventory.handleAddInitialBalance}
                onAddPurchase={pepsInventory.handleAddPurchase}
                onAddSale={pepsInventory.handleAddSale}
                onAddReturn={pepsInventory.handleAddReturn}
                getAvailableLots={pepsInventory.getAvailableLots}
                onEditOperation={handlePepsEdit}
                onDeleteOperation={handlePepsDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ueps">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Archive className="h-5 w-5 text-[#9b87f5]" />
                <CardTitle>Método de Valuación - UEPS</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <UepsInventoryTable 
                state={uepsInventory.state}
                onAddInitialBalance={uepsInventory.handleAddInitialBalance}
                onAddPurchase={uepsInventory.handleAddPurchase}
                onAddSale={uepsInventory.handleAddSale}
                onAddReturn={uepsInventory.handleAddReturn}
                getAvailableLots={uepsInventory.getAvailableLots}
                onEditOperation={handleUepsEdit}
                onDeleteOperation={handleUepsDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
