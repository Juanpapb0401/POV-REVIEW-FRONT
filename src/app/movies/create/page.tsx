'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import movieService from "../../services/movie/movie.service";
import authService from "../../services/auth/auth.service";
import MovieForm, { MovieFormData } from "../../components/movies/MovieForm";

export default function CreateMoviePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar autenticación al cargar la página
        if (!authService.isAuthenticated()) {
            router.push("/login");
            return;
        }
        setLoading(false);
    }, [router]);

    const handleSubmit = async (data: MovieFormData) => {
        try {
            const newMovie = await movieService.create(data);
            console.log("Película creada:", newMovie);

            // Redirigir al detalle de la película creada
            router.push(`/movies/${newMovie.id}`);
        } catch (error) {
            // El error se maneja en el componente MovieForm
            throw error;
        }
    };

    const handleCancel = () => {
        router.push("/movies");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-pov-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="text-pov-gold text-6xl mb-4 animate-pulse">🎬</div>
                    <div className="text-pov-cream text-xl">Cargando...</div>
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
                            href="/movies"
                            className="text-pov-gold hover:text-pov-gold-dark font-semibold transition"
                        >
                            ← Volver a Películas
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
                            <span className="text-4xl">🎬</span>
                            <div>
                                <h1 className="text-3xl font-bold text-pov-cream">Agregar Nueva Película</h1>
                                <p className="text-pov-gray mt-1">Completa el formulario para agregar una película</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        <MovieForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isEditing={false}
                        />
                    </div>
                </div>

                {/* Ayuda */}
                <div className="mt-6 p-4 bg-pov-secondary/50 rounded-lg border border-pov-gold/20">
                    <p className="text-pov-gray text-sm text-center">
                        💡 <strong className="text-pov-gold">Tip:</strong> Asegúrate de llenar todos los campos correctamente antes de guardar.
                    </p>
                </div>
            </div>
        </div>
    );
}
