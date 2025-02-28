
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  BookText,
  BarChart3,
  Settings,
  ChevronRight,
  CircleDollarSign,
  Package,
  Users,
  CreditCard,
  LineChart,
  Wallet,
  FileCog,
  FileSpreadsheet,
  FileCheck,
  LayoutList,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  path: string;
  isActive?: boolean;
  isSubItem?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  path,
  isActive = false,
  isSubItem = false,
}) => {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
        isActive
          ? "bg-muted font-medium text-primary"
          : "text-muted-foreground",
        isSubItem ? "pl-10" : ""
      )}
    >
      {icon}
      <span>{title}</span>
      {isActive && (
        <ChevronRight className="ml-auto h-4 w-4 text-primary" />
      )}
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="group fixed inset-y-0 flex h-full flex-col border-r pb-10 pt-2">
      <div className="flex h-12 w-full shrink-0 items-center justify-start border-b px-4">
        <span className="text-xl font-semibold tracking-tight">EasyAccounting</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <SidebarItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            title="Panel Principal"
            path="/"
            isActive={path === "/"}
          />
          <SidebarItem
            icon={<BookOpen className="h-5 w-5" />}
            title="Libro Diario"
            path="/diario"
            isActive={path === "/diario"}
          />
          <SidebarItem
            icon={<LayoutList className="h-5 w-5" />}
            title="Catálogo de Cuentas"
            path="/cuentas"
            isActive={path === "/cuentas"}
          />
          <SidebarItem
            icon={<FileCheck className="h-5 w-5" />}
            title="Balance General"
            path="/balance"
            isActive={path === "/balance"}
          />
          <SidebarItem
            icon={<FileSpreadsheet className="h-5 w-5" />}
            title="Estado de Resultados"
            path="/resultados"
            isActive={path === "/resultados"}
          />
          <SidebarItem
            icon={<LineChart className="h-5 w-5" />}
            title="Gráficos y Reportes"
            path="/reportes"
            isActive={path === "/reportes"}
          />
          <SidebarItem
            icon={<Settings className="h-5 w-5" />}
            title="Configuración"
            path="/configuracion"
            isActive={path === "/configuracion"}
          />
        </nav>
      </div>
    </div>
  );
}
