import { render } from '@testing-library/react';
import AuthLayout from '../AuthLayout';

describe('AuthLayout', () => {
    it('renders title, subtitle and footer', () => {
        const { getByText } = render(
            <AuthLayout title="Ingreso" subtitle="Bienvenido" footer={<span>Footer</span>}>
                <div>Contenido</div>
            </AuthLayout>
        );

        expect(getByText('Ingreso')).toBeInTheDocument();
        expect(getByText('Bienvenido')).toBeInTheDocument();
        expect(getByText('Contenido')).toBeInTheDocument();
        expect(getByText('Footer')).toBeInTheDocument();
    });
});

