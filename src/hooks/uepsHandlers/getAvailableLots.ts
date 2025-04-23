
// Retorna los lotes de compra o saldo inicial con existencia disponible (para devoluciones de compras)
import { UepsState } from "@/hooks/useUepsInventory";

export function getAvailableLots(state: UepsState) {
  return state.lots.filter(
    lot =>
      (lot.type === "COMPRA" || lot.type === "SALDO_INICIAL") &&
      lot.remainingUnits > 0
  );
}
