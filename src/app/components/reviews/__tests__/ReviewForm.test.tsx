import { render, fireEvent, waitFor } from '@testing-library/react';
import ReviewForm from '../ReviewForm';
import { useAuth } from '../../../hooks/useAuth';

jest.mock('../../../hooks/useAuth');

const useAuthMock = useAuth as jest.Mock;

describe('ReviewForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('asks user to login when not authenticated', () => {
        useAuthMock.mockReturnValue({ isAuthenticated: false });

        const { getByText } = render(
            <ReviewForm movieId="1" onSubmit={jest.fn()} />
        );

        expect(getByText('Debes iniciar sesión para escribir una reseña')).toBeInTheDocument();
        expect(getByText('Iniciar Sesión')).toHaveAttribute('href', '/login');
    });

    it('submits review when data is valid', async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        useAuthMock.mockReturnValue({ isAuthenticated: true });

        const { getAllByRole, getByLabelText, getByText } = render(
            <ReviewForm movieId="1" onSubmit={onSubmit} />
        );

        const starButtons = getAllByRole('button', { name: '⭐' });
        fireEvent.click(starButtons[3]); // rating = 4

        fireEvent.change(getByLabelText('Comentario'), {
            target: { value: 'Comentario suficientemente largo' },
        });

        fireEvent.click(getByText('Publicar Reseña'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(4, 'Comentario suficientemente largo');
        });
    });

    it('shows validation error when missing rating', async () => {
        useAuthMock.mockReturnValue({ isAuthenticated: true });

        const { getByLabelText, getByText, findByText } = render(
            <ReviewForm movieId="1" onSubmit={jest.fn()} />
        );

        fireEvent.change(getByLabelText('Comentario'), {
            target: { value: 'Comentario válido' },
        });

        fireEvent.click(getByText('Publicar Reseña'));

        expect(await findByText('Por favor selecciona una calificación')).toBeInTheDocument();
    });
});

