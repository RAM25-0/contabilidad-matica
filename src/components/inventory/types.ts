
import { z } from "zod";

export const inventoryOperationSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  type: z.enum(["SALDO_INICIAL", "COMPRA", "VENTA", "DEVOLUCION"], {
    required_error: "El tipo de operación es requerido",
  }),
  units: z.number().min(0, "Las unidades deben ser mayores a 0"),
  unitCost: z.number({
    required_error: "El costo unitario es requerido para saldo inicial y compras",
    invalid_type_error: "El costo unitario debe ser un número"
  }).min(0, "El costo unitario debe ser mayor o igual a 0"),
  description: z.string().max(200, "La descripción no puede exceder 200 caracteres"),
});

export type InventoryOperationFormValues = z.infer<typeof inventoryOperationSchema>;
