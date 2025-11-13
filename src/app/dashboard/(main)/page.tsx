'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userService from "../../services/user/user.service";
import { Users } from "../../interfaces/users-response.interface";
import Navbar from "../../components/layout/Navbar";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";

export default function MainPage() {
    const router = useRouter();
    const [users, setUsers] = useState<Users[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { isAdmin, user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll(50, 1);
            setUsers(data);
        } catch (error: any) {
            console.error("Error al cargar usuarios:", error);

            // Si es error 403, el usuario no tiene permisos de admin
            if (error.response?.status === 403) {
                setError("No tienes permisos de administrador para ver esta sección.");
            } else {
                setError("Error al cargar los usuarios");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        // No permitir que el admin se elimine a sí mismo
        if (currentUser?.id === userId) {
            setError("No puedes eliminar tu propia cuenta");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (!confirm(`¿Estás seguro de que deseas eliminar al usuario "${userName}"?`)) {
            return;
        }

        try {
            await userService.delete(userId);
            setUsers(users.filter(u => u.id !== userId));
            setSuccessMessage(`Usuario "${userName}" eliminado exitosamente`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error: any) {
            console.error("Error al eliminar usuario:", error);
            setError(error.response?.data?.message || "Error al eliminar el usuario");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleToggleRole = async (userId: string, currentRoles: string[]) => {
        // No permitir que el admin cambie su propio rol
        if (currentUser?.id === userId) {
            setError("No puedes cambiar tu propio rol");
            setTimeout(() => setError(""), 3000);
            return;
        }

        try {
            // Alternar entre 'user' y 'admin'
            const newRoles = currentRoles.includes('admin') ? ['user'] : ['admin'];

            await userService.updateRoles(userId, newRoles);

            // Actualizar el estado local
            setUsers(users.map(u =>
                u.id === userId ? { ...u, roles: newRoles } : u
            ));

            setSuccessMessage(`Rol actualizado exitosamente`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error: any) {
            console.error("Error al actualizar rol:", error);
            setError(error.response?.data?.message || "Error al actualizar el rol");
            setTimeout(() => setError(""), 3000);
        }
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
        <ProtectedRoute requiredRole="admin">
            <div className="min-h-screen bg-pov-primary">
                <Navbar />

                <div className="max-w-7xl mx-auto p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-pov-cream mb-2">Panel de Administración</h1>
                                <p className="text-pov-gray">Gestiona los usuarios de la plataforma</p>
                            </div>
                            <div className="bg-pov-secondary rounded-lg p-4 border border-pov-gold/20">
                                <p className="text-pov-gray text-sm">Total de usuarios</p>
                                <p className="text-3xl font-bold text-pov-gold">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    {!isAdmin() ? (
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

                            {successMessage && (
                                <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4">
                                    {successMessage}
                                </div>
                            )}

                            {/* Estadísticas rápidas */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-pov-secondary rounded-lg p-6 border border-pov-gold/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-pov-gray text-sm mb-1">Administradores</p>
                                            <p className="text-2xl font-bold text-pov-gold">
                                                {users.filter(u => u.roles.includes('admin')).length}
                                            </p>
                                        </div>
                                        <div className="text-4xl">👑</div>
                                    </div>
                                </div>

                                <div className="bg-pov-secondary rounded-lg p-6 border border-pov-gold/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-pov-gray text-sm mb-1">Usuarios Regulares</p>
                                            <p className="text-2xl font-bold text-blue-400">
                                                {users.filter(u => !u.roles.includes('admin')).length}
                                            </p>
                                        </div>
                                        <div className="text-4xl">👤</div>
                                    </div>
                                </div>

                                <div className="bg-pov-secondary rounded-lg p-6 border border-pov-gold/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-pov-gray text-sm mb-1">Usuarios Activos</p>
                                            <p className="text-2xl font-bold text-green-400">
                                                {users.filter(u => u.isActive).length}
                                            </p>
                                        </div>
                                        <div className="text-4xl">✓</div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de usuarios */}
                            <div className="bg-pov-secondary rounded-lg shadow-xl overflow-hidden border border-pov-gold/10">
                                <div className="px-6 py-4 border-b border-pov-gold/20 bg-pov-dark flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-pov-cream">Lista de Usuarios</h2>
                                    <div className="text-sm text-pov-gray">
                                        💡 Tip: Haz clic en los botones para cambiar roles o eliminar usuarios
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-pov-dark">
                                            <tr>
                                                <th className="px-6 py-4 text-pov-gray font-semibold">Nombre</th>
                                                <th className="px-6 py-4 text-pov-gray font-semibold">Email</th>
                                                <th className="px-6 py-4 text-pov-gray font-semibold">Rol</th>
                                                <th className="px-6 py-4 text-pov-gray font-semibold">Estado</th>
                                                <th className="px-6 py-4 text-pov-gray font-semibold text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-pov-dark">
                                            {users && users.length > 0 ? (
                                                users.map(user => {
                                                    const isCurrentUser = currentUser?.id === user.id;
                                                    const isUserAdmin = user.roles.includes('admin');

                                                    return (
                                                        <tr key={user.id} className="hover:bg-pov-dark/50 transition">
                                                            <td className="px-6 py-4 text-pov-cream">
                                                                {user.name}
                                                                {isCurrentUser && (
                                                                    <span className="ml-2 text-xs text-pov-gold">(Tú)</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-pov-gray">{user.email}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${isUserAdmin
                                                                        ? 'bg-pov-gold/20 text-pov-gold border-pov-gold/30'
                                                                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                                    }`}>
                                                                    {isUserAdmin ? 'ADMIN' : 'USER'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isActive
                                                                        ? 'bg-green-500/20 text-green-400'
                                                                        : 'bg-red-500/20 text-red-400'
                                                                    }`}>
                                                                    {user.isActive ? '✓ Activo' : '✗ Inactivo'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    {!isCurrentUser && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleToggleRole(user.id, user.roles)}
                                                                                className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-1 px-3 rounded text-xs transition duration-200"
                                                                                title={isUserAdmin ? 'Quitar admin' : 'Hacer admin'}
                                                                            >
                                                                                {isUserAdmin ? '👤 User' : '👑 Admin'}
                                                                            </button>

                                                                            <button
                                                                                onClick={() => handleDeleteUser(user.id, user.name)}
                                                                                className="bg-red-600 hover:bg-red-700 text-pov-cream font-semibold py-1 px-3 rounded text-xs transition duration-200"
                                                                                title="Eliminar usuario"
                                                                            >
                                                                                🗑️
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {isCurrentUser && (
                                                                        <span className="text-xs text-pov-gray italic">
                                                                            Sin acciones
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-pov-gray">
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
        </ProtectedRoute>
    );
}