import { useState, useEffect, useCallback } from 'react';
import type { Vehicle, CreateVehicleDto } from '@/types';
import toast from 'react-hot-toast';

export const useVehicles = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVehicles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/vehicles');
            if (!response.ok) throw new Error('Error al cargar vehículos');
            const data = await response.json();
            setVehicles(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addVehicle = async (dto: CreateVehicleDto) => {
        try {
            const response = await fetch('/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto),
            });
            if (!response.ok) throw new Error('Error al crear vehículo');
            const newVehicle = await response.json();
            setVehicles((prev) => [newVehicle, ...prev]);
            toast.success('Vehículo creado con éxito');
            return newVehicle;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    const deleteVehicle = async (id: string) => {
        try {
            const response = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar vehículo');
            setVehicles((prev) => prev.filter((v) => v.id !== id));
            toast.success('Vehículo eliminado');
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    return {
        vehicles,
        isLoading,
        error,
        refresh: fetchVehicles,
        addVehicle,
        deleteVehicle,
    };
};
