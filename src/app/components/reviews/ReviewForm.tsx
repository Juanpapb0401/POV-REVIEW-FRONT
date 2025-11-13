'use client'

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ReviewFormProps {
    movieId: string;
    onSubmit: (rating: number, comment: string) => Promise<void>;
    onCancel?: () => void;
    initialRating?: number;
    initialComment?: string;
    isEditing?: boolean;
}

export default function ReviewForm({
    movieId,
    onSubmit,
    onCancel,
    initialRating = 0,
    initialComment = '',
    isEditing = false
}: ReviewFormProps) {
    const { isAuthenticated } = useAuth();
    const [rating, setRating] = useState(initialRating);
    const [comment, setComment] = useState(initialComment);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isAuthenticated) {
        return (
            <div className="bg-pov-secondary/50 rounded-lg p-6 text-center border border-pov-gold/10">
                <p className="text-pov-gray mb-4">Debes iniciar sesión para escribir una reseña</p>
                <a
                    href="/login"
                    className="inline-block bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                    Iniciar Sesión
                </a>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Por favor selecciona una calificación');
            return;
        }

        if (comment.trim().length < 10) {
            setError('El comentario debe tener al menos 10 caracteres');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(rating, comment);

            // Limpiar formulario solo si no está editando
            if (!isEditing) {
                setRating(0);
                setComment('');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al enviar la reseña');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
            return (
                <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl transition-all hover:scale-110"
                >
                    <span className={starValue <= (hoverRating || rating) ? 'text-pov-gold' : 'text-gray-600'}>
                        ⭐
                    </span>
                </button>
            );
        });
    };

    return (
        <div className="bg-pov-secondary rounded-lg p-6 border border-pov-gold/20">
            <h3 className="text-xl font-bold text-pov-cream mb-4">
                {isEditing ? 'Editar Reseña' : 'Escribe tu Reseña'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div>
                    <label className="block text-pov-cream font-medium mb-2">
                        Calificación
                    </label>
                    <div className="flex gap-1">
                        {renderStars()}
                    </div>
                    {rating > 0 && (
                        <p className="text-pov-gold text-sm mt-2">
                            {rating} de 5 estrellas
                        </p>
                    )}
                </div>

                {/* Comment Textarea */}
                <div>
                    <label htmlFor="comment" className="block text-pov-cream font-medium mb-2">
                        Comentario
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comparte tu opinión sobre esta película..."
                        className="w-full px-4 py-3 bg-pov-dark text-pov-cream border border-pov-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-pov-gold focus:border-transparent resize-none"
                        rows={4}
                        required
                        minLength={10}
                        disabled={loading}
                    />
                    <p className="text-pov-gray text-sm mt-1">
                        Mínimo 10 caracteres ({comment.length}/10)
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando...' : isEditing ? 'Actualizar Reseña' : 'Publicar Reseña'}
                    </button>

                    {isEditing && onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-6 py-3 bg-pov-dark hover:bg-pov-primary text-pov-cream font-semibold rounded-lg transition duration-200 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
