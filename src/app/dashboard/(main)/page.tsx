'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userService from "../../services/user/user.service";
import authService from "../../services/auth/auth.service";
import { Users } from "../../interfaces/users-response.interface";

export default function MainPage() {
    const router = useRouter();
    const [users, setUsers] = useState<Users[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState(true);

    useEffect(() => {
        // Verificar si está autenticado
        if (!authService.isAuthenticated()) {
            router.push("/login");
            return;
        }

        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await userService.getAll(4, 1);
                setUsers(data);
                setIsAdmin(true);
            } catch (error: any) {
                console.error("Error al cargar usuarios:", error);

                // Si es error 401, redirigir al login
                if (error.response?.status === 401) {
                    authService.logout();
                    router.push("/login");
                    return;
                }

                // Si es error 403, el usuario no tiene permisos de admin
                if (error.response?.status === 403) {
                    setIsAdmin(false);
                    setError("No tienes permisos de administrador para ver esta sección.");
                } else {
                    setError("Error al cargar los usuarios");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [router]);

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-pov-primary">
                <div className="text-center">
                    <div className="text-pov-gold text-6xl mb-4 animate-pulse">🎬</div>
                    <div className="text-pov-cream text-xl">Cargando...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pov-primary p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header con botón de logout */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🎬</span>
                        <h1 className="text-3xl font-bold text-pov-cream">Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-pov-cream font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-lg"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {!isAdmin ? (
                    // Mensaje para usuarios sin permisos de admin
                    <div className="bg-pov-secondary rounded-lg shadow-xl p-12 text-center border border-pov-gold/20">
                        <div className="mb-6">
                            <svg className="mx-auto h-16 w-16 text-pov-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-pov-cream mb-3">Acceso Restringido</h2>
                        <p className="text-pov-gray mb-6">
                            No tienes permisos de administrador para acceder a esta sección.
                        </p>
                        <div className="bg-pov-gold/10 border border-pov-gold/30 rounded-lg p-4">
                            <p className="text-pov-gold text-sm font-semibold">
                                ✓ Has iniciado sesión correctamente como usuario regular.
                            </p>
                            <p className="text-pov-gray text-sm mt-2">
                                Solo los administradores pueden ver la lista de usuarios.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        {/* Tabla de usuarios */}
                        <div className="bg-pov-secondary rounded-lg shadow-xl overflow-hidden border border-pov-gold/10">
                            <div className="px-6 py-4 border-b border-pov-gold/20 bg-pov-dark">
                                <h2 className="text-xl font-semibold text-pov-cream">Lista de Usuarios</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-pov-dark">
                                        <tr>
                                            <th className="px-6 py-4 text-pov-gray font-semibold">Nombre</th>
                                            <th className="px-6 py-4 text-pov-gray font-semibold">Email</th>
                                            <th className="px-6 py-4 text-pov-gray font-semibold">Rol</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-pov-dark">
                                        {users && users.length > 0 ? (
                                            users.map(user => (
                                                <tr key={user.id} className="hover:bg-pov-dark/50 transition">
                                                    <td className="px-6 py-4 text-pov-cream">{user.name}</td>
                                                    <td className="px-6 py-4 text-pov-gray">{user.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pov-gold/20 text-pov-gold border border-pov-gold/30">
                                                            {user.roles}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-pov-gray">
                                                    No hay usuarios disponibles
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}