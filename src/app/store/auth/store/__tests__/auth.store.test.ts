import { act } from '@testing-library/react';
import { useAuthStore } from '../auth.store';
import authService from '../../../../services/auth/auth.service';

jest.mock('../../../../services/auth/auth.service', () => ({
    __esModule: true,
    default: {
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        getProfile: jest.fn(),
        getToken: jest.fn(),
        isAuthenticated: jest.fn(),
    },
}));

const authMock = authService as jest.Mocked<typeof authService>;

const getInitialState = () => {
    const state = useAuthStore.getState();
    return {
        user: null,
        token: null,
        isAuthenticated: false,
        login: state.login,
        register: state.register,
        logout: state.logout,
        checkAuth: state.checkAuth,
        isAdmin: state.isAdmin,
    };
};

describe('useAuthStore', () => {
    beforeEach(() => {
        localStorage.clear();
        useAuthStore.setState(getInitialState(), true);
        jest.clearAllMocks();
    });

    it('logs in and stores user data', async () => {
        authMock.login.mockResolvedValue({ token: 'token-123' } as any);
        authMock.getProfile.mockResolvedValue({
            id: '1',
            name: 'Admin',
            email: 'admin@example.com',
            roles: ['admin'],
        });

        await act(async () => {
            await useAuthStore.getState().login('admin@example.com', 'secret');
        });

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.token).toBe('token-123');
        expect(state.user?.roles).toContain('admin');
    });

    it('registers and updates state', async () => {
        authMock.register.mockResolvedValue({
            token: 'token-456',
            user: { id: '2', name: 'User', email: 'user@example.com', roles: ['user'] },
        } as any);

        await act(async () => {
            await useAuthStore.getState().register('User', 'user@example.com', 'password');
        });

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.token).toBe('token-456');
        expect(state.user?.name).toBe('User');
    });

    it('logs out and clears data', () => {
        useAuthStore.setState((state) => ({
            ...state,
            user: { id: '1', name: 'Test', email: '', roles: [] },
            token: 'token',
            isAuthenticated: true,
        }));

        useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(authMock.logout).toHaveBeenCalled();
    });

    it('checks authentication from token', () => {
        authMock.isAuthenticated.mockReturnValue(true);
        authMock.getToken.mockReturnValue('token');

        useAuthStore.getState().checkAuth();

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.token).toBe('token');
    });

    it('detects admin role', () => {
        useAuthStore.setState((state) => ({
            ...state,
            user: { id: '1', name: 'Admin', email: '', roles: ['admin'] },
        }));

        expect(useAuthStore.getState().isAdmin()).toBe(true);
    });
});

