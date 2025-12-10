
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Archive } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryTable } from "./InventoryTable";
import { PepsInventoryTable } from "./PepsInventoryTable";
import { UepsInventoryTable } from "./UepsInventoryTable";
import { useInventoryWithKey } from "@/hooks/useInventoryWithKey";
import { usePepsInventoryWithKey } from "@/hooks/usePepsInventoryWithKey";
import { useUepsInventoryWithKey } from "@/hooks/useUepsInventoryWithKey";
import { PepsOperation } from "@/types/peps-inventory";

interface InventoryMethodTabsProps {
  inventoryKey: string;
  title: string;
}

export function InventoryMethodTabs({ inventoryKey, title }: InventoryMethodTabsProps) {
  const {
    state,
    handleAddOperation,
    handleCalculateAverage,
    handleViewHistory,
    handleEditOperation,
    handleDeleteOperation,
  } = useInventoryWithKey(inventoryKey);

  const pepsInventory = usePepsInventoryWithKey(inventoryKey);
  const uepsInventory = useUepsInventoryWithKey(inventoryKey);

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

  const handleUepsEdit = (operationId: string, values: any) => {
    uepsInventory.handleEditOperation(operationId, values);
  };
  
  const handleUepsDelete = (operationId: string) => {
    uepsInventory.handleDeleteOperation(operationId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="promedio" className="w-full">
          <TabsList className="w-full justify-start space-x-2">
            <TabsTrigger value="promedio">Promedio</TabsTrigger>
            <TabsTrigger value="peps">PEPS</TabsTrigger>
            <TabsTrigger value="ueps">
              <Archive className="h-4 w-4 mr-1 text-[#9b87f5]" />
              UEPS
            </TabsTrigger>
          </TabsList>
          <TabsContent value="promedio">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <CardTitle className="text-base">Método de Valuación - Promedio</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
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
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-violet-500" />
                  <CardTitle className="text-base">Método de Valuación - PEPS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-0">
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
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <div className="flex items-center gap-3">
                  <Archive className="h-5 w-5 text-[#9b87f5]" />
                  <CardTitle className="text-base">Método de Valuación - UEPS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-0">
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
      </CardContent>
    </Card>
  );
}
