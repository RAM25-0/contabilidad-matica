import React, { useState, useEffect } from "react";
import { CalendarDays, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { parseISO, addDays, addWeeks, addMonths, addYears, isBefore, isAfter, isSameDay } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/contexts/ProfileContext";
import { useAccounting } from "@/contexts/AccountingContext";
import { ScheduledPayment, PaymentFrequency } from "@/types/scheduled-payment";
import { SimulationCalendar } from "@/components/payments/SimulationCalendar";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { PaymentsList } from "@/components/payments/PaymentsList";

export function PaymentsCalendarPage() {
  const { toast } = useToast();
  const { currentProfile, saveProfileData, getProfileData } = useProfile();
  const { addTransaction, state } = useAccounting();
  const profileId = currentProfile?.id || "default";

  const [simulatedDate, setSimulatedDate] = useState<Date>(() => {
    const saved = getProfileData<string>(profileId, "simulatedDate", null);
    return saved ? new Date(saved) : new Date();
  });

  const [payments, setPayments] = useState<ScheduledPayment[]>(() => {
    return getProfileData<ScheduledPayment[]>(profileId, "scheduledPayments", []) || [];
  });

  // Save to localStorage when state changes
  useEffect(() => {
    saveProfileData(profileId, "simulatedDate", simulatedDate.toISOString());
  }, [simulatedDate, profileId, saveProfileData]);

  useEffect(() => {
    saveProfileData(profileId, "scheduledPayments", payments);
  }, [payments, profileId, saveProfileData]);

  const handleAddPayment = (payment: ScheduledPayment) => {
    setPayments((prev) => [...prev, payment]);
    toast({
      title: "Pago programado",
      description: `Se ha programado el pago "${payment.name}"`,
    });
  };

  const handleDeletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Pago eliminado",
      description: "El pago programado ha sido eliminado",
    });
  };

  const getNextPaymentDate = (payment: ScheduledPayment, fromDate: Date): Date | null => {
    const startDate = parseISO(payment.startDate);
    const endDate = payment.endDate ? parseISO(payment.endDate) : null;

    if (isBefore(fromDate, startDate)) {
      return startDate;
    }

    if (endDate && isAfter(fromDate, endDate)) {
      return null;
    }

    const frequencyMap: Record<PaymentFrequency, (date: Date) => Date> = {
      once: (d) => d,
      weekly: (d) => addWeeks(d, 1),
      biweekly: (d) => addWeeks(d, 2),
      monthly: (d) => addMonths(d, 1),
      quarterly: (d) => addMonths(d, 3),
      yearly: (d) => addYears(d, 1),
    };

    if (payment.frequency === "once") {
      if (payment.lastExecutedDate) return null;
      return startDate;
    }

    let currentDate = startDate;
    while (isBefore(currentDate, fromDate) || isSameDay(currentDate, fromDate)) {
      const lastExec = payment.lastExecutedDate ? parseISO(payment.lastExecutedDate) : null;
      if (!lastExec || isBefore(lastExec, currentDate)) {
        if (isBefore(currentDate, fromDate) || isSameDay(currentDate, fromDate)) {
          return currentDate;
        }
      }
      currentDate = frequencyMap[payment.frequency](currentDate);
      if (endDate && isAfter(currentDate, endDate)) {
        return null;
      }
    }

    return null;
  };

  const getPendingPayments = () => {
    return payments.filter((payment) => {
      if (!payment.isActive) return false;
      const nextDate = getNextPaymentDate(payment, simulatedDate);
      if (!nextDate) return false;
      return isBefore(nextDate, simulatedDate) || isSameDay(nextDate, simulatedDate);
    });
  };

  const handleExecutePayments = () => {
    const pending = getPendingPayments();
    
    if (pending.length === 0) {
      toast({
        title: "Sin pagos pendientes",
        description: "No hay pagos que ejecutar en la fecha actual",
      });
      return;
    }

    pending.forEach((payment) => {
      const debitAccount = state.accounts.find((a) => a.id === payment.debitAccountId);
      const creditAccount = state.accounts.find((a) => a.id === payment.creditAccountId);

      if (!debitAccount || !creditAccount) {
        toast({
          title: "Error",
          description: `No se encontraron las cuentas para el pago "${payment.name}"`,
          variant: "destructive",
        });
        return;
      }

      // Create transaction with full entry data
      addTransaction({
        date: simulatedDate,
        description: `Pago programado: ${payment.name}`,
        entries: [
          {
            id: uuidv4(),
            accountId: payment.debitAccountId,
            accountName: debitAccount.name,
            accountType: debitAccount.type,
            debit: payment.amount,
            credit: 0,
          },
          {
            id: uuidv4(),
            accountId: payment.creditAccountId,
            accountName: creditAccount.name,
            accountType: creditAccount.type,
            debit: 0,
            credit: payment.amount,
          },
        ],
      });

      // Update payment lastExecutedDate
      setPayments((prev) =>
        prev.map((p) =>
          p.id === payment.id
            ? { ...p, lastExecutedDate: simulatedDate.toISOString() }
            : p
        )
      );
    });

    toast({
      title: "Pagos ejecutados",
      description: `Se han ejecutado ${pending.length} pago(s) y registrado en el libro diario`,
    });
  };

  const pendingCount = getPendingPayments().length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link to="/">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <CalendarDays className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Calendario de Pagos</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SimulationCalendar
            simulatedDate={simulatedDate}
            onDateChange={setSimulatedDate}
            onExecutePayments={handleExecutePayments}
            pendingPaymentsCount={pendingCount}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pagos Programados</h2>
            <PaymentForm onSave={handleAddPayment} />
          </div>
          
          <PaymentsList
            payments={payments}
            onDelete={handleDeletePayment}
            simulatedDate={simulatedDate}
          />
        </div>
      </div>
    </div>
  );
}
