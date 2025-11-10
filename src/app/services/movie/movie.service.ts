import { Movies } from "../../interfaces/movies-response.interface";
import apiService from "../api.service";

interface CreateMovieDto {
    title: string;
    description: string;
    director: string;
    releaseDate: string;
    genre: string;
}

interface UpdateMovieDto {
    title?: string;
    description?: string;
    director?: string;
    releaseDate?: string;
    genre?: string;
}

const movieService = {
    // Obtener todas las películas
    getAll: async () => {
        const movies = await apiService.get<Movies[]>('movies');
        return movies;
    },

    // Obtener una película por ID
    getById: async (id: string) => {
        const movie = await apiService.get<Movies>(`movies/${id}`);
        return movie;
    },

    // Crear una película (solo ADMIN)
    create: async (data: CreateMovieDto) => {
        const movie = await apiService.post<Movies>('movies', data, {});
        return movie;
    },

    // Actualizar una película (solo ADMIN)
    update: async (id: string, data: UpdateMovieDto) => {
        const movie = await apiService.patch<Movies>(`movies/${id}`, data, {});
        return movie;
    },

    // Eliminar una película (solo ADMIN)
    delete: async (id: string) => {
        await apiService.delete(`movies/${id}`, {});
    }
};

export default movieService;
