import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Play } from "lucide-react";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { es } from "date-fns/locale";

interface SimulationCalendarProps {
  simulatedDate: Date;
  onDateChange: (date: Date) => void;
  onExecutePayments: () => void;
  pendingPaymentsCount: number;
}

export function SimulationCalendar({
  simulatedDate,
  onDateChange,
  onExecutePayments,
  pendingPaymentsCount,
}: SimulationCalendarProps) {
  const handleReset = () => {
    onDateChange(new Date());
  };

  const handleAdvance = (days: number) => {
    onDateChange(addDays(simulatedDate, days));
  };

  const handleAdvanceWeek = () => {
    onDateChange(addWeeks(simulatedDate, 1));
  };

  const handleAdvanceMonth = () => {
    onDateChange(addMonths(simulatedDate, 1));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Calendario de Simulación</span>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Hoy
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Fecha simulada actual:</p>
          <p className="text-2xl font-bold text-primary">
            {format(simulatedDate, "PPPP", { locale: es })}
          </p>
        </div>

        <Calendar
          mode="single"
          selected={simulatedDate}
          onSelect={(date) => date && onDateChange(date)}
          className="rounded-md border pointer-events-auto"
          locale={es}
        />

        <div className="flex flex-wrap gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={() => handleAdvance(-1)}>
            <ChevronLeft className="h-4 w-4" />
            1 día
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAdvance(1)}>
            1 día
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleAdvanceWeek}>
            +1 semana
          </Button>
          <Button variant="outline" size="sm" onClick={handleAdvanceMonth}>
            +1 mes
          </Button>
        </div>

        {pendingPaymentsCount > 0 && (
          <Button 
            className="w-full" 
            onClick={onExecutePayments}
          >
            <Play className="h-4 w-4 mr-2" />
            Ejecutar {pendingPaymentsCount} pago(s) pendiente(s)
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
