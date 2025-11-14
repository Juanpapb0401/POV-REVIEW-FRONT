'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import { useAuthStore } from "../store/auth/store/auth.store";
import userService from "../services/user/user.service";
import reviewService from "../services/review/review.service";
import Modal from "../components/ui/Modal";

interface Review {
    id: string;
    rating: number;
    comment: string;
    name: string;
    createdAt: string;
    movie: {
        id: string;
        title: string;
        posterUrl?: string;
    };
}

export default function MyReviewsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal state
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

    useEffect(() => {
        if (!isAuthenticated || !user) {
            router.push('/login');
            return;
        }

        fetchMyReviews();
    }, [user, isAuthenticated]);

    const fetchMyReviews = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const userData = await userService.getUserWithReviews(user.id);
            setReviews((userData as any).reviews || []);
        } catch (error: any) {
            console.error("Error al cargar reviews:", error);
            setError("Error al cargar tus reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        setModal({
            isOpen: true,
            type: 'confirm',
            title: 'Confirmar Eliminación',
            message: '¿Estás seguro de que deseas eliminar esta review? Esta acción no se puede deshacer.',
            onConfirm: async () => {
                try {
                    await reviewService.delete(reviewId);
                    setReviews(reviews.filter(review => review.id !== reviewId));
                    setModal({
                        isOpen: true,
                        type: 'success',
                        title: '¡Éxito!',
                        message: 'La review ha sido eliminada correctamente'
                    });
                } catch (error: any) {
                    console.error("Error al eliminar review:", error);
                    console.error("Detalles del error:", error.response?.data);
                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        'Error al eliminar la review. Por favor intenta nuevamente.';
                    setModal({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: errorMessage
                    });
                }
            }
        });
    };

    const handleEditReview = (movieId: string) => {
        router.push(`/movies/${movieId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-pov-primary">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="text-pov-gold text-6xl mb-4 animate-pulse">📝</div>
                        <div className="text-pov-cream text-xl">Cargando tus reviews...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pov-primary">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-pov-cream mb-2"> Mis Reviews</h1>
                    <p className="text-pov-cream/70">
                        Aquí puedes ver todas las reviews que has escrito
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Reviews count */}
                <div className="mb-6 bg-pov-dark/30 rounded-lg p-4 border border-pov-gold/20">
                    <p className="text-pov-cream">
                        <span className="text-pov-gold font-semibold">{reviews.length}</span>
                        {reviews.length === 1 ? ' review' : ' reviews'} en total
                    </p>
                </div>

                {/* Reviews list */}
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-pov-dark/30 rounded-lg border border-pov-gold/20">
                        <div className="text-pov-gold text-6xl mb-4">📭</div>
                        <p className="text-pov-cream text-xl mb-2">No has escrito ninguna review aún</p>
                        <p className="text-pov-cream/70 mb-6">¡Ve a la sección de películas y escribe tu primera review!</p>
                        <button
                            onClick={() => router.push('/movies')}
                            className="bg-pov-gold text-pov-dark px-6 py-2 rounded-lg hover:bg-pov-gold/90 transition-colors font-semibold"
                        >
                            Ver Películas
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-pov-dark/50 rounded-lg p-6 border border-pov-gold/20 hover:border-pov-gold/40 transition-all"
                            >
                                <div className="flex gap-4">
                                    {/* Movie poster */}
                                    {review.movie.posterUrl && (
                                        <div className="shrink-0">
                                            <img
                                                src={review.movie.posterUrl}
                                                alt={review.movie.title}
                                                className="w-24 h-36 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}

                                    {/* Review content */}
                                    <div className="flex-1">
                                        {/* Movie title */}
                                        <h3 className="text-xl font-bold text-pov-cream mb-2">
                                            {review.movie.title}
                                        </h3>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`text-2xl ${star <= review.rating
                                                            ? 'text-pov-gold'
                                                            : 'text-pov-cream/20'
                                                            }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-pov-cream/70">
                                                {review.rating}/5
                                            </span>
                                        </div>

                                        {/* Comment */}
                                        <p className="text-pov-cream/90 mb-4">
                                            {review.comment}
                                        </p>

                                        {/* Date */}
                                        <p className="text-sm text-pov-cream/50 mb-4">
                                            Publicada el {new Date(review.createdAt).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEditReview(review.movie.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-pov-gold/20 text-pov-gold rounded-lg hover:bg-pov-gold/30 transition-colors"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReview(review.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
