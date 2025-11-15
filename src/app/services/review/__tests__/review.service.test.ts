import reviewService from '../review.service';
import apiService from '../../api.service';

jest.mock('../../api.service', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

const apiMock = apiService as jest.Mocked<typeof apiService>;

describe('reviewService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('creates review for a movie', async () => {
        (apiMock.post as jest.Mock).mockResolvedValue({ id: '1' });

        const result = await reviewService.create({ rating: 5, comment: 'Excelente', movieId: 'movie-1' });

        expect(apiMock.post).toHaveBeenCalledWith('reviews/movie/movie-1', {
            name: 'Review',
            rating: 5,
            comment: 'Excelente',
        });
        expect(result).toEqual({ id: '1' });
    });

    it('gets reviews by movie', async () => {
        (apiMock.get as jest.Mock).mockResolvedValue([{ id: '1' }]);

        const result = await reviewService.getMovieReviews('movie-1');

        expect(apiMock.get).toHaveBeenCalledWith('reviews/movie/movie-1');
        expect(result).toEqual([{ id: '1' }]);
    });

    it('updates review', async () => {
        (apiMock.patch as jest.Mock).mockResolvedValue({ id: '1', comment: 'Nuevo' });

        const result = await reviewService.update('1', { comment: 'Nuevo' });

        expect(apiMock.patch).toHaveBeenCalledWith('reviews/1', { comment: 'Nuevo' });
        expect(result).toEqual({ id: '1', comment: 'Nuevo' });
    });

    it('deletes review', async () => {
        (apiMock.delete as jest.Mock).mockResolvedValue(undefined);

        await reviewService.delete('1');

        expect(apiMock.delete).toHaveBeenCalledWith('reviews/1');
    });
});

