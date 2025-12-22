import { Sidebar } from "@/components/ui/sidebar";
import { RawMaterialBlock } from "@/components/production/RawMaterialBlock";
import { Factory, Wrench, Receipt } from "lucide-react";

export function ProductionLinePage() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <header className="space-y-2 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Factory className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Línea de Producción
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestión de costos: Materia Prima, Mano de Obra, Gastos Indirectos
                </p>
              </div>
            </div>
          </header>
          
          {/* Main content */}
          <div className="space-y-6 animate-fade-in-up stagger-1">
            <RawMaterialBlock />
          </div>
          
          {/* Placeholder cards for M.O. and G.I. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in-up stagger-2">
            <div className="group relative overflow-hidden rounded-xl border border-dashed border-border bg-card/50 p-6 transition-all duration-200 hover:border-muted-foreground/30 hover:bg-card">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Wrench className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">Mano de Obra (M.O.)</h3>
                  <p className="text-sm text-muted-foreground">
                    Costos de trabajo directo e indirecto
                  </p>
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Próximamente
                  </span>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl border border-dashed border-border bg-card/50 p-6 transition-all duration-200 hover:border-muted-foreground/30 hover:bg-card">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">Gastos Indirectos (G.I.)</h3>
                  <p className="text-sm text-muted-foreground">
                    Depreciación, servicios y otros gastos
                  </p>
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Próximamente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
