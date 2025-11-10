'use client'

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import movieService from "../../services/movie/movie.service";
import authService from "../../services/auth/auth.service";
import { Movies } from "../../interfaces/movies-response.interface";

export default function MovieDetailPage() {
    const router = useRouter();
    const params = useParams();
    const movieId = params.id as string;

    const [movie, setMovie] = useState<Movies | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const data = await movieService.getById(movieId);
                setMovie(data);
                setIsAdmin(authService.isAuthenticated());
            } catch (error: any) {
                console.error("Error al cargar película:", error);
                setError("Error al cargar la película");
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchMovie();
        }
    }, [movieId]);

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta película?")) {
            return;
        }

        try {
            await movieService.delete(movieId);
            router.push("/movies");
        } catch (error: any) {
            console.error("Error al eliminar película:", error);
            alert("Error al eliminar la película");
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-pov-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="text-pov-gold text-6xl mb-4 animate-pulse">🎬</div>
                    <div className="text-pov-cream text-xl">Cargando película...</div>
                </div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-pov-primary flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-pov-cream mb-4">
                        {error || "Película no encontrada"}
                    </h2>
                    <Link
                        href="/movies"
                        className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Volver a Películas
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pov-primary">
            {/* Navbar simple */}
            <nav className="bg-pov-dark border-b border-pov-gold/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/movies" className="flex items-center gap-3 hover:opacity-80 transition">
                            <span className="text-3xl">🎬</span>
                            <span className="text-xl font-bold text-pov-cream">POV Review</span>
                        </Link>

                        <Link
                            href="/movies"
                            className="text-pov-gold hover:text-pov-gold-dark font-semibold transition"
                        >
                            ← Volver a Películas
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-pov-secondary rounded-lg shadow-2xl overflow-hidden border border-pov-gold/10">
                    {/* Header */}
                    <div className="bg-pov-dark p-8 border-b border-pov-gold/20">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-pov-cream mb-3">
                                    {movie.title}
                                </h1>
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-pov-gold/20 text-pov-gold border border-pov-gold/30">
                                    {movie.genre}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Director */}
                            <div>
                                <h3 className="text-sm font-semibold text-pov-gold mb-2">DIRECTOR</h3>
                                <p className="text-pov-cream text-lg">{movie.director}</p>
                            </div>

                            {/* Fecha de estreno */}
                            <div>
                                <h3 className="text-sm font-semibold text-pov-gold mb-2">FECHA DE ESTRENO</h3>
                                <p className="text-pov-cream text-lg">{formatDate(movie.releaseDate)}</p>
                            </div>

                            {/* Descripción */}
                            <div>
                                <h3 className="text-sm font-semibold text-pov-gold mb-2">SINOPSIS</h3>
                                <p className="text-pov-gray text-base leading-relaxed">
                                    {movie.description}
                                </p>
                            </div>

                            {/* Metadatos */}
                            <div className="pt-6 border-t border-pov-gold/10">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-pov-gray">Creada:</span>
                                        <p className="text-pov-cream">{formatDate(movie.createdAt)}</p>
                                    </div>
                                    <div>
                                        <span className="text-pov-gray">Actualizada:</span>
                                        <p className="text-pov-cream">{formatDate(movie.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acciones (solo para admins) */}
                        {isAdmin && (
                            <div className="flex gap-4 mt-8 pt-8 border-t border-pov-gold/10">
                                <Link
                                    href={`/movies/edit/${movie.id}`}
                                    className="flex-1 bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
                                >
                                    ✏️ Editar Película
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-pov-cream font-semibold py-3 px-6 rounded-lg transition duration-200"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sección de Reviews (placeholder por ahora) */}
                <div className="mt-8 bg-pov-secondary rounded-lg shadow-xl p-8 border border-pov-gold/10">
                    <h2 className="text-2xl font-bold text-pov-cream mb-4">Reseñas</h2>
                    <p className="text-pov-gray text-center py-8">
                        Las reseñas estarán disponibles próximamente
                    </p>
                </div>
            </div>
        </div>
    );
}
