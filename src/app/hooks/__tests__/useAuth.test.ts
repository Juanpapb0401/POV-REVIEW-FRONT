import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'next/navigation';

jest.mock('../../store/auth', () => ({
    useAuthStore: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const useAuthStoreMock = useAuthStore as jest.Mock;
const useRouterMock = useRouter as jest.Mock;

describe('useAuth hook', () => {
    const push = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useRouterMock.mockReturnValue({ push });
    });

    it('returns permissions for admin users', () => {
        const checkAuth = jest.fn();
        useAuthStoreMock.mockReturnValue({
            user: { id: '1', roles: ['admin'] },
            isAuthenticated: true,
            checkAuth,
        });

        const { result } = renderHook(() => useAuth());

        expect(checkAuth).toHaveBeenCalled();
        expect(result.current.isAdmin()).toBe(true);
        expect(result.current.canCreateMovie()).toBe(true);
        expect(result.current.canDeleteReview('another-user')).toBe(true);
    });

    it('restricts permissions for regular users', () => {
        useAuthStoreMock.mockReturnValue({
            user: { id: '1', roles: ['user'] },
            isAuthenticated: true,
            checkAuth: jest.fn(),
        });

        const { result } = renderHook(() => useAuth());

        expect(result.current.isAdmin()).toBe(false);
        expect(result.current.canCreateReview()).toBe(true);
        expect(result.current.canDeleteReview('2')).toBe(false);
        expect(result.current.canDeleteReview('1')).toBe(true);
    });

    it('redirects when required role missing', async () => {
        useAuthStoreMock.mockReturnValue({
            user: { id: '1', roles: ['user'] },
            isAuthenticated: true,
            checkAuth: jest.fn(),
        });

        renderHook(() => useAuth('admin'));

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/movies');
        });
    });
});

