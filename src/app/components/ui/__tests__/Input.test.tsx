import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input Component', () => {
    it('debe renderizar correctamente con label', () => {
        render(<Input label="Email" type="email" />);

        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('debe mostrar el valor ingresado', async () => {
        const user = userEvent.setup();
        const handleChange = jest.fn();

        render(
            <Input
                label="Email"
                type="email"
                onChange={handleChange}
            />
        );

        const input = screen.getByLabelText('Email');
        await user.type(input, 'test@example.com');

        expect(input).toHaveValue('test@example.com');
    });

    it('debe mostrar mensaje de error cuando se proporciona', () => {
        const errorMessage = 'El email es requerido';

        render(
            <Input
                label="Email"
                type="email"
                error={errorMessage}
            />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('debe aplicar estilos de error cuando hay un error', () => {
        render(
            <Input
                label="Email"
                type="email"
                error="Error"
            />
        );

        const input = screen.getByLabelText('Email');
        expect(input).toHaveClass('border-red-500');
    });

    it('debe estar deshabilitado cuando se pasa la prop disabled', () => {
        render(
            <Input
                label="Email"
                type="email"
                disabled
            />
        );

        const input = screen.getByLabelText('Email');
        expect(input).toBeDisabled();
    });

    it('debe ser requerido cuando se pasa la prop required', () => {
        render(
            <Input
                label="Email"
                type="email"
                required
            />
        );

        const input = screen.getByLabelText('Email');
        expect(input).toBeRequired();
    });
});
