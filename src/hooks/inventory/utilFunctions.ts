
import { toast } from "@/components/ui/use-toast";

export function calculateAverage(currentAverageCost: number, hasOperations: boolean): void {
  if (!hasOperations) {
    toast({
      title: "Sin operaciones",
      description: "No hay operaciones para calcular el promedio.",
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Promedio actualizado",
    description: `El costo promedio actual es: ${currentAverageCost.toFixed(0)}`,
  });
}

export function viewHistory(): void {
  toast({
    title: "Historial Completo",
    description: "Ya estás viendo el historial completo de operaciones.",
  });
}
