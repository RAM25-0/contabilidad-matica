
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAccounting } from "@/contexts/AccountingContext";
import { toast } from "@/components/ui/use-toast";
import { AccountSubcategory } from "@/types/accounting";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  type: z.enum(["activo", "pasivo", "capital", "ingreso", "gasto"]),
  nature: z.enum(["deudora", "acreedora"]),
  description: z.string().optional(),
  subcategory: z.enum([
    "circulante", "fijo", "diferido", 
    "corto_plazo", "largo_plazo", 
    "contribuido", "ganado", 
    "operativos", "no_operativos", 
    "operativos_admin", "operativos_venta", 
    "financieros", "otros", "none"
  ]).default("none"),
});

type FormData = z.infer<typeof formSchema>;

export function AccountForm() {
  const { state, addAccount, updateAccount, setActiveAccount } = useAccounting();
  const { activeAccount } = state;
  
  const isEditing = !!activeAccount?.id;
  
  const defaultValues: FormData = {
    name: activeAccount?.name || "",
    type: activeAccount?.type || "activo",
    nature: activeAccount?.nature || "deudora",
    description: activeAccount?.description || "",
    subcategory: activeAccount?.subcategory || "none",
  };
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Reset form when activeAccount changes
  React.useEffect(() => {
    form.reset({
      name: activeAccount?.name || "",
      type: activeAccount?.type || "activo",
      nature: activeAccount?.nature || "deudora",
      description: activeAccount?.description || "",
      subcategory: activeAccount?.subcategory || "none",
    });
  }, [activeAccount, form]);
  
  // Auto-set nature based on account type
  React.useEffect(() => {
    const watchType = form.watch("type");
    let defaultNature: "deudora" | "acreedora" = "deudora";
    
    if (watchType === "activo" || watchType === "gasto") {
      defaultNature = "deudora";
    } else if (watchType === "pasivo" || watchType === "capital" || watchType === "ingreso") {
      defaultNature = "acreedora";
    }
    
    form.setValue("nature", defaultNature);
  }, [form.watch("type")]);
  
  const onSubmit = (data: FormData) => {
    if (isEditing && activeAccount) {
      updateAccount({
        ...activeAccount,
        ...data,
      });
      toast({
        title: "Cuenta actualizada",
        description: `La cuenta "${data.name}" ha sido actualizada exitosamente.`,
      });
    } else {
      // Generamos automáticamente un código basado en el tipo de cuenta
      const accountTypePrefix = {
        activo: "1",
        pasivo: "2",
        capital: "3",
        ingreso: "4",
        gasto: "5"
      }[data.type];
      
      // Al añadir una nueva cuenta, nos aseguramos de que todos los campos requeridos estén presentes
      const newAccount = {
        name: data.name,
        code: `${accountTypePrefix}-${Math.floor(Math.random() * 1000).toString().padStart(2, '0')}`, // Código generado automáticamente
        type: data.type,
        nature: data.nature,
        description: data.description,
        subcategory: data.subcategory
      };
      
      addAccount(newAccount);
      toast({
        title: "Cuenta creada",
        description: `La cuenta "${data.name}" ha sido creada exitosamente.`,
      });
    }
    setActiveAccount(null);
  };

  const getNatureDescription = (nature: string) => {
    return nature === "deudora" 
      ? "Aumenta con cargos (Debe) y disminuye con abonos (Haber)" 
      : "Aumenta con abonos (Haber) y disminuye con cargos (Debe)";
  };

  const getSubcategoryOptions = (accountType: string) => {
    switch (accountType) {
      case "activo":
        return [
          { value: "circulante", label: "Circulante" },
          { value: "fijo", label: "Fijo" },
          { value: "diferido", label: "No Circulante" },
          { value: "none", label: "Sin clasificar" }
        ];
      case "pasivo":
        return [
          { value: "corto_plazo", label: "Corto Plazo" },
          { value: "largo_plazo", label: "Largo Plazo" },
          { value: "none", label: "Sin clasificar" }
        ];
      case "capital":
        return [
          { value: "contribuido", label: "Contribuido" },
          { value: "ganado", label: "Ganado" },
          { value: "none", label: "Sin clasificar" }
        ];
      case "ingreso":
        return [
          { value: "operativos", label: "Operativos" },
          { value: "no_operativos", label: "No Operativos" },
          { value: "none", label: "Sin clasificar" }
        ];
      case "gasto":
        return [
          { value: "operativos_admin", label: "Operativos (Administración)" },
          { value: "operativos_venta", label: "Operativos (Ventas)" },
          { value: "financieros", label: "Financieros" },
          { value: "otros", label: "Otros" },
          { value: "none", label: "Sin clasificar" }
        ];
      default:
        return [{ value: "none", label: "Sin clasificar" }];
    }
  };
  
  return (
    <Dialog 
      open={!!activeAccount} 
      onOpenChange={(open) => !open && setActiveAccount(null)}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar cuenta" : "Crear nueva cuenta"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifica los detalles de la cuenta contable." 
              : "Ingresa los detalles de la nueva cuenta contable."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Caja" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de cuenta</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset subcategory when type changes
                      form.setValue("subcategory", "none");
                    }}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="pasivo">Pasivo</SelectItem>
                      <SelectItem value="capital">Capital</SelectItem>
                      <SelectItem value="ingreso">Ingreso</SelectItem>
                      <SelectItem value="gasto">Gasto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione la subcategoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getSubcategoryOptions(form.watch("type")).map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nature"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Naturaleza</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="deudora" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Deudora (Cargo)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="acreedora" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Acreedora (Abono)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {getNatureDescription(field.value)}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la cuenta..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveAccount(null)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
