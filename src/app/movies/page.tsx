'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import movieService from "../services/movie/movie.service";
import { Movies } from "../interfaces/movies-response.interface";
import MovieCard from "../components/movies/MovieCard";
import Navbar from "../components/layout/Navbar";
import RoleGuard from "../components/auth/RoleGuard";
import { useAuth } from "../hooks/useAuth";
import Modal from "../components/ui/Modal";
import Pagination from "../components/ui/Pagination";

export default function MoviesPage() {
    const router = useRouter();
    const [movies, setMovies] = useState<Movies[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { isAdmin, canDeleteMovie } = useAuth();

    // Modal states
    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: 'info' | 'warning' | 'error' | 'success' | 'confirm';
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const totalPages = Math.ceil(movies.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMovies = movies.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const data = await movieService.getAll();
                setMovies(data);
            } catch (error: any) {
                console.error("Error al cargar películas:", error);
                setError("Error al cargar las películas");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const handleDelete = async (id: string) => {
        // Verificar permisos
        if (!canDeleteMovie()) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Permiso Denegado',
                message: 'No tienes permisos para eliminar películas'
            });
            return;
        }

        setModal({
            isOpen: true,
            type: 'confirm',
            title: 'Confirmar Eliminación',
            message: '¿Estás seguro de que deseas eliminar esta película? Esta acción no se puede deshacer.',
            onConfirm: async () => {
                try {
                    await movieService.delete(id);
                    setMovies(movies.filter(movie => movie.id !== id));
                    setModal({
                        isOpen: true,
                        type: 'success',
                        title: '¡Éxito!',
                        message: 'La película ha sido eliminada correctamente'
                    });
                } catch (error: any) {
                    console.error("Error al eliminar película:", error);
                    setModal({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Error al eliminar la película. ' + (error.response?.data?.message || 'Intenta nuevamente')
                    });
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-pov-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="text-pov-gold text-6xl mb-4 animate-pulse">🎬</div>
                    <div className="text-pov-cream text-xl">Cargando películas...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pov-primary">
            {/* Navbar component */}
            <Navbar />

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header de sección */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-pov-cream mb-2">Películas</h2>
                        <p className="text-pov-gray">Explora nuestra colección de películas</p>
                    </div>

                    <RoleGuard allowedRoles={['admin']}>
                        <Link
                            href="/movies/create"
                            className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg"
                        >
                            ➕ Agregar Película
                        </Link>
                    </RoleGuard>
                </div>

                {/* Mensajes de error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Grid de películas */}
                {movies.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentMovies.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    showActions={isAdmin()}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎬</div>
                        <p className="text-pov-gray text-lg">No hay películas disponibles</p>
                        <RoleGuard allowedRoles={['admin']}>
                            <Link
                                href="/movies/create"
                                className="inline-block mt-4 bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-2 px-4 rounded-lg transition duration-200"
                            >
                                Agregar la primera película
                            </Link>
                        </RoleGuard>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                confirmText={modal.type === 'confirm' ? 'Sí, eliminar' : 'Aceptar'}
                cancelText="Cancelar"
            />
        </div>
    );
}
