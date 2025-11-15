import { act } from '@testing-library/react';
import { useMovieStore } from '../movie.store';
import movieService from '../../../../services/movie/movie.service';
import { Movies } from '../../../../interfaces/movies-response.interface';

jest.mock('../../../../services/movie/movie.service', () => ({
    __esModule: true,
    default: {
        getAll: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

const movieMock = movieService as jest.Mocked<typeof movieService>;

const sampleMovie: Movies = {
    id: '1',
    title: 'Matrix',
    description: 'Sci-fi movie',
    director: 'Lana Wachowski',
    releaseDate: new Date('1999-03-31'),
    genre: 'sci-fi',
    createdAt: new Date(),
    updatedAt: new Date(),
};

const resetStore = () => {
    const state = useMovieStore.getState();
    useMovieStore.setState({
        movies: [],
        currentMovie: null,
        getMovies: state.getMovies,
        getMovieById: state.getMovieById,
        createMovie: state.createMovie,
        updateMovie: state.updateMovie,
        deleteMovie: state.deleteMovie,
        clearCurrentMovie: state.clearCurrentMovie,
    }, true);
};

describe('useMovieStore', () => {
    beforeEach(() => {
        resetStore();
        jest.clearAllMocks();
    });

    it('loads movies list', async () => {
        movieMock.getAll.mockResolvedValue([sampleMovie]);

        await act(async () => {
            await useMovieStore.getState().getMovies();
        });

        expect(useMovieStore.getState().movies).toHaveLength(1);
    });

    it('loads movie by id', async () => {
        movieMock.getById.mockResolvedValue(sampleMovie);

        await act(async () => {
            await useMovieStore.getState().getMovieById('1');
        });

        expect(useMovieStore.getState().currentMovie?.id).toBe('1');
    });

    it('creates movie and appends to list', async () => {
        movieMock.create.mockResolvedValue(sampleMovie);

        await act(async () => {
            await useMovieStore.getState().createMovie(sampleMovie);
        });

        expect(useMovieStore.getState().movies[0]).toEqual(sampleMovie);
    });

    it('updates movie and current movie', async () => {
        movieMock.update.mockResolvedValue({ ...sampleMovie, title: 'Matrix Reloaded' });

        useMovieStore.setState((state) => ({
            ...state,
            movies: [sampleMovie],
            currentMovie: sampleMovie,
        }));

        await act(async () => {
            await useMovieStore.getState().updateMovie('1', { title: 'Matrix Reloaded' });
        });

        expect(useMovieStore.getState().movies[0].title).toBe('Matrix Reloaded');
        expect(useMovieStore.getState().currentMovie?.title).toBe('Matrix Reloaded');
    });

    it('deletes movie and clears current when matches', async () => {
        movieMock.delete.mockResolvedValue(undefined);

        useMovieStore.setState((state) => ({
            ...state,
            movies: [sampleMovie],
            currentMovie: sampleMovie,
        }));

        await act(async () => {
            await useMovieStore.getState().deleteMovie('1');
        });

        expect(useMovieStore.getState().movies).toHaveLength(0);
        expect(useMovieStore.getState().currentMovie).toBeNull();
    });

    it('clears current movie manually', () => {
        useMovieStore.setState((state) => ({ ...state, currentMovie: sampleMovie }));
        useMovieStore.getState().clearCurrentMovie();
        expect(useMovieStore.getState().currentMovie).toBeNull();
    });
});

