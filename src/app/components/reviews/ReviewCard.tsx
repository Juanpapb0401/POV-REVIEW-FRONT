'use client'

import { useState } from 'react';
import { Review } from '../../services/review/review.service';
import { useAuth } from '../../hooks/useAuth';

interface ReviewCardProps {
    review: Review;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export default function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
    const { user, canEditReview, canDeleteReview } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'text-pov-gold' : 'text-gray-600'}>
                ⭐
            </span>
        ));
    };

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
            return;
        }

        setIsDeleting(true);
        try {
            if (onDelete) {
                await onDelete(review.id);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const isOwner = user?.id === review.user.id;

    return (
        <div className="bg-pov-secondary rounded-lg p-6 border border-pov-gold/10 hover:border-pov-gold/30 transition-all">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="text-pov-cream font-semibold">{review.user.name}</p>
                    <p className="text-pov-gray text-sm">{formatDate(review.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-pov-gold font-bold">{review.rating}/5</span>
                </div>
            </div>

            {/* Comment */}
            <p className="text-pov-gray mb-4">{review.comment}</p>

            {/* Actions - Solo mostrar si es el dueño o admin */}
            {(canEditReview(review.user.id) || canDeleteReview(review.user.id)) && (
                <div className="flex gap-2 pt-4 border-t border-pov-gold/10">
                    {canEditReview(review.user.id) && onEdit && (
                        <button
                            onClick={() => onEdit(review.id)}
                            className="text-pov-gold hover:text-pov-gold-dark text-sm font-medium transition"
                        >
                            ✏️ Editar
                        </button>
                    )}

                    {canDeleteReview(review.user.id) && onDelete && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-red-500 hover:text-red-600 text-sm font-medium transition disabled:opacity-50"
                        >
                            🗑️ {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    )}
                </div>
            )}

            {/* Badge si es tu reseña */}
            {isOwner && (
                <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pov-gold/20 text-pov-gold border border-pov-gold/30">
                        Tu reseña
                    </span>
                </div>
            )}
        </div>
    );
}
