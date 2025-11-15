import { render, fireEvent, waitFor } from '@testing-library/react';
import MovieForm, { MovieFormData } from '../MovieForm';
import { Movies } from '../../../interfaces/movies-response.interface';

const baseMovie: Movies = {
    id: '1',
    title: 'Matrix',
    description: 'Película icónica de ciencia ficción',
    director: 'Lana Wachowski',
    releaseDate: new Date('1999-03-31'),
    genre: 'sci-fi',
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('MovieForm', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    it('shows validation errors when fields are empty', async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined);

        const { getByText, getByLabelText, getByPlaceholderText, getByRole } = render(
            <MovieForm onSubmit={onSubmit} onCancel={jest.fn()} />
        );

        fireEvent.change(getByLabelText('Título de la Película'), { target: { value: 'A' } });
        fireEvent.change(getByPlaceholderText('Escribe una breve descripción de la película...'), {
            target: { value: 'Muy corta' },
        });
        fireEvent.change(getByLabelText('Director'), { target: { value: 'B' } });
        fireEvent.change(getByLabelText('Fecha de Estreno'), { target: { value: '2999-01-01' } });
        fireEvent.change(getByRole('combobox'), { target: { value: 'action' } });

        fireEvent.click(getByText('➕ Crear Película'));

        await waitFor(() => {
            const errorElements = document.querySelectorAll('p.text-red-400');
            expect(errorElements.length).toBeGreaterThan(0);
        });
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('prefills form when movie is provided and submits data', async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        const onCancel = jest.fn();

        const { getByLabelText, getByText, getByPlaceholderText, getByRole } = render(
            <MovieForm movie={baseMovie} onSubmit={onSubmit} onCancel={onCancel} isEditing />
        );

        expect(getByLabelText('Título de la Película')).toHaveValue('Matrix');

        fireEvent.change(getByLabelText('Título de la Película'), { target: { value: 'Matrix 2' } });
        fireEvent.change(
            getByPlaceholderText('Escribe una breve descripción de la película...'),
            {
                target: { value: 'Nueva descripción extendida' },
            }
        );
        fireEvent.change(getByLabelText('Director'), { target: { value: 'Nuevo Director' } });
        fireEvent.change(getByLabelText('Fecha de Estreno'), { target: { value: '2020-01-01' } });
        fireEvent.change(getByRole('combobox'), { target: { value: 'action' } });

        fireEvent.click(getByText('💾 Guardar Cambios'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                title: 'Matrix 2',
                description: 'Nueva descripción extendida',
                director: 'Nuevo Director',
                releaseDate: '2020-01-01',
                genre: 'action',
            } as MovieFormData);
        });
    });

    it('shows error message when submit fails', async () => {
        const onSubmit = jest.fn().mockRejectedValue({});

        const { getByLabelText, getByText, findByText, getByPlaceholderText, getByRole } = render(
            <MovieForm onSubmit={onSubmit} onCancel={jest.fn()} />
        );

        fireEvent.change(getByLabelText('Título de la Película'), { target: { value: 'Matrix' } });
        fireEvent.change(
            getByPlaceholderText('Escribe una breve descripción de la película...'),
            {
                target: { value: 'Descripción válida de película' },
            }
        );
        fireEvent.change(getByLabelText('Director'), { target: { value: 'Director' } });
        fireEvent.change(getByLabelText('Fecha de Estreno'), { target: { value: '2020-01-01' } });
        fireEvent.change(getByRole('combobox'), { target: { value: 'action' } });

        fireEvent.click(getByText('➕ Crear Película'));

        expect(await findByText('Error al crear la película')).toBeInTheDocument();
    });
});

