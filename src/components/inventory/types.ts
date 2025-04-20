
import { z } from "zod";

export const inventoryOperationSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  type: z.enum(["SALDO_INICIAL", "COMPRA", "VENTA", "DEVOLUCION"], {
    required_error: "El tipo de operación es requerido",
  }),
  units: z.number().min(0, "Las unidades deben ser mayores a 0"),
  unitCost: z.number().optional(),
  description: z.string().max(200, "La descripción no puede exceder 200 caracteres"),
});

export type InventoryOperationFormValues = z.infer<typeof inventoryOperationSchema>;
