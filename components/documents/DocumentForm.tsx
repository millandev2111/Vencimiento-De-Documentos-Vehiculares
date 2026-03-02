'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import type { CreateDocumentDto, DocumentType, Document } from '@/types';
import { calculateExpiryDate, toInputDate } from '@/lib/utils';
import { Calendar, Info } from 'lucide-react';

interface DocumentFormProps {
    vehicleId: string;
    documentTypes: DocumentType[];
    onSubmit: (data: CreateDocumentDto) => Promise<void>;
    onCancel: () => void;
    initialData?: Document | null;
}

export const DocumentForm = ({
    vehicleId,
    documentTypes,
    onSubmit,
    onCancel,
    initialData
}: DocumentFormProps) => {
    const [formData, setFormData] = useState<CreateDocumentDto>({
        vehicle_id: vehicleId,
        document_type_id: initialData?.document_type_id || documentTypes[0]?.id || '',
        issue_date: initialData?.issue_date || toInputDate(new Date()),
        notes: initialData?.notes || '',
    });

    const [expiryPreview, setExpiryPreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update expiry preview whenever type or issue date changes
    useEffect(() => {
        const type = documentTypes.find(t => t.id === formData.document_type_id);
        if (type && formData.issue_date) {
            const expiry = calculateExpiryDate(formData.issue_date, type.duration_months);
            setExpiryPreview(toInputDate(expiry));
        }
    }, [formData.document_type_id, formData.issue_date, documentTypes]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-400">Tipo de Documento</label>
                <select
                    required
                    name="document_type_id"
                    value={formData.document_type_id}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {documentTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.icon} {type.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Fecha de Expedición</label>
                    <div className="relative">
                        <input
                            required
                            type="date"
                            name="issue_date"
                            value={formData.issue_date}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Vencimiento (Auto)</label>
                    <div className="relative">
                        <input
                            disabled
                            value={expiryPreview}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-500 cursor-not-allowed font-medium"
                        />
                        <div className="absolute right-3 top-2.5">
                            <Calendar className="h-4 w-4 text-zinc-700" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 flex gap-3 text-xs text-blue-400">
                <Info className="h-4 w-4 shrink-0" />
                <p>
                    El sistema calcula automáticamente la fecha de vencimiento basado en la duración legal de cada documento registrado.
                </p>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-400">Notas / No. de Documento</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="E.g. Poliza #1234567-8"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="flex-1"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="flex-1"
                >
                    {initialData ? 'Actualizar' : 'Registrar'} Documento
                </Button>
            </div>
        </form>
    );
};
