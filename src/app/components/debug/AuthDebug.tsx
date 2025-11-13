'use client'

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth';

export default function AuthDebug() {
    const [mounted, setMounted] = useState(false);
    const { user, isAuthenticated, token } = useAuthStore();

    useEffect(() => {
        setMounted(true);

        // Verificar localStorage
        const localStorageData = localStorage.getItem('auth-storage');
        console.log('=== AUTH DEBUG ===');
        console.log('LocalStorage raw:', localStorageData);
        console.log('Zustand User:', user);
        console.log('Zustand isAuthenticated:', isAuthenticated);
        console.log('Zustand token:', token);
    }, [user, isAuthenticated, token]);

    if (!mounted) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md z-50">
            <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
            <div className="space-y-1">
                <p><strong>isAuthenticated:</strong> {isAuthenticated ? '✅ true' : '❌ false'}</p>
                <p><strong>user:</strong> {user ? JSON.stringify(user) : '❌ null'}</p>
                <p><strong>token:</strong> {token ? '✅ exists' : '❌ null'}</p>
                <p><strong>roles:</strong> {user?.roles?.join(', ') || '❌ none'}</p>
            </div>
        </div>
    );
}
