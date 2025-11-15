import { act } from '@testing-library/react';
import { useUserStore } from '../user.store';
import userService from '../../../../services/user/user.service';
import { Users } from '../../../../interfaces/users-response.interface';

jest.mock('../../../../services/user/user.service', () => ({
    __esModule: true,
    default: {
        getAll: jest.fn(),
    },
}));

const userMock = userService as jest.Mocked<typeof userService>;

const sampleUser: Users = {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    password: 'hashed',
    roles: ['user'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const resetStore = () => {
    const state = useUserStore.getState();
    useUserStore.setState({
        users: [],
        getUsers: state.getUsers,
    }, true);
};

describe('useUserStore', () => {
    beforeEach(() => {
        resetStore();
        jest.clearAllMocks();
    });

    it('loads users list', async () => {
        userMock.getAll.mockResolvedValue([sampleUser]);

        await act(async () => {
            await useUserStore.getState().getUsers();
        });

        expect(useUserStore.getState().users).toEqual([sampleUser]);
        expect(userMock.getAll).toHaveBeenCalledWith(10, 1);
    });
});

