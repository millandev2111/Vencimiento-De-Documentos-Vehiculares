'use client';

import React from 'react';
import { VehicleCard } from './VehicleCard';
import type { Vehicle } from '@/types';
import { Car, Search } from 'lucide-react';

interface VehicleListProps {
    vehicles: Vehicle[];
}

export const VehicleList = ({ vehicles }: VehicleListProps) => {
    if (vehicles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass rounded-3xl">
                <div className="bg-zinc-800 p-4 rounded-2xl mb-4 border border-zinc-700">
                    <Car className="h-10 w-10 text-zinc-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No hay vehículos registrados</h3>
                <p className="text-zinc-400 max-w-xs">
                    Comienza agregando tu primer vehículo para gestionar sus documentos.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
        </div>
    );
};
