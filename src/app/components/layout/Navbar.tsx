'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth';
import RoleGuard from '../auth/RoleGuard';

export default function Navbar() {
    const router = useRouter();
    // Usar directamente el store de Zustand
    const { user, isAuthenticated, logout } = useAuthStore();

    // Verificar si es admin directamente
    const isUserAdmin = user?.roles?.includes('admin') || false;

    const handleLogout = () => {
        logout();
        router.push('/');
        router.refresh();
    };

    return (
        <nav className="bg-pov-dark/80 backdrop-blur-sm border-b border-pov-gold/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                        <span className="text-4xl">🎬</span>
                        <h1 className="text-2xl font-bold text-pov-cream">POV Review</h1>
                    </Link>

                    {/* Links de navegación */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/movies"
                            className="text-pov-cream hover:text-pov-gold transition font-medium"
                        >
                            Películas
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {/* Opciones para usuarios autenticados */}
                                <Link
                                    href="/my-reviews"
                                    className="text-pov-cream hover:text-pov-gold transition font-medium flex items-center gap-2"
                                >
                                    <span>Mis Reviews</span>
                                </Link>

                                <RoleGuard allowedRoles={['admin']}>
                                    <Link
                                        href="/dashboard"
                                        className="text-pov-cream hover:text-pov-gold transition font-medium flex items-center gap-2"
                                    >
                                        <span>👥</span>
                                        <span>Usuarios</span>
                                    </Link>
                                </RoleGuard>

                                {/* Perfil de usuario */}
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-pov-cream text-sm font-medium">{user?.name}</p>
                                        {isUserAdmin && (
                                            <p className="text-pov-gold text-xs font-semibold">ADMIN</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-pov-cream font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-lg"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Opciones para usuarios no autenticados */}
                                <Link
                                    href="/login"
                                    className="text-pov-cream hover:text-pov-gold transition font-medium"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
