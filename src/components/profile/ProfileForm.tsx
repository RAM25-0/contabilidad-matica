
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
import { Switch } from "@/components/ui/switch";
import { IconSelector } from "./IconSelector";
import { PasswordField } from "./PasswordField";
import { CurrencySelector } from "./CurrencySelector";

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
        
        <CurrencySelector control={form.control} name="currency" />
        
        <IconSelector control={form.control} name="iconName" />
        
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
        
        <PasswordField 
          control={form.control} 
          name="password" 
          showField={hasPassword} 
        />
        
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
