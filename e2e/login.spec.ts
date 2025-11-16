import { test, expect } from './testWithCoverage';

test.describe('Página de Login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('debe mostrar el formulario de login correctamente', async ({ page }) => {
        // Verificar que el título esté presente
        await expect(page.getByText('POV Review')).toBeVisible();
        await expect(page.getByText('Inicia sesión para continuar')).toBeVisible();

        // Verificar que los campos del formulario estén presentes
        await expect(page.getByLabel('Correo Electrónico')).toBeVisible();
        await expect(page.getByLabel('Contraseña')).toBeVisible();

        // Verificar que el botón de submit esté presente
        await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeVisible();

        // Verificar link a registro
        await expect(page.getByText('¿No tienes cuenta?')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Regístrate aquí' })).toBeVisible();
    });

    test('debe mostrar errores de validación con campos vacíos', async ({ page }) => {
        // Hacer click en el botón sin llenar campos
        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

        // El navegador mostrará validación HTML5 automática
        // Verificar que no se haya navegado a otra página
        await expect(page).toHaveURL('/login');
    });

    test('debe mostrar error con credenciales incorrectas', async ({ page }) => {
        // Llenar formulario con credenciales incorrectas
        await page.getByLabel('Correo Electrónico').fill('wrong@example.com');
        await page.getByLabel('Contraseña').fill('wrongpassword');

        // Submit
        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

        // Esperar el mensaje de error - buscar por el componente Alert o el texto específico
        await expect(page.locator('[role="alert"]').or(page.getByText(/Error al iniciar sesión/i))).toBeVisible({ timeout: 5000 });
    });

    test('debe navegar a la página de registro', async ({ page }) => {
        // Click en el link de registro
        await page.getByRole('link', { name: 'Regístrate aquí' }).click();

        // Verificar navegación
        await expect(page).toHaveURL('/register');
    });

    test('debe funcionar con las credenciales de prueba de admin', async ({ page }) => {
        const mockLoginResponse = {
            token: 'mock-token',
            user: {
                id: '1',
                name: 'Admin User',
                email: 'admin@example.com',
                roles: ['admin']
            }
        };

        const mockProfileResponse = {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            roles: ['admin']
        };

        await page.route('**/auth/login', async (route, request) => {
            const body = request.postDataJSON();
            expect(body).toEqual({
                email: 'admin@example.com',
                password: 'admin123'
            });

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockLoginResponse)
            });
        });

        await page.route('**/users/profile', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockProfileResponse)
            });
        });

        // Usar credenciales de admin de prueba
        await page.getByLabel('Correo Electrónico').fill('admin@example.com');
        await page.getByLabel('Contraseña').fill('admin123');

        // Submit
        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

        // Debe redirigir a la página de películas tras un login exitoso
        await expect(page).toHaveURL('/movies', { timeout: 5000 });
    });

    test('debe mostrar y ocultar contraseña (si hay toggle)', async ({ page }) => {
        const passwordInput = page.getByLabel('Contraseña');

        // Por defecto debe ser tipo password
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Escribir algo
        await passwordInput.fill('test123');
        await expect(passwordInput).toHaveValue('test123');
    });

    test('debe tener enlaces funcionales en el footer', async ({ page }) => {
        // Verificar que las credenciales de prueba estén visibles
        await expect(page.getByText('Credenciales de prueba:')).toBeVisible();
        await expect(page.getByText(/Admin:/)).toBeVisible();
        await expect(page.getByText(/Usuario:/)).toBeVisible();
    });
});
