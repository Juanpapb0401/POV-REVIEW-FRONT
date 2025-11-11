import { Movies } from "@/src/app/interfaces/movies-response.interface";

export type MovieStore = {
    movies: Array<Movies>;
    currentMovie: Movies | null;
    getMovies: () => Promise<void>;
    getMovieById: (id: string) => Promise<void>;
    createMovie: (movieData: Partial<Movies>) => Promise<void>;
    updateMovie: (id: string, movieData: Partial<Movies>) => Promise<void>;
    deleteMovie: (id: string) => Promise<void>;
    clearCurrentMovie: () => void;
}

export type StoreSet =
    (
        partial: MovieStore |
            Partial<MovieStore> |
            ((state: MovieStore) => MovieStore |
                Partial<MovieStore>),
        replace?: boolean | undefined) => void
