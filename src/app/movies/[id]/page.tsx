'use client'

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import movieService from "../../services/movie/movie.service";
import reviewService, { Review } from "../../services/review/review.service";
import { Movies } from "../../interfaces/movies-response.interface";
import Navbar from "../../components/layout/Navbar";
import ReviewCard from "../../components/reviews/ReviewCard";
import ReviewForm from "../../components/reviews/ReviewForm";
import RoleGuard from "../../components/auth/RoleGuard";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../../components/ui/Modal";

export default function MovieDetailPage() {
    const router = useRouter();
    const params = useParams();
    const movieId = params.id as string;
    const { isAdmin, isAuthenticated, canDeleteMovie, user } = useAuth();

    const [movie, setMovie] = useState<Movies | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);

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
        const fetchData = async () => {
            try {
                setLoading(true);
                const movieData = await movieService.getById(movieId);
                setMovie(movieData);

                // Cargar reseñas
                await fetchReviews();
            } catch (error: any) {
                console.error("Error al cargar película:", error);
                setError("Error al cargar la película");
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchData();
        }
    }, [movieId]);

    const fetchReviews = async () => {
        try {
            setReviewsLoading(true);
            const reviewsData = await reviewService.getMovieReviews(movieId);
            setReviews(reviewsData);
        } catch (error: any) {
            console.error("Error al cargar reseñas:", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!canDeleteMovie()) {
            alert("No tienes permisos para eliminar películas");
            return;
        }

        const handleDeleteMovie = async () => {
            setModal({
                isOpen: true,
                type: 'confirm',
                title: 'Confirmar Eliminación',
                message: '¿Estás seguro de que deseas eliminar esta película? Se eliminarán también todas las reviews asociadas. Esta acción no se puede deshacer.',
                onConfirm: async () => {
                    try {
                        await movieService.delete(movieId);
                        setModal({
                            isOpen: true,
                            type: 'success',
                            title: '¡Éxito!',
                            message: 'Película eliminada correctamente',
                            onConfirm: () => router.push("/movies")
                        });
                    } catch (error: any) {
                        console.error("Error al eliminar película:", error);
                        setModal({
                            isOpen: true,
                            type: 'error',
                            title: 'Error',
                            message: 'Error al eliminar la película. Por favor intenta nuevamente.'
                        });
                    }
                }
            });
        };
    };

    const handleCreateReview = async (rating: number, comment: string) => {
        try {
            if (editingReview) {
                // Estamos editando una reseña existente
                await reviewService.update(editingReview.id, { rating, comment });
                setEditingReview(null);
            } else {
                // Estamos creando una nueva reseña
                await reviewService.create({ rating, comment, movieId });
            }
            await fetchReviews();
            setShowReviewForm(false);
        } catch (error: any) {
            console.error("Error al guardar reseña:", error);
            throw error;
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
                    await fetchReviews();
                    setModal({
                        isOpen: true,
                        type: 'success',
                        title: '¡Éxito!',
                        message: 'Review eliminada correctamente'
                    });
                } catch (error: any) {
                    console.error("Error al eliminar reseña:", error);
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

    const handleEditReview = (reviewId: string) => {
        const review = reviews.find(r => r.id === reviewId);
        if (review) {
            setEditingReview(review);
            setShowReviewForm(true);
        }
    };

    // Verificar si el usuario ya ha escrito una reseña
    const userReview = reviews.find(r => r.user.id === user?.id);

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
            {/* Navbar */}
            <Navbar />

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
                        <RoleGuard allowedRoles={['admin']}>
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
                        </RoleGuard>
                    </div>
                </div>

                {/* Sección de Reviews */}
                <div className="mt-8 space-y-6">
                    {/* Header de reseñas */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-pov-cream">
                            Reseñas ({reviews.length})
                        </h2>

                        {isAuthenticated && !userReview && !showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-2 px-6 rounded-lg transition duration-200"
                            >
                                ✍️ Escribir Reseña
                            </button>
                        )}
                    </div>

                    {/* Si ya tiene una reseña, mostrarla o editarla */}
                    {userReview && (
                        <div>
                            <h3 className="text-lg font-semibold text-pov-gold mb-3">Tu Reseña</h3>
                            {showReviewForm && editingReview?.id === userReview.id ? (
                                <ReviewForm
                                    movieId={movieId}
                                    onSubmit={handleCreateReview}
                                    onCancel={() => {
                                        setShowReviewForm(false);
                                        setEditingReview(null);
                                    }}
                                    initialRating={editingReview?.rating}
                                    initialComment={editingReview?.comment}
                                    isEditing={true}
                                />
                            ) : (
                                <ReviewCard
                                    review={userReview}
                                    onEdit={handleEditReview}
                                    onDelete={handleDeleteReview}
                                />
                            )}
                        </div>
                    )}

                    {/* Formulario para crear nueva reseña (solo si no tiene una) */}
                    {!userReview && showReviewForm && (
                        <ReviewForm
                            movieId={movieId}
                            onSubmit={handleCreateReview}
                            onCancel={() => {
                                setShowReviewForm(false);
                                setEditingReview(null);
                            }}
                            initialRating={undefined}
                            initialComment={undefined}
                            isEditing={false}
                        />
                    )}

                    {/* Lista de reseñas */}
                    {reviewsLoading ? (
                        <div className="text-center py-12">
                            <div className="text-pov-gold text-4xl mb-4 animate-pulse">⭐</div>
                            <div className="text-pov-gray">Cargando reseñas...</div>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div>
                            <h3 className="text-lg font-semibold text-pov-cream mb-3">
                                {userReview ? 'Otras Reseñas' : 'Todas las Reseñas'}
                            </h3>
                            <div className="space-y-4">
                                {reviews
                                    .filter(r => r.id !== userReview?.id)
                                    .map(review => (
                                        <div key={review.id}>
                                            {showReviewForm && editingReview?.id === review.id ? (
                                                <div>
                                                    <p className="text-pov-gray text-sm mb-2">
                                                        Editando reseña de: <span className="text-pov-gold font-semibold">{review.user.name}</span>
                                                    </p>
                                                    <ReviewForm
                                                        movieId={movieId}
                                                        onSubmit={handleCreateReview}
                                                        onCancel={() => {
                                                            setShowReviewForm(false);
                                                            setEditingReview(null);
                                                        }}
                                                        initialRating={editingReview?.rating}
                                                        initialComment={editingReview?.comment}
                                                        isEditing={true}
                                                    />
                                                </div>
                                            ) : (
                                                <ReviewCard
                                                    review={review}
                                                    onEdit={handleEditReview}
                                                    onDelete={handleDeleteReview}
                                                />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        !showReviewForm && (
                            <div className="bg-pov-secondary/50 rounded-lg p-12 text-center border border-pov-gold/10">
                                <div className="text-6xl mb-4">⭐</div>
                                <p className="text-pov-gray text-lg mb-4">
                                    Aún no hay reseñas para esta película
                                </p>
                                {isAuthenticated && (
                                    <button
                                        onClick={() => setShowReviewForm(true)}
                                        className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-3 px-6 rounded-lg transition duration-200"
                                    >
                                        ¡Sé el primero en reseñar!
                                    </button>
                                )}
                            </div>
                        )
                    )}
                </div>
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
