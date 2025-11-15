import { render } from '@testing-library/react';
import RoleGuard from '../RoleGuard';
import { useAuth } from '../../../hooks/useAuth';

jest.mock('../../../hooks/useAuth');

const useAuthMock = useAuth as jest.Mock;

describe('RoleGuard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders children when role is allowed', () => {
        useAuthMock.mockReturnValue({
            isAuthenticated: true,
            hasRole: (role: string) => role === 'admin',
        });

        const { getByText } = render(
            <RoleGuard allowedRoles={['admin']}>
                <div>Contenido restringido</div>
            </RoleGuard>
        );

        expect(getByText('Contenido restringido')).toBeInTheDocument();
    });

    it('renders fallback when not authenticated', () => {
        useAuthMock.mockReturnValue({
            isAuthenticated: false,
            hasRole: () => false,
        });

        const { getByText } = render(
            <RoleGuard allowedRoles={['admin']} fallback={<span>Acceso denegado</span>}>
                <div>Contenido</div>
            </RoleGuard>
        );

        expect(getByText('Acceso denegado')).toBeInTheDocument();
    });

    it('renders fallback when role missing', () => {
        useAuthMock.mockReturnValue({
            isAuthenticated: true,
            hasRole: () => false,
        });

        const { getByText } = render(
            <RoleGuard allowedRoles={['admin']} fallback={<span>Sin permisos</span>}>
                <div>Contenido</div>
            </RoleGuard>
        );

        expect(getByText('Sin permisos')).toBeInTheDocument();
    });
});

