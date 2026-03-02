'use client';

import React from 'react';
import type { Document } from '@/types';
import { Badge } from '../ui/Badge';
import { formatDate, getDaysUntilExpiry, getDaysLabel, getSeverity, getDocumentStatus } from '@/lib/utils';
import { Trash2, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface DocumentTableProps {
    documents: Document[];
    onDelete: (id: string) => void;
}

export const DocumentTable = ({ documents, onDelete }: DocumentTableProps) => {
    if (!Array.isArray(documents) || documents.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl">
                <Clock className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-500">No hay documentos registrados para este vehículo.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                        <th className="px-4 py-3">Documento</th>
                        <th className="px-4 py-3">Expedición</th>
                        <th className="px-4 py-3">Vencimiento</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 text-right">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {documents.map((doc) => {
                        const daysLeft = getDaysUntilExpiry(doc.expiry_date);
                        const severity = getSeverity(daysLeft);

                        return (
                            <tr key={doc.id} className="group hover:bg-zinc-900/30 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg"
                                            style={{ backgroundColor: `${doc.document_type?.color}15`, color: doc.document_type?.color }}
                                        >
                                            {doc.document_type?.icon}
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {doc.document_type?.name}
                                            </p>
                                            {doc.notes && (
                                                <p className="text-[11px] text-zinc-500 truncate max-w-[150px]">
                                                    {doc.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-zinc-400">
                                    {formatDate(doc.issue_date)}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white">
                                            {formatDate(doc.expiry_date)}
                                        </span>
                                        <span className={`text-[10px] font-medium uppercase tracking-tighter ${severity === 'critical' ? 'text-red-400' :
                                            severity === 'warning' ? 'text-amber-400' :
                                                'text-emerald-400'
                                            }`}>
                                            {getDaysLabel(daysLeft)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <Badge status={getDocumentStatus(doc.expiry_date)} />
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(doc.id)}
                                        className="text-zinc-600 hover:text-red-500 !p-1.5"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
