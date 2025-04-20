
import { z } from "zod";

export const inventoryOperationSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  type: z.enum(["SALDO_INICIAL", "COMPRA", "VENTA", "DEVOLUCION"], {
    required_error: "El tipo de operación es requerido",
  }),
  units: z.number().min(0, "Las unidades deben ser mayores a 0"),
  unitCost: z.union([
    z.number().min(0, "El costo unitario debe ser mayor o igual a 0"),
    z.undefined()
  ]),
  description: z.string().max(200, "La descripción no puede exceder 200 caracteres"),
}).refine((data) => {
  // Only require unitCost for SALDO_INICIAL and COMPRA operations
  if (data.type === 'SALDO_INICIAL' || data.type === 'COMPRA') {
    return data.unitCost !== undefined;
  }
  return true;
}, {
  message: "El costo unitario es requerido para saldo inicial y compras",
  path: ["unitCost"],
});

export type InventoryOperationFormValues = z.infer<typeof inventoryOperationSchema>;
