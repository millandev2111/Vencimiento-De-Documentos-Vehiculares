export const DOCUMENT_TYPE_SLUGS = {
    SOAT: 'soat',
    TARJETA_OPERACION: 'tarjeta-operacion',
    TECNICO_MECANICA: 'tecnico-mecanica',
    POLIZA_RCC: 'poliza-rcc',
    POLIZA_RCE: 'poliza-rce',
    BIMESTRAL: 'bimestral',
    CONVENIO_EMPRESARIAL: 'convenio-empresarial',
} as const;

// Alert thresholds in days
export const ALERT_DAYS_WARNING = 30;
export const ALERT_DAYS_CRITICAL = 7;

// Polling interval for notifications (ms)
export const NOTIFICATION_POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const STATUS_LABELS: Record<string, string> = {
    active: 'Vigente',
    expiring: 'Por vencer',
    expired: 'Vencido',
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    active: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', border: '#10B981' },
    expiring: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', border: '#F59E0B' },
    expired: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', border: '#EF4444' },
};
