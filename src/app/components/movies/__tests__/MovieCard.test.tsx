import { render, fireEvent } from '@testing-library/react';
import MovieCard from '../MovieCard';
import { Movies } from '../../../interfaces/movies-response.interface';

const now = new Date();

const movie: Movies = {
    id: '1',
    title: 'Película',
    description: 'Descripción de prueba',
    director: 'Director',
    releaseDate: new Date('2020-01-01'),
    genre: 'action',
    createdAt: now,
    updatedAt: now,
};

describe('MovieCard', () => {
    it('renders movie information', () => {
        const { getByText } = render(<MovieCard movie={movie} />);

        expect(getByText('Película')).toBeInTheDocument();
        expect(getByText('Director:')).toBeInTheDocument();
        expect(getByText('Ver Detalles')).toBeInTheDocument();
    });

    it('shows actions and handles delete', () => {
        const onDelete = jest.fn();
        const { getByText } = render(
            <MovieCard movie={movie} showActions onDelete={onDelete} />
        );

        fireEvent.click(getByText('🗑️'));
        expect(onDelete).toHaveBeenCalledWith('1');
    });
});

