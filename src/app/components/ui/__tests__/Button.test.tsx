import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button Component', () => {
    it('debe renderizar correctamente con children', () => {
        render(<Button>Click me</Button>);

        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('debe ejecutar onClick cuando se hace click', async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();

        render(<Button onClick={handleClick}>Click me</Button>);

        await user.click(screen.getByText('Click me'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debe mostrar texto de carga cuando loading es true', () => {
        render(<Button loading>Submit</Button>);

        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('debe estar deshabilitado cuando loading es true', () => {
        render(<Button loading>Submit</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('debe estar deshabilitado cuando disabled es true', () => {
        render(<Button disabled>Submit</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('debe aplicar la clase fullWidth cuando se pasa la prop', () => {
        render(<Button fullWidth>Submit</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-full');
    });

    it('debe aplicar estilos de variante primary por defecto', () => {
        render(<Button>Submit</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-pov-gold');
    });

    it('debe aplicar estilos de variante secondary', () => {
        render(<Button variant="secondary">Submit</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-pov-secondary');
    });

    it('debe aplicar estilos de variante danger', () => {
        render(<Button variant="danger">Delete</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-red-600');
    });
});
