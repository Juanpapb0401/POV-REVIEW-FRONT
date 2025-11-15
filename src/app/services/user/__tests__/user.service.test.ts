import userService from '../user.service';
import apiService from '../../api.service';

jest.mock('../../api.service', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

const apiMock = apiService as jest.Mocked<typeof apiService>;

describe('userService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('gets all users with pagination', async () => {
        (apiMock.get as jest.Mock).mockResolvedValue([{ id: '1' }]);

        const result = await userService.getAll(5, 2);

        expect(apiMock.get).toHaveBeenCalledWith('users?limit=5&offset=2');
        expect(result).toEqual([{ id: '1' }]);
    });

    it('gets user by id', async () => {
        (apiMock.get as jest.Mock).mockResolvedValue({ id: '1' });

        const result = await userService.getById('1');

        expect(apiMock.get).toHaveBeenCalledWith('users/1');
        expect(result).toEqual({ id: '1' });
    });

    it('updates roles', async () => {
        (apiMock.patch as jest.Mock).mockResolvedValue({ id: '1', roles: ['admin'] });

        const result = await userService.updateRoles('1', ['admin']);

        expect(apiMock.patch).toHaveBeenCalledWith('users/1/roles', { roles: ['admin'] });
        expect(result).toEqual({ id: '1', roles: ['admin'] });
    });

    it('deletes user', async () => {
        (apiMock.delete as jest.Mock).mockResolvedValue(undefined);

        await userService.delete('1');

        expect(apiMock.delete).toHaveBeenCalledWith('users/1');
    });
});

