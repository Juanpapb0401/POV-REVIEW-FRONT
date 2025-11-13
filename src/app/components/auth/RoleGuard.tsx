'use client'

import { ReactNode } from 'react';
import { useAuth, UserRole } from '../../hooks/useAuth';

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: UserRole[];
    fallback?: ReactNode;
}

/**
 * Componente para mostrar contenido solo si el usuario tiene uno de los roles permitidos
 * 
 * @example
 * // Solo mostrar para admin
 * <RoleGuard allowedRoles={['admin']}>
 *   <button>Eliminar película</button>
 * </RoleGuard>
 * 
 * // Mostrar para admin o user
 * <RoleGuard allowedRoles={['admin', 'user']}>
 *   <button>Crear reseña</button>
 * </RoleGuard>
 */
export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
    const { hasRole, isAuthenticated } = useAuth();

    // Si no está autenticado, no mostrar nada
    if (!isAuthenticated) {
        return <>{fallback}</>;
    }

    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasPermission = allowedRoles.some(role => hasRole(role));

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
