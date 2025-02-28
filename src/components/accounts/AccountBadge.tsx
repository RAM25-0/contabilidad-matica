
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Landmark, 
  BarChart3, 
  Receipt, 
  DollarSign,
  ShoppingBag,
  CircleDollarSign,
  Building,
  Clock 
} from "lucide-react";
import { AccountSubcategory, AccountType } from "@/types/accounting";

interface AccountBadgeProps {
  type: AccountType;
  subcategory?: AccountSubcategory;
  showIcon?: boolean;
  label?: string;
  className?: string;
}

export const AccountBadge = ({ type, subcategory, showIcon = true, label, className = "" }: AccountBadgeProps) => {
  return (
    <Badge 
      variant="secondary" 
      className={`${getColorForType(type, subcategory)} ${className}`}
    >
      {showIcon && getIconForType(type, subcategory)}
      {label || ""}
    </Badge>
  );
};

export const getIconForType = (type: AccountType, subcategory?: AccountSubcategory): React.ReactNode => {
  if (type === "activo") {
    if (subcategory === "circulante") return <CircleDollarSign className="h-5 w-5 text-emerald-600" />;
    if (subcategory === "fijo") return <Building className="h-5 w-5 text-emerald-700" />;
    if (subcategory === "diferido") return <Clock className="h-5 w-5 text-cyan-600" />;
    return <Wallet className="h-5 w-5 text-emerald-600" />;
  } else if (type === "pasivo") {
    return <Landmark className="h-5 w-5 text-rose-600" />;
  } else if (type === "capital") {
    return <BarChart3 className="h-5 w-5 text-indigo-600" />;
  } else if (type === "ingreso") {
    return <DollarSign className="h-5 w-5 text-amber-600" />;
  } else if (type === "gasto") {
    return <Receipt className="h-5 w-5 text-violet-600" />;
  } else {
    return <ShoppingBag className="h-5 w-5 text-gray-600" />;
  }
};

export const getColorForType = (type: AccountType, subcategory?: AccountSubcategory): string => {
  switch (type) {
    case "activo":
      if (subcategory === "circulante") return "bg-emerald-50 text-emerald-700 border-emerald-200";
      if (subcategory === "fijo") return "bg-teal-50 text-teal-700 border-teal-200";
      if (subcategory === "diferido") return "bg-cyan-50 text-cyan-700 border-cyan-200";
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pasivo":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "capital":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "ingreso":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "gasto":
      return "bg-violet-50 text-violet-700 border-violet-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getTextColorForType = (type: AccountType, subcategory?: AccountSubcategory): string => {
  switch (type) {
    case "activo":
      if (subcategory === "circulante") return "text-emerald-700";
      if (subcategory === "fijo") return "text-teal-700";
      if (subcategory === "diferido") return "text-cyan-700";
      return "text-emerald-700";
    case "pasivo":
      return "text-rose-700";
    case "capital":
      return "text-indigo-700";
    case "ingreso":
      return "text-amber-700";
    case "gasto":
      return "text-violet-700";
    default:
      return "text-gray-700";
  }
};

export const getSubcategoryLabel = (subcategory?: AccountSubcategory): string => {
  if (!subcategory || subcategory === "none") return "";
  
  const labels: Record<AccountSubcategory, string> = {
    circulante: "Circulante",
    fijo: "Fijo",
    diferido: "No Circulante",
    corto_plazo: "Corto Plazo",
    largo_plazo: "Largo Plazo",
    contribuido: "Contribuido",
    ganado: "Ganado",
    operativos: "Operativos",
    no_operativos: "No Operativos",
    operativos_admin: "Operativos (Admin)",
    operativos_venta: "Operativos (Ventas)",
    financieros: "Financieros",
    otros: "Otros",
    none: ""
  };
  
  return labels[subcategory];
};
