export type PaymentFrequency = 'once' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export interface ScheduledPayment {
  id: string;
  name: string;
  amount: number;
  frequency: PaymentFrequency;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, optional for recurring
  debitAccountId: string;
  creditAccountId: string;
  description: string;
  isActive: boolean;
  lastExecutedDate?: string;
}

export interface PaymentExecution {
  paymentId: string;
  executionDate: string;
  amount: number;
  status: 'pending' | 'executed' | 'skipped';
}
