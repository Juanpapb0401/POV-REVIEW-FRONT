'use client'

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: UserRole;
    redirectTo?: string;
}

/**
 * Componente para proteger rutas completas
 * Redirige al usuario si no está autenticado o no tiene el rol requerido
 * 
 * @example
 * // Proteger una ruta solo para admins
 * <ProtectedRoute requiredRole="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 * 
 * // Proteger una ruta para cualquier usuario autenticado
 * <ProtectedRoute>
 *   <UserProfile />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({
    children,
    requiredRole,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, hasRole } = useAuth();

    useEffect(() => {

        // Si no está autenticado, redirigir al login
        if (!isAuthenticated) {
            router.push(redirectTo);
            return;
        }

        // Si requiere un rol específico y no lo tiene, redirigir a películas
        if (requiredRole && !hasRole(requiredRole)) {
            router.push('/movies');
            return;
        }
    }, [isAuthenticated, requiredRole, hasRole, router, redirectTo]);

    // Mostrar loading mientras verifica
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-pov-primary">
                <div className="text-center">
                    <div className="text-pov-gold text-6xl mb-4 animate-pulse">🎬</div>
                    <div className="text-pov-cream text-xl">Verificando permisos...</div>
                </div>
            </div>
        );
    }

    // Si requiere un rol y no lo tiene, mostrar mensaje
    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-pov-primary">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold text-pov-cream mb-3">Acceso Denegado</h2>
                    <p className="text-pov-gray">No tienes permisos para acceder a esta página.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
