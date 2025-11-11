import { create } from "zustand";
import { MovieStore } from "../interfaces/type";
import movieService from "@/src/app/services/movie/movie.service";
import { Movies } from "@/src/app/interfaces/movies-response.interface";


export const useMovieStore = create<MovieStore>()((set) => ({
    movies: [],
    currentMovie: null,

    getMovies: async () => {
        const movies: Movies[] = await movieService.getAll();
        return set((state) => ({ ...state, movies }));
    },

    getMovieById: async (id: string) => {
        const movie: Movies = await movieService.getById(id);
        return set((state) => ({ ...state, currentMovie: movie }));
    },

    createMovie: async (movieData: Partial<Movies>) => {
        const newMovie: Movies = await movieService.create(movieData as any);
        return set((state) => ({ ...state, movies: [...state.movies, newMovie] }));
    },

    updateMovie: async (id: string, movieData: Partial<Movies>) => {
        const updatedMovie: Movies = await movieService.update(id, movieData as any);
        return set((state) => ({
            ...state,
            movies: state.movies.map(m => m.id === id ? updatedMovie : m),
            currentMovie: state.currentMovie?.id === id ? updatedMovie : state.currentMovie
        }));
    },

    deleteMovie: async (id: string) => {
        await movieService.delete(id);
        return set((state) => ({
            ...state,
            movies: state.movies.filter(m => m.id !== id),
            currentMovie: state.currentMovie?.id === id ? null : state.currentMovie
        }));
    },

    clearCurrentMovie: () => {
        return set((state) => ({ ...state, currentMovie: null }));
    }
}));
