import { render, waitFor } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('../../../hooks/useAuth');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const useAuthMock = useAuth as jest.Mock;
const useRouterMock = useRouter as jest.Mock;

describe('ProtectedRoute', () => {
    const push = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useRouterMock.mockReturnValue({ push });
    });

    it('renders children when authenticated and role allowed', () => {
        useAuthMock.mockReturnValue({
            isAuthenticated: true,
            hasRole: () => true,
        });

        const { getByText } = render(
            <ProtectedRoute requiredRole="admin">
                <div>Contenido protegido</div>
            </ProtectedRoute>
        );

        expect(getByText('Contenido protegido')).toBeInTheDocument();
        expect(push).not.toHaveBeenCalled();
    });

    it('redirects to login when not authenticated', async () => {
        useAuthMock.mockReturnValue({
            isAuthenticated: false,
            hasRole: () => false,
        });

        render(
            <ProtectedRoute>
                <div>No debería verse</div>
            </ProtectedRoute>
        );

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/login');
        });
    });

    it('redirects when missing required role', async () => {
        useAuthMock.mockReturnValue({
            isAuthenticated: true,
            hasRole: () => false,
        });

        render(
            <ProtectedRoute requiredRole="admin">
                <div>No debería verse</div>
            </ProtectedRoute>
        );

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/movies');
        });
    });
});

