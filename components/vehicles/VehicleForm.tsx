'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import type { CreateVehicleDto, Vehicle } from '@/types';

interface VehicleFormProps {
    onSubmit: (data: CreateVehicleDto) => Promise<void>;
    initialData?: Vehicle | null;
    onCancel: () => void;
}

export const VehicleForm = ({ onSubmit, initialData, onCancel }: VehicleFormProps) => {
    const [formData, setFormData] = useState<CreateVehicleDto>({
        plate: initialData?.plate || '',
        brand: initialData?.brand || '',
        model: initialData?.model || '',
        year: initialData?.year || new Date().getFullYear(),
        owner: initialData?.owner || '',
        notes: initialData?.notes || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'year' ? parseInt(value) || 0 : value
        }));
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
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Placa</label>
                    <input
                        required
                        name="plate"
                        value={formData.plate}
                        onChange={handleChange}
                        placeholder="ABC123"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Año</label>
                    <input
                        required
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Marca</label>
                    <input
                        required
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="E.g. Chevrolet"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Modelo</label>
                    <input
                        required
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="E.g. Onix"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-400">Propietario</label>
                <input
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    placeholder="Nombre del propietario"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-400">Notas</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Información adicional..."
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
                    {initialData ? 'Actualizar' : 'Guardar'} Vehículo
                </Button>
            </div>
        </form>
    );
};
