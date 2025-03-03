
import * as z from "zod";

export const formSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida.",
  }),
  description: z.string().min(3, "La descripción debe tener al menos 3 caracteres."),
  entries: z.array(
    z.object({
      accountId: z.string().min(1, "La cuenta es requerida."),
      type: z.enum(["cargo", "abono"]),
      amount: z.number().min(0.01, "El valor debe ser mayor a cero."),
    })
  ).refine(entries => entries.length >= 2, {
    message: "Debes agregar al menos dos asientos contables.",
  }).refine(entries => {
    const totalCargo = entries
      .filter(entry => entry.type === "cargo")
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const totalAbono = entries
      .filter(entry => entry.type === "abono")
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    return Math.abs(totalCargo - totalAbono) < 0.001; // Tolerancia para errores de punto flotante
  }, {
    message: "Los cargos deben ser iguales a los abonos.",
  }),
});

export type FormData = z.infer<typeof formSchema>;

export const defaultValues: FormData = {
  date: new Date(),
  description: "",
  entries: [
    { accountId: "", type: "cargo", amount: 0 },
    { accountId: "", type: "abono", amount: 0 },
  ],
};
