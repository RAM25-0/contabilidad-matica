
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PepsOperation } from "@/types/peps-inventory";

interface DeletePepsOperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operation: PepsOperation | null;
  onConfirm: () => void;
}

export function DeletePepsOperationDialog({
  open,
  onOpenChange,
  operation,
  onConfirm,
}: DeletePepsOperationDialogProps) {
  if (!operation) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Borrar operación?</DialogTitle>
        </DialogHeader>
        <div>¿Seguro que quieres borrar la operación <b>{operation.description}</b>?</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false); }}>Borrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
