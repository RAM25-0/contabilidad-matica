import React from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { ScheduledPayment, PaymentFrequency } from "@/types/scheduled-payment";
import { useAccounting } from "@/contexts/AccountingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const frequencyLabels: Record<PaymentFrequency, string> = {
  once: "Único",
  weekly: "Semanal",
  biweekly: "Quincenal",
  monthly: "Mensual",
  quarterly: "Trimestral",
  yearly: "Anual",
};

interface PaymentsListProps {
  payments: ScheduledPayment[];
  onDelete: (id: string) => void;
  simulatedDate: Date;
}

export function PaymentsList({ payments, onDelete, simulatedDate }: PaymentsListProps) {
  const { state } = useAccounting();

  const getAccountName = (id: string) => {
    const account = state.accounts.find((a) => a.id === id);
    return account ? `${account.code} - ${account.name}` : "Cuenta no encontrada";
  };

  const isPending = (payment: ScheduledPayment) => {
    const startDate = parseISO(payment.startDate);
    return startDate <= simulatedDate && 
           (!payment.lastExecutedDate || parseISO(payment.lastExecutedDate) < simulatedDate);
  };

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No hay pagos programados. Crea uno nuevo para empezar.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <Card key={payment.id} className={isPending(payment) ? "border-primary" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span>{payment.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant={isPending(payment) ? "default" : "secondary"}>
                  {isPending(payment) ? "Pendiente" : frequencyLabels[payment.frequency]}
                </Badge>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar pago programado?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El pago "{payment.name}" será eliminado permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(payment.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <DollarSign className="h-5 w-5" />
              {formatCurrency(payment.amount)}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Desde: {format(parseISO(payment.startDate), "PPP", { locale: es })}
                {payment.endDate && (
                  <> hasta: {format(parseISO(payment.endDate), "PPP", { locale: es })}</>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-red-600">{getAccountName(payment.debitAccountId)}</span>
              <ArrowRight className="h-4 w-4" />
              <span className="font-medium text-green-600">{getAccountName(payment.creditAccountId)}</span>
            </div>

            {payment.description && (
              <p className="text-sm text-muted-foreground">{payment.description}</p>
            )}

            {payment.lastExecutedDate && (
              <p className="text-xs text-muted-foreground">
                Último pago: {format(parseISO(payment.lastExecutedDate), "PPP", { locale: es })}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
