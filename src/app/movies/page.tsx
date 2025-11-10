'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import movieService from "../services/movie/movie.service";
import authService from "../services/auth/auth.service";
import { Movies } from "../interfaces/movies-response.interface";
import MovieCard from "../components/movies/MovieCard";

export default function MoviesPage() {
    const router = useRouter();
    const [movies, setMovies] = useState<Movies[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const data = await movieService.getAll();
                setMovies(data);

                // Verificar si el usuario está autenticado y es admin
                // (esto es simplificado, idealmente vendría del token decodificado)
                setIsAdmin(authService.isAuthenticated());
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
        if (!confirm("¿Estás seguro de que deseas eliminar esta película?")) {
            return;
        }

        try {
            await movieService.delete(id);
            setMovies(movies.filter(movie => movie.id !== id));
        } catch (error: any) {
            console.error("Error al eliminar película:", error);
            alert("Error al eliminar la película. " + (error.response?.data?.message || ""));
        }
    };

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
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
            {/* Header/Navbar */}
            <nav className="bg-pov-dark border-b border-pov-gold/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🎬</span>
                            <h1 className="text-2xl font-bold text-pov-cream">POV Review</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/movies"
                                className="text-pov-gold hover:text-pov-gold-dark font-semibold transition"
                            >
                                Películas
                            </Link>

                            {authService.isAuthenticated() ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-pov-cream hover:text-pov-gold transition"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-pov-cream font-semibold py-2 px-4 rounded-lg transition duration-200"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header de sección */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-pov-cream mb-2">Películas</h2>
                        <p className="text-pov-gray">Explora nuestra colección de películas</p>
                    </div>

                    {isAdmin && (
                        <Link
                            href="/movies/create"
                            className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg"
                        >
                            ➕ Agregar Película
                        </Link>
                    )}
                </div>

                {/* Mensajes de error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Grid de películas */}
                {movies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {movies.map(movie => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                showActions={isAdmin}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎬</div>
                        <p className="text-pov-gray text-lg">No hay películas disponibles</p>
                        {isAdmin && (
                            <Link
                                href="/movies/create"
                                className="inline-block mt-4 bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-2 px-4 rounded-lg transition duration-200"
                            >
                                Agregar la primera película
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
