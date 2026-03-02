'use client';

import React, { useState, useEffect, use } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentTable } from '@/components/documents/DocumentTable';
import { DocumentForm } from '@/components/documents/DocumentForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    Plus,
    ChevronLeft,
    Car,
    User,
    FileText,
    ArrowLeft,
    Calendar,
    Hash,
    AlertCircle,
    Info
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDocumentStatus } from '@/lib/utils';

interface VehicleDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { vehicles, deleteVehicle, isLoading: isVehiclesLoading } = useVehicles();
    const { documents, documentTypes, addDocument, deleteDocument, isLoading: isDocsLoading } = useDocuments(id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const vehicle = vehicles.find((v) => v.id === id);

    if (isVehiclesLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 animate-pulse">
                <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-zinc-800 animate-spin" />
                <p className="text-zinc-500">Cargando detalles del vehículo...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="text-center py-20 animate-slide-up">
                <AlertCircle className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Vehículo no encontrado</h2>
                <p className="text-zinc-500 mb-6 text-sm">El vehículo que buscas no existe o ha sido eliminado.</p>
                <Link href="/vehicles">
                    <Button variant="primary">Volver a Vehículos</Button>
                </Link>
            </div>
        );
    }

    const handleDelete = async () => {
        if (confirm('¿Estás seguro de que deseas eliminar este vehículo y todos sus documentos?')) {
            await deleteVehicle(id);
            router.push('/vehicles');
        }
    };

    return (
        <div className="space-y-8 animate-slide-up pb-10">
            <header className="flex flex-col gap-6">
                <Link
                    href="/vehicles"
                    className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs uppercase tracking-widest font-bold">Volver a Flota</span>
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-500 shadow-xl">
                            <Car className="h-8 w-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-4xl font-extrabold text-white tracking-widest uppercase">
                                    {vehicle.plate}
                                </h1>
                                <span className="text-zinc-500 font-medium text-lg pt-1">
                                    / {vehicle.year}
                                </span>
                            </div>
                            <p className="text-zinc-400 font-medium uppercase tracking-tighter mt-0.5">
                                {vehicle.brand} {vehicle.model}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={handleDelete} className="text-zinc-500 hover:text-red-500">
                            Eliminar
                        </Button>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Registrar Documento
                        </Button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 h-fit bg-gradient-to-b from-zinc-900/80 to-zinc-900/40">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-500" />
                            Especificaciones
                        </h3>
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-zinc-600" />
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Propietario</p>
                                    <p className="text-sm text-zinc-200">{vehicle.owner || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-zinc-600" />
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Año Modelo</p>
                                    <p className="text-sm text-zinc-200">{vehicle.year}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 pt-2">
                                <FileText className="h-4 w-4 text-zinc-600 mt-1" />
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Notas</p>
                                    <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                                        {vehicle.notes || 'No hay notas registradas para este vehículo.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-2">Urgencia</h3>
                            <p className="text-zinc-500 text-xs mb-4">Estado general del vehículo</p>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-400">Vencidos</span>
                                    <span className="text-red-400 font-bold">{documents.filter(d => getDocumentStatus(d.expiry_date) === 'expired').length}</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500"
                                        style={{ width: `${(documents.filter(d => getDocumentStatus(d.expiry_date) === 'expired').length / (documents.length || 1)) * 100}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs mt-1">
                                    <span className="text-zinc-400">Por Vencer</span>
                                    <span className="text-amber-400 font-bold">{documents.filter(d => getDocumentStatus(d.expiry_date) === 'expiring').length}</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500"
                                        style={{ width: `${(documents.filter(d => getDocumentStatus(d.expiry_date) === 'expiring').length / (documents.length || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-8 -right-8 h-32 w-32 bg-blue-600/5 rounded-full blur-3xl" />
                    </Card>
                </div>

                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Historial de Documentos</h2>
                        <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            {documents.length} Registros
                        </div>
                    </div>

                    <div className="glass rounded-3xl overflow-hidden p-1 shadow-2xl">
                        <DocumentTable
                            documents={documents}
                            onDelete={deleteDocument}
                        />
                    </div>
                </section>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Registrar Documento"
            >
                <DocumentForm
                    vehicleId={id}
                    documentTypes={documentTypes}
                    onCancel={() => setIsModalOpen(false)}
                    onSubmit={async (data) => {
                        await addDocument(data);
                        setIsModalOpen(false);
                    }}
                />
            </Modal>
        </div>
    );
}
