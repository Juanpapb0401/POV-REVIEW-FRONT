import apiService from "../api.service";

interface CreateReviewData {
    rating: number;
    comment: string;
    movieId: string;
}

interface UpdateReviewData {
    rating?: number;
    comment?: string;
}

export interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
    };
    movie?: {
        id: string;
        title: string;
    };
}

const reviewService = {
    // Crear una reseña para una película
    create: async (data: CreateReviewData) => {
        const response = await apiService.post<Review>(`reviews/movie/${data.movieId}`, {
            name: 'Review', // Campo requerido por el backend (aunque no se usa)
            rating: data.rating,
            comment: data.comment
        });
        return response;
    },

    // Obtener todas las reseñas
    getAll: async () => {
        const response = await apiService.get<Review[]>('reviews');
        return response;
    },

    // Obtener reseñas de una película
    getMovieReviews: async (movieId: string) => {
        const response = await apiService.get<Review[]>(`reviews/movie/${movieId}`);
        return response;
    },

    // Obtener reseñas de un usuario
    getUserReviews: async (userId: string) => {
        const response = await apiService.get<Review[]>(`reviews/user/${userId}`);
        return response;
    },

    // Obtener una reseña por ID
    getById: async (id: string) => {
        const response = await apiService.get<Review>(`reviews/${id}`);
        return response;
    },

    // Actualizar una reseña
    update: async (id: string, data: UpdateReviewData) => {
        const response = await apiService.patch<Review>(`reviews/${id}`, data);
        return response;
    },

    // Eliminar una reseña
    delete: async (id: string) => {
        const response = await apiService.delete(`reviews/${id}`);
        return response;
    }
};

export default reviewService;
