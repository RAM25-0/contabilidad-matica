import { Sidebar } from "@/components/ui/sidebar";
import { RawMaterialBlock } from "@/components/production/RawMaterialBlock";

export function ProductionLinePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Línea de Producción</h1>
            <p className="text-muted-foreground mt-1">
              Gestión de costos de producción: M.P., M.O., G.I.
            </p>
          </div>
          
          <RawMaterialBlock />
          
          {/* Placeholder for M.O. and G.I. blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-lg border p-6 opacity-50">
              <h3 className="font-medium text-muted-foreground">Mano de Obra (M.O.)</h3>
              <p className="text-sm text-muted-foreground mt-1">Próximamente...</p>
            </div>
            <div className="bg-card rounded-lg border p-6 opacity-50">
              <h3 className="font-medium text-muted-foreground">Gastos Indirectos (G.I.)</h3>
              <p className="text-sm text-muted-foreground mt-1">Próximamente...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
