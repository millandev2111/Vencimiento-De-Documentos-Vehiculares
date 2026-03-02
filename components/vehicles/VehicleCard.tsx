'use client';

import React from 'react';
import type { Vehicle } from '@/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChevronRight, Calendar, User, FileText } from 'lucide-react';
import Link from 'next/link';
import { getDocumentStatus } from '@/lib/utils';

interface VehicleCardProps {
    vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
    const expiredCount = vehicle.documents?.filter(d => getDocumentStatus(d.expiry_date) === 'expired').length || 0;
    const expiringCount = vehicle.documents?.filter(d => getDocumentStatus(d.expiry_date) === 'expiring').length || 0;

    return (
        <Link href={`/vehicles/${vehicle.id}`}>
            <Card className="group relative overflow-hidden h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-bold text-white tracking-wider group-hover:text-blue-400 transition-colors">
                                {vehicle.plate}
                            </h3>
                            <div className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                            <span className="text-zinc-500 font-medium text-sm">
                                {vehicle.year}
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm font-medium uppercase tracking-tight">
                            {vehicle.brand} {vehicle.model}
                        </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="space-y-3 mt-auto pt-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate">{vehicle.owner || 'Sin propietario'}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {expiredCount > 0 && (
                            <Badge status="expired" className="animate-pulse" />
                        )}
                        {expiringCount > 0 && (
                            <Badge status="expiring" />
                        )}
                        {expiredCount === 0 && expiringCount === 0 && (
                            <Badge status="active" />
                        )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-600 font-medium uppercase tracking-wider mt-2">
                        <div className="flex items-center gap-1.5">
                            <FileText className="h-3 w-3" />
                            <span>{vehicle.documents?.length || 0} Docs</span>
                        </div>
                    </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all" />
            </Card>
        </Link>
    );
};
