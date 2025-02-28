
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Landmark, Wallet, BarChart } from "lucide-react";
import { useAccounting } from "@/contexts/AccountingContext";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function AccountingSummary() {
  const { getTotalsByType } = useAccounting();
  const { activos, pasivos, capital, equation } = getTotalsByType();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Activos Totales</CardTitle>
          <Wallet className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold balance-animation">
            {formatCurrency(activos)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Bienes y derechos
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Pasivos Totales</CardTitle>
          <Landmark className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold balance-animation">
            {formatCurrency(pasivos)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Obligaciones y deudas
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Capital Total</CardTitle>
          <BarChart className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold balance-animation">
            {formatCurrency(capital)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Aportaciones e ingresos netos
          </p>
        </CardContent>
      </Card>
      
      <Card className={`hover-scale ${equation ? "border-green-300" : "border-red-300"}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Ecuación Contable</CardTitle>
          <DollarSign className={`h-4 w-4 ${equation ? "text-green-600" : "text-red-600"}`} />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold">A = P + C</div>
          <div className={`text-sm ${equation ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
            {equation ? "Balanceada ✓" : "No balanceada ✗"}
          </div>
          
          <Separator className="my-2" />
          
          <div className="text-xs grid grid-cols-3 gap-1">
            <div className="text-center">
              <span className="font-medium">{formatCurrency(activos)}</span>
              <span> = </span>
            </div>
            <div className="text-center">
              <span className="font-medium">{formatCurrency(pasivos)}</span>
              <span> + </span>
            </div>
            <div className="text-center">
              <span className="font-medium">{formatCurrency(capital)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
