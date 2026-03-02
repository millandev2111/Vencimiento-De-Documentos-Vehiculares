import { addMonths, differenceInDays, format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import type { DocumentStatus } from '@/types';
import { ALERT_DAYS_WARNING } from './constants';

/**
 * Calculate expiry date by adding durationMonths to the issue date
 */
export function calculateExpiryDate(issueDate: string, durationMonths: number): Date {
    const parsed = parseISO(issueDate);
    return addMonths(parsed, durationMonths);
}

/**
 * Get the document status based on expiry date
 */
export function getDocumentStatus(
    expiryDate: string,
    alertDays: number = ALERT_DAYS_WARNING
): DocumentStatus {
    const expiry = parseISO(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysLeft = differenceInDays(expiry, today);

    if (daysLeft < 0) return 'expired';
    if (daysLeft <= alertDays) return 'expiring';
    return 'active';
}

/**
 * Get days until expiry (negative if already expired)
 */
export function getDaysUntilExpiry(expiryDate: string): number {
    const expiry = parseISO(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInDays(expiry, today);
}

/**
 * Format a date string for display
 */
export function formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    try {
        const d = parseISO(dateStr);
        if (!isValid(d)) return '—';
        return format(d, 'dd/MM/yyyy', { locale: es });
    } catch {
        return '—';
    }
}

/**
 * Format a date string to ISO date (YYYY-MM-DD) for inputs
 */
export function toInputDate(dateStr: string | Date): string {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(d, 'yyyy-MM-dd');
}

/**
 * Human-readable remaining time label
 */
export function getDaysLabel(days: number): string {
    if (days < 0) return `Venció hace ${Math.abs(days)} días`;
    if (days === 0) return 'Vence hoy';
    if (days === 1) return 'Vence mañana';
    return `${days} días restantes`;
}

/**
 * Get the severity for a given number of days (for UI coloring)
 */
export function getSeverity(days: number): 'critical' | 'warning' | 'ok' {
    if (days < 0) return 'critical';
    if (days <= 7) return 'critical';
    if (days <= 30) return 'warning';
    return 'ok';
}
