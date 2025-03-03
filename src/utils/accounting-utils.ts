
import React from "react";
import { AccountType } from "@/types/accounting";

// Utility functions for the accounting system
export const getNatureLabel = (nature: string): string => {
  return nature === "deudora" 
    ? "Deudora (Debe ↑, Haber ↓)" 
    : "Acreedora (Debe ↓, Haber ↑)";
};

export const getTypeLabel = (type: string): string => {
  switch (type) {
    case "activo": return "Activo";
    case "pasivo": return "Pasivo";
    case "capital": return "Capital";
    case "ingreso": return "Ingreso";
    case "gasto": return "Gasto";
    default: return type;
  }
};

export const getTypeIcon = (type: string): React.ReactNode => {
  // Los íconos se implementarán en los componentes
  return null;
};
