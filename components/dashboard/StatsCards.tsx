'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Car, FileCheck, AlertTriangle, XCircle, Files } from 'lucide-react';
import type { DashboardStats } from '@/types';

interface StatsCardsProps {
    stats: DashboardStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
    const items = [
        {
            label: 'Total Vehículos',
            value: stats.totalVehicles,
            icon: Car,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            label: 'Docs. Totales',
            value: stats.totalDocuments,
            icon: Files,
            color: 'text-zinc-500',
            bg: 'bg-zinc-500/10',
        },
        {
            label: 'Vigentes',
            value: stats.activeDocuments,
            icon: FileCheck,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
        },
        {
            label: 'Por Vencer',
            value: stats.expiringDocuments,
            icon: AlertTriangle,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
        },
        {
            label: 'Vencidos',
            value: stats.expiredDocuments,
            icon: XCircle,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <Card key={item.label} className="p-4 flex flex-col items-center justify-center text-center">
                        <div className={`${item.bg} p-2.5 rounded-xl mb-3`}>
                            <Icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-white mb-0.5">{item.value}</p>
                        <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest leading-none">
                            {item.label}
                        </p>
                    </Card>
                );
            })}
        </div>
    );
};
