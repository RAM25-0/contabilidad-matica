
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AccountSubcategory, AccountType } from "@/types/accounting";
import {
  Banknote,
  Building2,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  PiggyBank,
  Wallet,
  WalletCards,
} from "lucide-react";

export const getIconForType = (
  type: AccountType, 
  subcategory?: AccountSubcategory
) => {
  switch (type) {
    case "activo":
      if (subcategory === "circulante") return <Wallet className="h-4 w-4" />;
      if (subcategory === "fijo") return <Building2 className="h-4 w-4" />;
      return <DollarSign className="h-4 w-4" />;
    case "pasivo":
      if (subcategory === "corto_plazo") return <Clock className="h-4 w-4" />;
      if (subcategory === "largo_plazo") return <FileText className="h-4 w-4" />;
      return <CreditCard className="h-4 w-4" />;
    case "capital":
      return <PiggyBank className="h-4 w-4" />;
    case "ingreso":
      return <Banknote className="h-4 w-4" />;
    case "gasto":
      return <WalletCards className="h-4 w-4" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

export const getTextColorForType = (
  type: AccountType, 
  subcategory?: AccountSubcategory
) => {
  switch (type) {
    case "activo":
      return "text-emerald-700";
    case "pasivo":
      if (subcategory === "corto_plazo") return "text-rose-500"; // Rojo claro
      if (subcategory === "largo_plazo") return "text-rose-700"; // Rojo oscuro
      return "text-rose-600"; // Por defecto para pasivos
    case "capital":
      return "text-purple-700";
    case "ingreso":
      return "text-blue-700";
    case "gasto":
      return "text-amber-700";
    default:
      return "text-slate-700";
  }
};

export const getBgColorForType = (
  type: AccountType, 
  subcategory?: AccountSubcategory
) => {
  switch (type) {
    case "activo":
      return "bg-emerald-100";
    case "pasivo":
      if (subcategory === "corto_plazo") return "bg-rose-100"; // Rojo claro - Fondo más suave
      if (subcategory === "largo_plazo") return "bg-rose-200"; // Rojo oscuro - Fondo más intenso
      return "bg-rose-100"; // Por defecto para pasivos
    case "capital":
      return "bg-purple-100";
    case "ingreso":
      return "bg-blue-100";
    case "gasto":
      return "bg-amber-100";
    default:
      return "bg-slate-100";
  }
};

export const getSubcategoryLabel = (subcategory: AccountSubcategory) => {
  switch (subcategory) {
    case "circulante": return "Activo Circulante (Current)";
    case "fijo": return "Activo No Circulante (Non Current)";
    case "diferido": return "Activos Intangibles";
    case "corto_plazo": return "Pasivo a Corto Plazo";
    case "largo_plazo": return "Pasivo a Largo Plazo";
    case "contribuido": return "Capital Contribuido";
    case "ganado": return "Capital Ganado";
    case "operativos": return "Ingresos Operativos";
    case "no_operativos": return "Ingresos No Operativos";
    case "operativos_admin": return "Gastos Operativos (Administración)";
    case "operativos_venta": return "Gastos Operativos (Ventas)";
    case "financieros": return "Gastos Financieros";
    case "otros": return "Otros Gastos";
    case "none": return "Sin Clasificar";
    default: return "Desconocido";
  }
};

interface AccountBadgeProps {
  type: AccountType;
  subcategory?: AccountSubcategory;
  label?: string;
  showIcon?: boolean;
}

export const AccountBadge = ({ 
  type, 
  subcategory, 
  label, 
  showIcon = true 
}: AccountBadgeProps) => {
  const icon = showIcon ? getIconForType(type, subcategory) : null;
  const textColor = getTextColorForType(type, subcategory);
  const bgColor = getBgColorForType(type, subcategory);
  
  return (
    <Badge 
      variant="outline" 
      className={`font-medium border-0 ${bgColor} ${textColor}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label || type}
    </Badge>
  );
};
