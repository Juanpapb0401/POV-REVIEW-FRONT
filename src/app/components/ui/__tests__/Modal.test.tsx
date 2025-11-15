import { render, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
    beforeEach(() => {
        document.body.style.overflow = 'unset';
    });

    it('does not render when closed', () => {
        const { queryByText } = render(
            <Modal
                isOpen={false}
                onClose={jest.fn()}
                title="Test Modal"
                message="Hidden content"
            />
        );

        expect(queryByText('Test Modal')).toBeNull();
        expect(document.body.style.overflow).toBe('unset');
    });

    it('renders content and locks scroll when open', () => {
        const onClose = jest.fn();
        const { getByText } = render(
            <Modal
                isOpen
                onClose={onClose}
                title="Modal Title"
                message="Modal Message"
            />
        );

        expect(getByText('Modal Title')).toBeInTheDocument();
        expect(getByText('Modal Message')).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('hidden');

        fireEvent.click(getByText('Aceptar'));
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onConfirm and onClose in confirm mode', () => {
        const onClose = jest.fn();
        const onConfirm = jest.fn();

        const { getByText } = render(
            <Modal
                isOpen
                onClose={onClose}
                onConfirm={onConfirm}
                title="Confirmación"
                message="¿Seguro?"
                type="confirm"
                confirmText="Sí"
                cancelText="No"
            />
        );

        fireEvent.click(getByText('Sí'));

        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);

        fireEvent.click(getByText('No'));
        expect(onClose).toHaveBeenCalledTimes(2);
    });
});

