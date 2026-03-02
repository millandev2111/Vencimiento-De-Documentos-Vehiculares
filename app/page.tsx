'use client';

import React from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ExpiringAlert } from '@/components/dashboard/ExpiringAlert';
import { useVehicles } from '@/hooks/useVehicles';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/Button';
import { Plus, Car, Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getDocumentStatus } from '@/lib/utils';

export default function DashboardPage() {
  const { vehicles, isLoading } = useVehicles();
  const { expiringDocs, permission, requestPermission } = useNotifications();

  const stats = {
    totalVehicles: vehicles.length,
    totalDocuments: vehicles.reduce((acc, v) => acc + (v.documents?.length || 0), 0),
    activeDocuments: vehicles.reduce((acc, v) => acc + (v.documents?.filter(d => getDocumentStatus(d.expiry_date) === 'active').length || 0), 0),
    expiringDocuments: vehicles.reduce((acc, v) => acc + (v.documents?.filter(d => getDocumentStatus(d.expiry_date) === 'expiring').length || 0), 0),
    expiredDocuments: vehicles.reduce((acc, v) => acc + (v.documents?.filter(d => getDocumentStatus(d.expiry_date) === 'expired').length || 0), 0),
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Panel de Control</h1>
          <p className="text-zinc-500 mt-1">Gestiona el vencimiento de los documentos de tu flota.</p>
        </div>

        <div className="flex gap-3">
          <Link href="/vehicles">
            <Button variant="outline">
              <Car className="mr-2 h-4 w-4" />
              Ver Vehículos
            </Button>
          </Link>
          {permission !== 'granted' && (
            <Button onClick={requestPermission} variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/5">
              <Bell className="mr-2 h-4 w-4" />
              Activar Alertas
            </Button>
          )}
        </div>
      </header>

      <section>
        <StatsCards stats={stats} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              Alertas Urgentes (Próximos 30 días)
            </h2>
            {expiringDocs.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                {expiringDocs.length} Pendientes
              </span>
            )}
          </div>
          <ExpiringAlert documents={expiringDocs} />
        </section>
      </div>

      <section className="pt-4 border-t border-zinc-900">
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Comienza a registrar tu flota</h3>
            <p className="text-blue-200/70 max-w-md">
              Agrega tus vehículos y sus fechas de expedición. El sistema calculará automáticamente cuándo deben renovarse.
            </p>
          </div>
          <Link href="/vehicles" className="relative z-10">
            <Button variant="primary" size="lg" className="shadow-2xl shadow-blue-500/40">
              Gestionar Vehículos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 h-48 w-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
}
