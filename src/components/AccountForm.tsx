
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAccounting } from "@/contexts/AccountingContext";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  code: z.string().min(1, "El código es requerido"),
  type: z.enum(["activo", "pasivo", "capital", "ingreso", "gasto"]),
  nature: z.enum(["deudora", "acreedora"]),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AccountForm() {
  const { state, addAccount, updateAccount, setActiveAccount } = useAccounting();
  const { activeAccount } = state;
  
  const isEditing = !!activeAccount?.id;
  
  const defaultValues: FormData = {
    name: activeAccount?.name || "",
    code: activeAccount?.code || "",
    type: activeAccount?.type || "activo",
    nature: activeAccount?.nature || "deudora",
    description: activeAccount?.description || "",
  };
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Reset form when activeAccount changes
  React.useEffect(() => {
    form.reset({
      name: activeAccount?.name || "",
      code: activeAccount?.code || "",
      type: activeAccount?.type || "activo",
      nature: activeAccount?.nature || "deudora",
      description: activeAccount?.description || "",
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
      // Al añadir una nueva cuenta, nos aseguramos de que todos los campos requeridos estén presentes
      const newAccount = {
        name: data.name,
        code: data.code,
        type: data.type,
        nature: data.nature,
        description: data.description
      };
      
      addAccount(newAccount);
      toast({
        title: "Cuenta creada",
        description: `La cuenta "${data.name}" ha sido creada exitosamente.`,
      });
    }
    setActiveAccount(null);
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
            <div className="grid grid-cols-2 gap-4">
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 1-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de cuenta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
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
                name="nature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Naturaleza</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione naturaleza" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="deudora">Deudora</SelectItem>
                        <SelectItem value="acreedora">Acreedora</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
