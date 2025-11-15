import movieService from '../movie.service';
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

describe('movieService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches all movies', async () => {
        (apiMock.get as jest.Mock).mockResolvedValue([{ id: '1' }]);

        const result = await movieService.getAll();

        expect(apiMock.get).toHaveBeenCalledWith('movies');
        expect(result).toEqual([{ id: '1' }]);
    });

    it('fetches movie by id', async () => {
        (apiMock.get as jest.Mock).mockResolvedValue({ id: '1' });

        const result = await movieService.getById('1');

        expect(apiMock.get).toHaveBeenCalledWith('movies/1');
        expect(result).toEqual({ id: '1' });
    });

    it('creates new movie', async () => {
        (apiMock.post as jest.Mock).mockResolvedValue({ id: '1' });

        const payload = { title: 'New Movie' };
        const result = await movieService.create(payload as any);

        expect(apiMock.post).toHaveBeenCalledWith('movies', payload, {});
        expect(result).toEqual({ id: '1' });
    });

    it('updates movie', async () => {
        (apiMock.patch as jest.Mock).mockResolvedValue({ id: '1', title: 'Updated' });

        const result = await movieService.update('1', { title: 'Updated' } as any);

        expect(apiMock.patch).toHaveBeenCalledWith('movies/1', { title: 'Updated' }, {});
        expect(result).toEqual({ id: '1', title: 'Updated' });
    });

    it('deletes movie', async () => {
        (apiMock.delete as jest.Mock).mockResolvedValue(undefined);

        await movieService.delete('1');

        expect(apiMock.delete).toHaveBeenCalledWith('movies/1', {});
    });
});

