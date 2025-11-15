import apiService from '../api.service';
import axiosInstance from '../../../lib/api';

jest.mock('../../../lib/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

const axiosMock = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('apiService', () => {
    const config = { headers: { Authorization: 'Bearer token' } };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('performs GET requests', async () => {
        (axiosMock.get as jest.Mock).mockResolvedValue({ data: { ok: true } });

        const response = await apiService.get('movies', config);

        expect(axiosMock.get).toHaveBeenCalledWith('movies', config);
        expect(response).toEqual({ ok: true });
    });

    it('performs POST requests', async () => {
        (axiosMock.post as jest.Mock).mockResolvedValue({ data: { created: true } });

        const payload = { name: 'Test' };
        const response = await apiService.post('movies', payload, config);

        expect(axiosMock.post).toHaveBeenCalledWith('movies', payload, config);
        expect(response).toEqual({ created: true });
    });

    it('performs PUT requests', async () => {
        (axiosMock.put as jest.Mock).mockResolvedValue({ data: { updated: true } });

        const response = await apiService.put('movies/1', { title: 'New' }, config);

        expect(axiosMock.put).toHaveBeenCalledWith('movies/1', { title: 'New' }, config);
        expect(response).toEqual({ updated: true });
    });

    it('performs PATCH requests', async () => {
        (axiosMock.patch as jest.Mock).mockResolvedValue({ data: { patched: true } });

        const response = await apiService.patch('movies/1', { title: 'New' }, config);

        expect(axiosMock.patch).toHaveBeenCalledWith('movies/1', { title: 'New' }, config);
        expect(response).toEqual({ patched: true });
    });

    it('performs DELETE requests', async () => {
        (axiosMock.delete as jest.Mock).mockResolvedValue({ data: { deleted: true } });

        const response = await apiService.delete('movies/1', config);

        expect(axiosMock.delete).toHaveBeenCalledWith('movies/1', config);
        expect(response).toEqual({ deleted: true });
    });
});

