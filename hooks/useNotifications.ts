import { useEffect, useState, useCallback } from 'react';
import type { ExpiringDocument } from '@/types';
import { NOTIFICATION_POLL_INTERVAL } from '@/lib/constants';

export const useNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [expiringDocs, setExpiringDocs] = useState<ExpiringDocument[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result === 'granted') {
                new Notification('¡Notificaciones activadas!', {
                    body: 'Te avisaremos cuando tus documentos estén por vencer.',
                    icon: '/favicon.ico'
                });
            }
            return result;
        }
        return 'default';
    };

    const checkExpiringDocuments = useCallback(async () => {
        try {
            const response = await fetch('/api/documents/expiring?days=30');
            const data = await response.json();
            const docs: ExpiringDocument[] = Array.isArray(data) ? data : [];
            setExpiringDocs(docs);

            // Only notify if permission is granted and there are new docs to notify about
            if (Notification.permission === 'granted' && docs.length > 0) {
                const criticalDocs = docs.filter(d => d.daysUntilExpiry <= 7);
                if (criticalDocs.length > 0) {
                    new Notification('Documentos por vencer', {
                        body: `Tienes ${criticalDocs.length} documentos que vencen en menos de una semana.`,
                        tag: 'expiring-docs',
                    });
                }
            }
        } catch (err) {
            console.error('Error checking expiring documents:', err);
        }
    }, []);

    useEffect(() => {
        checkExpiringDocuments();
        const interval = setInterval(checkExpiringDocuments, NOTIFICATION_POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [checkExpiringDocuments]);

    return {
        permission,
        requestPermission,
        expiringDocs,
        refetch: checkExpiringDocuments
    };
};
