
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Landmark, 
  Wallet, 
  BarChart3, 
  Receipt, 
  DollarSign 
} from "lucide-react";
import { AccountType } from "@/types/accounting";

interface AccountsTabsProps {
  selectedTab: AccountType | "todos";
  onTabChange: (value: string) => void;
}

export const AccountsTabs = ({ selectedTab, onTabChange }: AccountsTabsProps) => {
  const accountTypes: { value: AccountType | "todos"; label: string; icon: React.ReactNode }[] = [
    { value: "todos", label: "Todos", icon: <CreditCard className="h-4 w-4" /> },
    { value: "activo", label: "Activos", icon: <Wallet className="h-4 w-4" /> },
    { value: "pasivo", label: "Pasivos", icon: <Landmark className="h-4 w-4" /> },
    { value: "capital", label: "Capital", icon: <BarChart3 className="h-4 w-4" /> },
    { value: "ingreso", label: "Ingresos", icon: <DollarSign className="h-4 w-4" /> },
    { value: "gasto", label: "Egresos", icon: <Receipt className="h-4 w-4" /> },
  ];

  return (
    <Tabs 
      defaultValue="todos" 
      value={selectedTab} 
      onValueChange={onTabChange} 
      className="w-full"
    >
      <TabsList className="mb-4 w-full grid grid-cols-3 md:grid-cols-6">
        {accountTypes.map((type) => (
          <TabsTrigger 
            key={type.value} 
            value={type.value} 
            className="flex items-center gap-1.5"
          >
            {type.icon}
            <span className="hidden sm:inline">{type.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Aquí solo está el contenedor de las pestañas, el contenido se pasa como children */}
      {accountTypes.map((type) => (
        <TabsContent key={type.value} value={type.value} className="mt-0">
          {/* El contenido específico se pasa como children en AccountsList */}
        </TabsContent>
      ))}
    </Tabs>
  );
};
