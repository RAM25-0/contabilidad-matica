
import { v4 as uuidv4 } from "uuid";
import { Account, TransactionEntry } from "@/types/accounting";
import { toast } from "@/components/ui/use-toast";

// Función para crear una entrada de transacción
const createEntry = (account: Account, isDebit: boolean, amount: number): TransactionEntry => {
  return {
    id: uuidv4(),
    accountId: account.id,
    accountName: account.name,
    accountType: account.type,
    debit: isDebit ? amount : 0,
    credit: !isDebit ? amount : 0,
  };
};

// Función para generar transacciones de ejemplo
export const generateDemoTransactions = (accounts: Account[], addTransaction: Function) => {
  // Verificar que existan cuentas suficientes
  if (accounts.length < 5) {
    toast({
      title: "Error",
      description: "Se necesitan al menos 5 cuentas para generar transacciones de ejemplo",
      variant: "destructive",
    });
    return false;
  }

  // Buscar cuentas por tipo
  const caja = accounts.find(a => a.name.toLowerCase().includes("caja") || a.name.toLowerCase().includes("efectivo"));
  const bancos = accounts.find(a => a.name.toLowerCase().includes("banco"));
  const clientes = accounts.find(a => a.name.toLowerCase().includes("cliente"));
  const inventario = accounts.find(a => a.name.toLowerCase().includes("inventario") || a.name.toLowerCase().includes("mercancía"));
  const proveedores = accounts.find(a => a.name.toLowerCase().includes("proveedor"));
  const capital = accounts.find(a => a.type === "capital");
  const ventas = accounts.find(a => a.type === "ingreso" && a.name.toLowerCase().includes("ventas"));
  const costoVentas = accounts.find(a => a.type === "gasto" && a.name.toLowerCase().includes("costo"));
  const gastosSueldos = accounts.find(a => a.type === "gasto" && a.name.toLowerCase().includes("sueldo"));
  const gastosRenta = accounts.find(a => a.type === "gasto" && a.name.toLowerCase().includes("renta"));

  // Si no se encuentran las cuentas necesarias, usar cuentas genéricas por tipo
  const efectivo = caja || bancos || accounts.find(a => a.type === "activo");
  const porCobrar = clientes || accounts.find(a => a.type === "activo" && a.subcategory === "circulante");
  const mercancia = inventario || accounts.find(a => a.type === "activo" && a.subcategory === "circulante");
  const porPagar = proveedores || accounts.find(a => a.type === "pasivo");
  const patrimonial = capital || accounts.find(a => a.type === "capital");
  const ingresos = ventas || accounts.find(a => a.type === "ingreso");
  const gastos = costoVentas || gastosSueldos || gastosRenta || accounts.find(a => a.type === "gasto");

  if (!efectivo || !porCobrar || !mercancia || !porPagar || !patrimonial || !ingresos || !gastos) {
    toast({
      title: "Error",
      description: "No se encontraron cuentas de todos los tipos necesarios",
      variant: "destructive",
    });
    return false;
  }

  // Simulación de 5 transacciones
  try {
    // 1. Aportación inicial de capital
    const fechaInicial = new Date();
    fechaInicial.setDate(fechaInicial.getDate() - 30); // 30 días atrás
    
    addTransaction({
      date: fechaInicial,
      description: "Aportación inicial de capital",
      entries: [
        createEntry(efectivo, true, 50000),
        createEntry(patrimonial, false, 50000)
      ]
    });

    // 2. Compra de mercancía a crédito
    const fechaCompra = new Date(fechaInicial);
    fechaCompra.setDate(fechaCompra.getDate() + 5);
    
    addTransaction({
      date: fechaCompra,
      description: "Compra de mercancía a crédito",
      entries: [
        createEntry(mercancia, true, 20000),
        createEntry(porPagar, false, 20000)
      ]
    });

    // 3. Venta de mercancía al contado
    const fechaVenta = new Date(fechaCompra);
    fechaVenta.setDate(fechaVenta.getDate() + 10);
    
    addTransaction({
      date: fechaVenta,
      description: "Venta de mercancía al contado",
      entries: [
        createEntry(efectivo, true, 15000),
        createEntry(ingresos, false, 15000)
      ]
    });

    // 4. Registro del costo de ventas
    addTransaction({
      date: fechaVenta,
      description: "Registro del costo de la mercancía vendida",
      entries: [
        createEntry(gastos, true, 10000),
        createEntry(mercancia, false, 10000)
      ]
    });

    // 5. Venta a crédito
    const fechaVentaCredito = new Date(fechaVenta);
    fechaVentaCredito.setDate(fechaVentaCredito.getDate() + 7);
    
    addTransaction({
      date: fechaVentaCredito,
      description: "Venta de mercancía a crédito",
      entries: [
        createEntry(porCobrar, true, 12000),
        createEntry(ingresos, false, 12000)
      ]
    });

    // 6. Costo de la venta a crédito
    addTransaction({
      date: fechaVentaCredito,
      description: "Registro del costo de la mercancía vendida a crédito",
      entries: [
        createEntry(gastos, true, 8000),
        createEntry(mercancia, false, 8000)
      ]
    });

    // 7. Pago a proveedores
    const fechaPago = new Date(fechaVentaCredito);
    fechaPago.setDate(fechaPago.getDate() + 5);
    
    addTransaction({
      date: fechaPago,
      description: "Pago parcial a proveedores",
      entries: [
        createEntry(porPagar, true, 12000),
        createEntry(efectivo, false, 12000)
      ]
    });

    // 8. Pago de gastos
    const fechaGastos = new Date(fechaPago);
    fechaGastos.setDate(fechaGastos.getDate() + 3);
    
    addTransaction({
      date: fechaGastos,
      description: "Pago de gastos operativos",
      entries: [
        createEntry(gastos, true, 5000),
        createEntry(efectivo, false, 5000)
      ]
    });

    toast({
      title: "Simulación completada",
      description: "Se han generado 8 transacciones de ejemplo para probar el sistema contable",
    });
    
    return true;
  } catch (error) {
    console.error("Error al generar transacciones de ejemplo:", error);
    toast({
      title: "Error",
      description: "No se pudieron generar las transacciones de ejemplo",
      variant: "destructive",
    });
    return false;
  }
};
