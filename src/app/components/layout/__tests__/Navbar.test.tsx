import { render, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { useAuthStore } from '../../../store/auth';
import { useRouter } from 'next/navigation';

jest.mock('../../../store/auth', () => ({
    useAuthStore: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../../auth/RoleGuard', () => ({
    __esModule: true,
    default: ({ children }: any) => <>{children}</>,
}));

const useAuthStoreMock = useAuthStore as unknown as jest.Mock;
const useRouterMock = useRouter as jest.Mock;

describe('Navbar', () => {
    const push = jest.fn();
    const refresh = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useRouterMock.mockReturnValue({ push, refresh });
    });

    it('renders guest links when not authenticated', () => {
        useAuthStoreMock.mockReturnValue({
            user: null,
            isAuthenticated: false,
            logout: jest.fn(),
        });

        const { getByText } = render(<Navbar />);

        expect(getByText('Iniciar Sesión')).toBeInTheDocument();
        expect(getByText('Registrarse')).toBeInTheDocument();
    });

    it('renders authenticated options and handles logout', () => {
        const logout = jest.fn();
        useAuthStoreMock.mockReturnValue({
            user: { name: 'Admin', roles: ['admin'] },
            isAuthenticated: true,
            logout,
        });

        const { getByText } = render(<Navbar />);

        expect(getByText('Mis Reviews')).toBeInTheDocument();
        expect(getByText('Admin')).toBeInTheDocument();
        expect(getByText('ADMIN')).toBeInTheDocument();

        fireEvent.click(getByText('Cerrar Sesión'));

        expect(logout).toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith('/');
        expect(refresh).toHaveBeenCalled();
    });
});

