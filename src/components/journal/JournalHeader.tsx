
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PieChart } from "lucide-react";

export function JournalHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Libro Diario</h1>
        <p className="text-muted-foreground mt-2">
          Registra y consulta las transacciones en el libro diario contable.
        </p>
      </div>
      <div className="flex gap-2">
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Inicio
          </Button>
        </Link>
        <Link to="/mayor">
          <Button variant="outline" className="gap-2">
            <PieChart className="h-4 w-4" />
            Ir al Libro Mayor
          </Button>
        </Link>
      </div>
    </div>
  );
}
