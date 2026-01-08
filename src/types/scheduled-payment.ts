export type PaymentFrequency = 'once' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export type PaymentEntryType = 'cargo' | 'abono';

export interface PaymentEntry {
  accountId: string;
  type: PaymentEntryType;
  amount: number;
}

export interface ScheduledPayment {
  id: string;
  name: string;
  frequency: PaymentFrequency;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, optional for recurring
  entries: PaymentEntry[];
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
