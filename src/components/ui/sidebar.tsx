
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Book, 
  LayoutDashboard, 
  ListChecks, 
  ClipboardList, 
  FileText, 
  Users,
  Package 
} from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className, ...props }: SidebarProps) {
  const location = useLocation();
  const { setProfileSelectorOpen } = useProfile();

  const isCurrentPath = (path: string) => {
    if (path === "/" && location.pathname !== "/") {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: "Panel Principal",
    },
    {
      href: "/diario",
      icon: <Book className="h-5 w-5" />,
      title: "Libro Diario",
    },
    {
      href: "/general-ledger",
      icon: <ListChecks className="h-5 w-5" />,
      title: "Libro Mayor",
    },
    {
      href: "/cuentas",
      icon: <Book className="h-5 w-5" />,
      title: "Catálogo de Cuentas",
    },
    {
      href: "/balanza",
      icon: <ClipboardList className="h-5 w-5" />,
      title: "Balanza de Comprobación",
    },
    {
      href: "/resultados",
      icon: <FileText className="h-5 w-5" />,
      title: "Estado de Resultados",
    },
    {
      href: "/balance",
      icon: <FileText className="h-5 w-5" />,
      title: "Estado de Situación Financiera",
    },
    {
      href: "/inventarios",
      icon: <Package className="h-5 w-5" />,
      title: "Inventarios",
    }
  ];

  return (
    <div className="fixed inset-y-0 z-10 flex w-64 flex-col bg-white border-r">
      <div className="flex h-14 items-center border-b bg-white px-4">
        <span className="font-semibold">Sistema Contable</span>
      </div>
      <nav className="flex-1 overflow-auto py-3 px-2">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-md px-3 text-gray-500 transition-colors hover:text-gray-900",
                  isCurrentPath(item.href) &&
                    "bg-gray-100 text-gray-900 font-medium",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
          
          {/* Profile selector button */}
          <li>
            <button
              onClick={() => setProfileSelectorOpen(true)}
              className="w-full flex h-10 items-center gap-2 rounded-md px-3 text-gray-500 transition-colors hover:text-gray-900 hover:bg-gray-100"
            >
              <Users className="h-5 w-5" />
              Gestionar Perfiles
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
