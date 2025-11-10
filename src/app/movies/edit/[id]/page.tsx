'use client'

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import movieService from "../../../services/movie/movie.service";
import authService from "../../../services/auth/auth.service";
import MovieForm, { MovieFormData } from "../../../components/movies/MovieForm";
import { Movies } from "../../../interfaces/movies-response.interface";

export default function EditMoviePage() {
    const router = useRouter();
    const params = useParams();
    const movieId = params.id as string;

    const [movie, setMovie] = useState<Movies | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
            router.push("/login");
            return;
        }

        const fetchMovie = async () => {
            try {
                setLoading(true);
                const data = await movieService.getById(movieId);
                setMovie(data);
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
    }, [movieId, router]);

    const handleSubmit = async (data: MovieFormData) => {
        try {
            const updatedMovie = await movieService.update(movieId, data);
            console.log("Película actualizada:", updatedMovie);

            // Redirigir al detalle de la película
            router.push(`/movies/${movieId}`);
        } catch (error) {
            // El error se maneja en el componente MovieForm
            throw error;
        }
    };

    const handleCancel = () => {
        router.push(`/movies/${movieId}`);
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
            {/* Navbar */}
            <nav className="bg-pov-dark border-b border-pov-gold/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/movies" className="flex items-center gap-3 hover:opacity-80 transition">
                            <span className="text-3xl">🎬</span>
                            <span className="text-xl font-bold text-pov-cream">POV Review</span>
                        </Link>

                        <Link
                            href={`/movies/${movieId}`}
                            className="text-pov-gold hover:text-pov-gold-dark font-semibold transition"
                        >
                            ← Volver al Detalle
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-pov-secondary rounded-lg shadow-2xl overflow-hidden border border-pov-gold/10">
                    {/* Header */}
                    <div className="bg-pov-dark p-6 border-b border-pov-gold/20">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">✏️</span>
                            <div>
                                <h1 className="text-3xl font-bold text-pov-cream">Editar Película</h1>
                                <p className="text-pov-gray mt-1">Actualiza la información de "{movie.title}"</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        <MovieForm
                            movie={movie}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isEditing={true}
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-pov-secondary/50 rounded-lg border border-pov-gold/20">
                    <p className="text-pov-gray text-sm text-center">
                        ⚠️ Los cambios que realices se guardarán permanentemente en la base de datos.
                    </p>
                </div>
            </div>
        </div>
    );
}
