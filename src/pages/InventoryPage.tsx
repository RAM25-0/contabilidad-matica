
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryOperation, InventoryState } from "@/types/inventory";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

export function InventoryPage() {
  const [state, setState] = useState<InventoryState>({
    operations: [],
    currentAverageCost: 0,
    currentStock: 0,
    currentBalance: 0,
  });

  const handleAddOperation = (newOperation: Omit<InventoryOperation, 'id' | 'averageCost' | 'balance' | 'stockBalance' | 'totalCost'>) => {
    const operation = calculateOperation(newOperation);
    if (!operation) return;

    setState(prevState => ({
      ...prevState,
      operations: [...prevState.operations, operation],
      currentAverageCost: operation.averageCost,
      currentStock: operation.stockBalance,
      currentBalance: operation.balance
    }));

    toast({
      title: "Operación agregada",
      description: "La operación se ha registrado correctamente.",
    });
  };

  const calculateOperation = (newOp: Omit<InventoryOperation, 'id' | 'averageCost' | 'balance' | 'stockBalance' | 'totalCost'>): InventoryOperation | null => {
    const prevOperation = state.operations[state.operations.length - 1];
    const prevStock = prevOperation?.stockBalance || 0;
    const prevBalance = prevOperation?.balance || 0;
    const prevAverageCost = prevOperation?.averageCost || 0;

    let stockBalance = prevStock;
    let totalCost = 0;
    let averageCost = prevAverageCost;
    let balance = prevBalance;

    switch (newOp.type) {
      case 'SALDO_INICIAL':
      case 'COMPRA':
        if (!newOp.unitCost) {
          toast({
            title: "Error",
            description: "El costo unitario es requerido para compras",
            variant: "destructive",
          });
          return null;
        }
        stockBalance = prevStock + newOp.units;
        totalCost = newOp.units * newOp.unitCost;
        balance = prevBalance + totalCost;
        averageCost = balance / stockBalance;
        break;

      case 'VENTA':
        if (newOp.units > prevStock) {
          toast({
            title: "Error",
            description: "No hay suficiente stock para realizar la venta",
            variant: "destructive",
          });
          return null;
        }
        stockBalance = prevStock - newOp.units;
        totalCost = newOp.units * prevAverageCost;
        balance = prevBalance - totalCost;
        averageCost = stockBalance > 0 ? balance / stockBalance : prevAverageCost;
        break;

      case 'DEVOLUCION':
        stockBalance = prevStock + newOp.units;
        totalCost = newOp.units * prevAverageCost;
        balance = prevBalance + totalCost;
        averageCost = balance / stockBalance;
        break;
    }

    return {
      id: uuidv4(),
      date: newOp.date,
      type: newOp.type,
      description: newOp.description,
      units: newOp.units,
      unitCost: newOp.unitCost,
      totalCost,
      averageCost,
      balance,
      stockBalance,
    };
  };

  const handleCalculateAverage = () => {
    if (state.operations.length === 0) {
      toast({
        title: "Sin operaciones",
        description: "No hay operaciones para calcular el promedio.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Promedio actualizado",
      description: `El costo promedio actual es: ${state.currentAverageCost.toFixed(2)}`,
    });
  };

  const handleViewHistory = () => {
    console.log("View history clicked");
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
              <InventoryTable 
                operations={state.operations}
                onAddOperation={handleAddOperation}
                onCalculateAverage={handleCalculateAverage}
                onViewHistory={handleViewHistory}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
