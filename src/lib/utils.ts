
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', { 
    style: 'currency', 
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(amount));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
