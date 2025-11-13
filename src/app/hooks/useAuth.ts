'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth';

export type UserRole = 'admin' | 'user';

export const useAuth = (requiredRole?: UserRole) => {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuthStore();

    useEffect(() => {
        // Verificar autenticación al montar
        checkAuth();
    }, [checkAuth]);

    const hasRole = (role: UserRole): boolean => {
        if (!user || !user.roles) return false;
        return user.roles.includes(role);
    };

    const isAdmin = (): boolean => {
        return hasRole('admin');
    };

    const isUser = (): boolean => {
        return hasRole('user');
    };

    const canCreateMovie = (): boolean => {
        return isAdmin();
    };

    const canEditMovie = (): boolean => {
        return isAdmin();
    };

    const canDeleteMovie = (): boolean => {
        return isAdmin();
    };

    const canViewUsers = (): boolean => {
        return isAdmin();
    };

    const canCreateReview = (): boolean => {
        return isAuthenticated;
    };

    const canEditReview = (reviewUserId: string): boolean => {
        return isAuthenticated && user?.id === reviewUserId;
    };

    const canDeleteReview = (reviewUserId: string): boolean => {
        return isAuthenticated && (user?.id === reviewUserId || isAdmin());
    };

    // Verificar si el usuario tiene el rol requerido
    useEffect(() => {
        if (requiredRole && isAuthenticated && !hasRole(requiredRole)) {
            router.push('/movies'); // Redirigir si no tiene el rol
        }
    }, [requiredRole, isAuthenticated, user, router]);

    return {
        user,
        isAuthenticated,
        isAdmin,
        isUser,
        hasRole,
        canCreateMovie,
        canEditMovie,
        canDeleteMovie,
        canViewUsers,
        canCreateReview,
        canEditReview,
        canDeleteReview,
    };
};
