'use client';

import React, { useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { VehicleList } from '@/components/vehicles/VehicleList';
import { VehicleForm } from '@/components/vehicles/VehicleForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Plus, Car, Search, Loader2 } from 'lucide-react';

export default function VehiclesPage() {
    const { vehicles, isLoading, addVehicle } = useVehicles();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVehicles = vehicles.filter((v) =>
        v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-slide-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Mi Flota</h1>
                    <p className="text-zinc-500 mt-1">Listado de vehículos registrados en el sistema.</p>
                </div>

                <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-blue-500/20">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Vehículo
                </Button>
            </header>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar vehículo por placa, marca o modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
            </div>

            <section>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="text-zinc-500 font-medium">Cargando flota...</p>
                    </div>
                ) : (
                    <VehicleList vehicles={filteredVehicles} />
                )}
            </section>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Registrar Nuevo Vehículo"
            >
                <VehicleForm
                    onCancel={() => setIsModalOpen(false)}
                    onSubmit={async (data) => {
                        await addVehicle(data);
                        setIsModalOpen(false);
                    }}
                />
            </Modal>
        </div>
    );
}
