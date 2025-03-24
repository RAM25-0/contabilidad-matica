
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookText,
  BookOpen,
  FileSpreadsheet,
  ClipboardList,
  ListTodo,
} from "lucide-react";

export function Sidebar() {
  const location = useLocation();
  
  const links = [
    {
      href: "/",
      label: "Panel",
      icon: <LayoutDashboard className="w-5 h-5 mr-2" />,
    },
    {
      href: "/general-ledger",
      label: "Libro Mayor",
      icon: <BookText className="w-5 h-5 mr-2" />,
    },
    {
      href: "/diario",
      label: "Libro Diario",
      icon: <BookOpen className="w-5 h-5 mr-2" />,
    },
    {
      href: "/cuentas",
      label: "Catálogo",
      icon: <ListTodo className="w-5 h-5 mr-2" />,
    },
    {
      href: "/balanza",
      label: "Balanza",
      icon: <ClipboardList className="w-5 h-5 mr-2" />,
    },
  ];
  
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-background border-r">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Sistema Contable</h2>
          <p className="text-sm text-muted-foreground">Gestión financiera</p>
        </div>
        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <Link to={link.href} key={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === link.href && "bg-muted"
                )}
              >
                {link.icon}
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
