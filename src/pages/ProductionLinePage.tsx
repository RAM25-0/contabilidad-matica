import { Sidebar } from "@/components/ui/sidebar";

export function ProductionLinePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Línea de Producción</h1>
          <div className="bg-card rounded-lg border p-6">
            <p className="text-muted-foreground">
              Contenido de línea de producción próximamente.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
