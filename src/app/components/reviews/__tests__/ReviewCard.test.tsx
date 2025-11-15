import { render, fireEvent } from '@testing-library/react';
import ReviewCard from '../ReviewCard';
import { useAuth } from '../../../hooks/useAuth';

jest.mock('../../../hooks/useAuth');

const useAuthMock = useAuth as jest.Mock;

const review = {
    id: 'review-1',
    rating: 4,
    comment: 'Muy buena película',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    user: {
        id: 'user-1',
        name: 'Alice',
        email: 'alice@example.com',
    },
};

describe('ReviewCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders review info and actions when permitted', () => {
        const onEdit = jest.fn();
        const onDelete = jest.fn();

        useAuthMock.mockReturnValue({
            user: { id: 'user-1' },
            canEditReview: () => true,
            canDeleteReview: () => true,
        });

        const { getByText } = render(
            <ReviewCard review={review as any} onEdit={onEdit} onDelete={onDelete} />
        );

        expect(getByText('Alice')).toBeInTheDocument();
        expect(getByText('4/5')).toBeInTheDocument();
        expect(getByText('Tu reseña')).toBeInTheDocument();

        fireEvent.click(getByText('✏️ Editar'));
        fireEvent.click(getByText('🗑️ Eliminar'));

        expect(onEdit).toHaveBeenCalledWith('review-1');
        expect(onDelete).toHaveBeenCalledWith('review-1');
    });

    it('does not show actions without permissions', () => {
        useAuthMock.mockReturnValue({
            user: { id: 'other-user' },
            canEditReview: () => false,
            canDeleteReview: () => false,
        });

        const { queryByText } = render(<ReviewCard review={review as any} />);

        expect(queryByText('✏️ Editar')).toBeNull();
        expect(queryByText('🗑️ Eliminar')).toBeNull();
        expect(queryByText('Tu reseña')).toBeNull();
    });
});

