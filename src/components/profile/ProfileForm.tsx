
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProfile } from "@/contexts/ProfileContext";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Building2, Briefcase, User } from "lucide-react";

interface ProfileFormProps {
  onCancel: () => void;
  profile?: {
    id: string;
    name: string;
    currency: string;
    iconName?: string;
    hasPassword?: boolean;
    password?: string;
  };
}

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  currency: z.string().min(1, "Selecciona una moneda"),
  iconName: z.string().optional(),
  hasPassword: z.boolean().default(false),
  password: z.string().optional(),
});

export function ProfileForm({ onCancel, profile }: ProfileFormProps) {
  const { addProfile, updateProfile } = useProfile();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || "",
      currency: profile?.currency || "MXN",
      iconName: profile?.iconName || "building",
      hasPassword: profile?.hasPassword || false,
      password: "",
    },
  });
  
  const hasPassword = form.watch("hasPassword");

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (profile) {
      updateProfile({
        ...profile,
        ...values,
        password: values.password || profile.password
      });
    } else {
      // Fix: Ensure name and currency are not undefined when passing to addProfile
      addProfile({
        name: values.name, // This is required by the Profile type
        currency: values.currency, // This is required by the Profile type
        iconName: values.iconName,
        hasPassword: values.hasPassword,
        password: values.password
      });
    }
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Perfil</FormLabel>
              <FormControl>
                <Input placeholder="Mi Empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moneda</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar moneda" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="iconName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icono</FormLabel>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-1 flex-col items-center gap-2 p-4 ${field.value === "building" ? "border-primary ring-1 ring-primary" : ""}`}
                  onClick={() => field.onChange("building")}
                >
                  <Building2 className="h-6 w-6" />
                  <span className="text-xs">Empresa</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-1 flex-col items-center gap-2 p-4 ${field.value === "briefcase" ? "border-primary ring-1 ring-primary" : ""}`}
                  onClick={() => field.onChange("briefcase")}
                >
                  <Briefcase className="h-6 w-6" />
                  <span className="text-xs">Trabajo</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-1 flex-col items-center gap-2 p-4 ${field.value === "user" ? "border-primary ring-1 ring-primary" : ""}`}
                  onClick={() => field.onChange("user")}
                >
                  <User className="h-6 w-6" />
                  <span className="text-xs">Personal</span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasPassword"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Proteger con contraseña</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {hasPassword && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Ingrese su contraseña" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {profile ? "Guardar" : "Crear Perfil"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
