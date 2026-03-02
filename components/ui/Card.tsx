import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const Card = ({ children, className = '', onClick, style }: CardProps) => {
    return (
        <div
            onClick={onClick}
            style={style}
            className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 shadow-sm ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </div>
    );
};
