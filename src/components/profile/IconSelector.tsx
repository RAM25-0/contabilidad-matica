
import React from "react";
import { Building2, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

interface IconSelectorProps {
  control: Control<any>;
  name: string;
}

export function IconSelector({ control, name }: IconSelectorProps) {
  return (
    <FormField
      control={control}
      name={name}
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
  );
}
