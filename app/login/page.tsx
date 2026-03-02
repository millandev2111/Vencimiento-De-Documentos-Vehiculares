'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Shield, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión. Verifica tu email y contraseña.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black overflow-hidden relative">
            {/* Decorative background glass elements */}
            <div className="absolute top-1/4 -left-20 h-96 w-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 h-96 w-96 bg-indigo-600/10 rounded-full blur-[120px]" />

            <Card className="max-w-md w-full p-8 space-y-8 bg-zinc-900/40 backdrop-blur-xl border-zinc-800/50 shadow-2xl relative z-10 animate-slide-up">
                <div className="text-center space-y-2">
                    <div className="h-16 w-16 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Acceso Privado</h1>
                    <p className="text-zinc-500 text-sm">Gestiona el vencimiento de tus documentos vehiculares</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in zoom-in duration-300">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1" htmlFor="password">
                            Contraseña
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full shadow-lg shadow-blue-500/20 py-4"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin mx-auto text-white" />
                        ) : (
                            'Ingresar al Sistema'
                        )}
                    </Button>
                </form>

                <p className="text-[11px] text-zinc-600 text-center uppercase tracking-tighter">
                    Seguridad administrada por Supabase Auth
                </p>
            </Card>

            {/* Footer info */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-zinc-700 text-[10px] uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Sistema de Gestión de Documentos
                </p>
            </div>
        </div>
    );
}
