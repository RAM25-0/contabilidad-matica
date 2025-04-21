
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PepsOperation } from "@/types/peps-inventory";

interface EditPepsOperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operation: PepsOperation | null;
  onSubmit: (values: Partial<Omit<PepsOperation, "id" | "balance">>) => void;
}

export function EditPepsOperationDialog({
  open,
  onOpenChange,
  operation,
  onSubmit,
}: EditPepsOperationDialogProps) {
  const [description, setDescription] = useState(operation?.description || "");
  const [date, setDate] = useState(operation ? operation.date.toISOString().slice(0, 10) : "");

  React.useEffect(() => {
    setDescription(operation?.description || "");
    setDate(operation ? operation.date.toISOString().slice(0, 10) : "");
  }, [operation]);

  if (!operation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Operación</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <label className="block font-medium text-sm">
            Fecha:
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </label>
          <label className="block font-medium text-sm">
            Descripción:
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              onSubmit({
                date: new Date(date),
                description,
              });
              onOpenChange(false);
            }}
          >
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
