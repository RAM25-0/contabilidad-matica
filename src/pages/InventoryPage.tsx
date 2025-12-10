import React from "react";
import { Package, ChevronLeft, Boxes, PackageCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { InventoryManager } from "@/components/inventory/InventoryManager";

export function InventoryPage() {
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
      
      <Tabs defaultValue="materia-prima" className="w-full">
        <TabsList className="w-full justify-start space-x-2 mb-6">
          <TabsTrigger value="materia-prima" className="flex items-center gap-2">
            <Boxes className="h-4 w-4" />
            Materia Prima
          </TabsTrigger>
          <TabsTrigger value="articulos-terminados" className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4" />
            Artículos Terminados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="materia-prima">
          <InventoryManager
            type="materia-prima"
            title="Inventarios de Materia Prima"
            icon={<Boxes className="h-5 w-5 text-blue-500" />}
            maxItems={10}
          />
        </TabsContent>
        
        <TabsContent value="articulos-terminados">
          <InventoryManager
            type="articulos-terminados"
            title="Inventarios de Artículos Terminados"
            icon={<PackageCheck className="h-5 w-5 text-green-500" />}
            maxItems={10}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
