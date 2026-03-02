'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Car, Bell, BellOff, LogOut, User as UserIcon } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from './ui/Button';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { permission, requestPermission, expiringDocs } = useNotifications();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    if (pathname === '/login') return null;

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Vehículos', href: '/vehicles', icon: Car },
    ];

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
                                <Bell className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight hidden sm:block">
                                DocGuard
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'text-blue-500 bg-blue-500/10'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Link href="/" className="p-2 text-zinc-400 hover:text-white transition-colors block">
                                <Bell className="h-5 w-5" />
                                {expiringDocs.length > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {expiringDocs.length}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {permission !== 'granted' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={requestPermission}
                                className="hidden sm:flex"
                            >
                                <BellOff className="mr-2 h-4 w-4" />
                                Notificar
                            </Button>
                        )}

                        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                            <div className="hidden lg:block text-right">
                                <p className="text-[10px] font-bold text-white leading-none truncate max-w-[120px]">
                                    {user?.email?.split('@')[0]}
                                </p>
                                <p className="text-[9px] text-zinc-500 font-medium">Conectado</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                                className="text-zinc-500 hover:text-red-400 !p-2"
                                title="Cerrar Sesión"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
