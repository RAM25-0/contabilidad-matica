import React, { useState, useEffect } from "react";
import { Plus, Trash2, Package, Boxes, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryMethodTabs } from "./InventoryMethodTabs";
import { useProfile } from "@/contexts/ProfileContext";
import { toast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
}

interface InventoryManagerProps {
  type: "materia-prima" | "articulos-terminados";
  title: string;
  icon: React.ReactNode;
  maxItems: number;
}

const STORAGE_KEY_PREFIX = "inventory_list_";

export function InventoryManager({ type, title, icon, maxItems }: InventoryManagerProps) {
  const { currentProfile, saveProfileData, getProfileData } = useProfile();
  const profileId = currentProfile?.id || "default";
  const storageKey = `${STORAGE_KEY_PREFIX}${type}`;

  const [inventories, setInventories] = useState<InventoryItem[]>(() => {
    return getProfileData<InventoryItem[]>(profileId, storageKey, []) || [];
  });

  const [selectedInventory, setSelectedInventory] = useState<string>("");
  const [newInventoryName, setNewInventoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.newProfileId === profileId) {
        const loadedInventories = getProfileData<InventoryItem[]>(profileId, storageKey, []);
        setInventories(loadedInventories || []);
      }
    };

    window.addEventListener('profile-changed', handleProfileChange);
    return () => {
      window.removeEventListener('profile-changed', handleProfileChange);
    };
  }, [profileId, getProfileData, storageKey]);

  useEffect(() => {
    if (currentProfile) {
      saveProfileData(profileId, storageKey, inventories);
    }
  }, [inventories, profileId, saveProfileData, currentProfile, storageKey]);

  useEffect(() => {
    if (inventories.length > 0 && !selectedInventory) {
      setSelectedInventory(inventories[0].id);
    } else if (inventories.length === 0) {
      setSelectedInventory("");
    }
  }, [inventories, selectedInventory]);

  const handleAddInventory = () => {
    if (!newInventoryName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del inventario no puede estar vacío",
        variant: "destructive",
      });
      return;
    }

    if (inventories.length >= maxItems) {
      toast({
        title: "Límite alcanzado",
        description: `No puedes crear más de ${maxItems} inventarios`,
        variant: "destructive",
      });
      return;
    }

    const newInventory: InventoryItem = {
      id: `${type}-${Date.now()}`,
      name: newInventoryName.trim(),
    };

    setInventories([...inventories, newInventory]);
    setSelectedInventory(newInventory.id);
    setNewInventoryName("");
    setDialogOpen(false);

    toast({
      title: "Inventario creado",
      description: `Se ha creado el inventario "${newInventory.name}"`,
    });
  };

  const handleDeleteInventory = () => {
    if (!inventoryToDelete) return;

    const updatedInventories = inventories.filter((inv) => inv.id !== inventoryToDelete.id);
    setInventories(updatedInventories);

    if (selectedInventory === inventoryToDelete.id) {
      setSelectedInventory(updatedInventories.length > 0 ? updatedInventories[0].id : "");
    }

    toast({
      title: "Inventario eliminado",
      description: `Se ha eliminado el inventario "${inventoryToDelete.name}"`,
    });

    setInventoryToDelete(null);
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = (inventory: InventoryItem) => {
    setInventoryToDelete(inventory);
    setDeleteDialogOpen(true);
  };

  const selectedInventoryData = inventories.find((inv) => inv.id === selectedInventory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">
            ({inventories.length}/{maxItems})
          </span>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={inventories.length >= maxItems}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Inventario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nuevo inventario</DialogTitle>
              <DialogDescription>
                Ingresa el nombre para el nuevo inventario de {type === "materia-prima" ? "materia prima" : "artículos terminados"}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Nombre del inventario (ej: Material A)"
                value={newInventoryName}
                onChange={(e) => setNewInventoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddInventory();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddInventory}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {inventories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No hay inventarios creados.
              <br />
              Haz clic en "Nuevo Inventario" para comenzar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={selectedInventory} onValueChange={setSelectedInventory}>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <TabsList className="flex-shrink-0">
              {inventories.map((inventory) => (
                <TabsTrigger
                  key={inventory.id}
                  value={inventory.id}
                  className="flex items-center gap-2"
                >
                  {inventory.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {selectedInventoryData && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0"
                onClick={() => openDeleteDialog(selectedInventoryData)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {inventories.map((inventory) => (
            <TabsContent key={inventory.id} value={inventory.id}>
              <InventoryMethodTabs
                inventoryKey={inventory.id}
                title={`Inventario: ${inventory.name}`}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar inventario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el inventario "{inventoryToDelete?.name}" y todos sus datos. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInventory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
