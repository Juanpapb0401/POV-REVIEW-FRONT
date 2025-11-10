import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from '../Alert';

describe('Alert Component', () => {
    it('debe renderizar correctamente con mensaje', () => {
        render(<Alert message="Error message" />);

        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('debe mostrar icono de error por defecto', () => {
        render(<Alert message="Error" />);

        expect(screen.getByText('❌')).toBeInTheDocument();
    });

    it('debe mostrar icono de success cuando type es success', () => {
        render(<Alert type="success" message="Success" />);

        expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('debe mostrar icono de warning cuando type es warning', () => {
        render(<Alert type="warning" message="Warning" />);

        expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('debe mostrar icono de info cuando type es info', () => {
        render(<Alert type="info" message="Info" />);

        expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });

    it('debe aplicar estilos de error por defecto', () => {
        const { container } = render(<Alert message="Error" />);

        const alert = container.firstChild;
        expect(alert).toHaveClass('bg-red-500/10', 'border-red-500', 'text-red-400');
    });

    it('debe mostrar botón de cerrar cuando onClose está definido', () => {
        const handleClose = jest.fn();

        render(<Alert message="Error" onClose={handleClose} />);

        expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('debe ejecutar onClose cuando se hace click en el botón', async () => {
        const user = userEvent.setup();
        const handleClose = jest.fn();

        render(<Alert message="Error" onClose={handleClose} />);

        await user.click(screen.getByText('✕'));

        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('no debe mostrar botón de cerrar cuando onClose no está definido', () => {
        render(<Alert message="Error" />);

        expect(screen.queryByText('✕')).not.toBeInTheDocument();
    });
});
