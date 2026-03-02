import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-6">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <Button variant="ghost" size="sm" onClick={onClose} className="!p-1">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="max-height-[calc(100vh-12rem)] overflow-y-auto p-4 sm:p-6 text-zinc-300">
                    {children}
                </div>
            </div>
        </div>
    );
};
