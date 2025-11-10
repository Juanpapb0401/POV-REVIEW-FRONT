import Link from "next/link";
import { Movies } from "../../interfaces/movies-response.interface";

interface MovieCardProps {
    movie: Movies;
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

export default function MovieCard({ movie, onDelete, showActions = false }: MovieCardProps) {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-pov-secondary rounded-lg shadow-lg overflow-hidden border border-pov-gold/10 hover:border-pov-gold/30 transition-all duration-300">
            <div className="p-6">
                {/* Título y Género */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-pov-cream hover:text-pov-gold transition">
                        <Link href={`/movies/${movie.id}`}>
                            {movie.title}
                        </Link>
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pov-gold/20 text-pov-gold border border-pov-gold/30 whitespace-nowrap ml-2">
                        {movie.genre}
                    </span>
                </div>

                {/* Director */}
                <p className="text-pov-gray text-sm mb-2">
                    <span className="text-pov-gold">Director:</span> {movie.director}
                </p>

                {/* Fecha */}
                <p className="text-pov-gray text-sm mb-3">
                    <span className="text-pov-gold">Estreno:</span> {formatDate(movie.releaseDate)}
                </p>

                {/* Descripción */}
                <p className="text-pov-gray text-sm line-clamp-3 mb-4">
                    {movie.description}
                </p>

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t border-pov-gold/10">
                    <Link
                        href={`/movies/${movie.id}`}
                        className="flex-1 bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-2 px-4 rounded-lg transition duration-200 text-center text-sm"
                    >
                        Ver Detalles
                    </Link>

                    {showActions && (
                        <>
                            <Link
                                href={`/movies/edit/${movie.id}`}
                                className="bg-pov-dark hover:bg-pov-primary text-pov-cream font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                            >
                                ✏️
                            </Link>

                            {onDelete && (
                                <button
                                    onClick={() => onDelete(movie.id)}
                                    className="bg-red-600 hover:bg-red-700 text-pov-cream font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                                >
                                    🗑️
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
