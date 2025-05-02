
import { PepsLot, PepsState } from "@/types/peps-inventory";

export function getAvailableLots(state: PepsState): PepsLot[] {
  return state.lots.filter(
    (lot) => lot.type !== "VENTA" && lot.remainingUnits > 0
  );
}
