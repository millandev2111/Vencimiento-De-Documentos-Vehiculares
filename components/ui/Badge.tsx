import React from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';
import type { DocumentStatus } from '@/types';

interface BadgeProps {
    status: DocumentStatus;
    className?: string;
}

export const Badge = ({ status, className = '' }: BadgeProps) => {
    const colors = STATUS_COLORS[status] || STATUS_COLORS.active;
    const label = STATUS_LABELS[status] || status;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${className}`}
            style={{
                backgroundColor: colors.bg,
                color: colors.text,
                borderColor: colors.border,
            }}
        >
            {label}
        </span>
    );
};
