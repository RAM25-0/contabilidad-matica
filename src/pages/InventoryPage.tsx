
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryOperation } from "@/types/inventory";

export function InventoryPage() {
  const [operations, setOperations] = useState<InventoryOperation[]>([]);

  const handleAddOperation = () => {
    // Will implement in next step
    console.log("Add operation clicked");
  };

  const handleCalculateAverage = () => {
    // Will implement in next step
    console.log("Calculate average clicked");
  };

  const handleViewHistory = () => {
    // Will implement in next step
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
                operations={operations}
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
