
import { UepsState } from "@/hooks/useUepsInventory";

export function getAvailableLots(state: UepsState) {
  // Para las devoluciones, necesitamos los lotes que han sido vendidos
  return state.operations
    .filter(op => op.type === "VENTA")
    .flatMap(op => op.lots)
    .filter(lot => lot.units > 0);
}
