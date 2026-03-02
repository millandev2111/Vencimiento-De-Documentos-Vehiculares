'use client';

import React from 'react';
import type { ExpiringDocument } from '@/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, getSeverity } from '@/lib/utils';
import { AlertCircle, ChevronRight, Car } from 'lucide-react';
import Link from 'next/link';

interface ExpiringAlertProps {
    documents: ExpiringDocument[];
}

export const ExpiringAlert = ({ documents }: ExpiringAlertProps) => {
    if (!Array.isArray(documents) || documents.length === 0) {
        return (
            <Card className="flex items-center justify-center py-10 border-dashed bg-transparent">
                <div className="text-center">
                    <p className="text-zinc-500 text-sm">No hay alertas críticas en los próximos 30 días.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {documents.map((doc) => {
                const severity = getSeverity(doc.daysUntilExpiry);

                return (
                    <Link key={doc.id} href={`/vehicles/${doc.vehicle_id}`}>
                        <Card className="hover:scale-[1.01] active:scale-100 transition-transform p-4 border-l-4"
                            style={{ borderLeftColor: severity === 'critical' ? '#ef4444' : '#f59e0b' }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                        <span className="text-xl">{doc.document_type.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">
                                            {doc.document_type.name} — <span className="text-blue-400">{doc.vehicle.plate}</span>
                                        </h4>
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                            Vence el {formatDate(doc.expiry_date)} ({doc.daysUntilExpiry < 0 ? 'Vencido' : `${doc.daysUntilExpiry} días restantes`})
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Car className="h-3 w-3 text-zinc-600" />
                                            <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                                                {doc.vehicle.brand} {doc.vehicle.model}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge status={doc.status} />
                                    <ChevronRight className="h-4 w-4 text-zinc-700" />
                                </div>
                            </div>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
};
