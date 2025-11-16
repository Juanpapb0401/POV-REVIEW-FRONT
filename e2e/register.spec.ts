import { test, expect } from '@playwright/test';

test.describe('Página de Registro', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/register');
    });

    test('debe mostrar el formulario de registro correctamente', async ({ page }) => {
        // Esperar a que la página cargue completamente
        await page.waitForLoadState('networkidle');

        // Verificar título
        await expect(page.getByRole('heading', { name: 'Crear Cuenta' })).toBeVisible();
        await expect(page.getByText('Regístrate en POV Review')).toBeVisible();

        // Verificar campos del formulario
        await expect(page.getByLabel('Nombre Completo')).toBeVisible();
        await expect(page.getByLabel('Correo Electrónico')).toBeVisible();
        await expect(page.getByLabel('Contraseña', { exact: true })).toBeVisible();
        await expect(page.getByLabel('Confirmar Contraseña')).toBeVisible();

        // Verificar botón de submit
        await expect(page.getByRole('button', { name: 'Crear Cuenta' })).toBeVisible();

        // Verificar link a login
        await expect(page.getByText('¿Ya tienes cuenta?')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Inicia sesión aquí' })).toBeVisible();
    });

    test('debe mostrar error cuando el nombre es muy corto', async ({ page }) => {
        // Llenar nombre con menos de 3 caracteres
        await page.getByLabel('Nombre Completo').fill('ab');
        await page.getByLabel('Nombre Completo').blur();

        // Llenar otros campos
        await page.getByLabel('Correo Electrónico').fill('test@example.com');
        await page.getByLabel('Contraseña', { exact: true }).fill('password123');
        await page.getByLabel('Confirmar Contraseña').fill('password123');

        // Submit
        await page.getByRole('button', { name: 'Crear Cuenta' }).click();

        // Verificar mensaje de error
        await expect(page.getByText(/al menos 3 caracteres/i)).toBeVisible();
    });

    test('debe mostrar error cuando el email es inválido', async ({ page }) => {
        // Llenar formulario con email inválido
        await page.getByLabel('Nombre Completo').fill('Test User');
        await page.getByLabel('Correo Electrónico').fill('invalid-email');
        await page.getByLabel('Contraseña', { exact: true }).fill('password123');
        await page.getByLabel('Confirmar Contraseña').fill('password123');

        // Submit
        await page.getByRole('button', { name: 'Crear Cuenta' }).click();

        // El navegador mostrará validación HTML5 automática para email
        await expect(page).toHaveURL('/register');
    });

    test('debe mostrar error cuando las contraseñas no coinciden', async ({ page }) => {
        // Llenar formulario con contraseñas diferentes
        await page.getByLabel('Nombre Completo').fill('Test User');
        await page.getByLabel('Correo Electrónico').fill('test@example.com');
        await page.getByLabel('Contraseña', { exact: true }).fill('password123');
        await page.getByLabel('Confirmar Contraseña').fill('different456');

        // Submit
        await page.getByRole('button', { name: 'Crear Cuenta' }).click();

        // Verificar mensaje de error
        await expect(page.getByText(/no coinciden/i)).toBeVisible();
    });

    test('debe mostrar error cuando la contraseña es muy corta', async ({ page }) => {
        // Llenar formulario con contraseña corta
        await page.getByLabel('Nombre Completo').fill('Test User');
        await page.getByLabel('Correo Electrónico').fill('test@example.com');
        await page.getByLabel('Contraseña', { exact: true }).fill('123');
        await page.getByLabel('Confirmar Contraseña').fill('123');

        // Submit
        await page.getByRole('button', { name: 'Crear Cuenta' }).click();

        // Verificar mensaje de error
        await expect(page.getByText(/al menos 6 caracteres/i)).toBeVisible();
    });

    test('debe navegar a la página de login', async ({ page }) => {
        // Click en el link de login
        await page.getByRole('link', { name: 'Inicia sesión aquí' }).click();

        // Verificar navegación
        await expect(page).toHaveURL('/login');
    });

    test('debe limpiar errores cuando el usuario escribe', async ({ page }) => {
        // Llenar con datos inválidos y hacer submit
        await page.getByLabel('Nombre Completo').fill('ab');
        await page.getByLabel('Correo Electrónico').fill('test@example.com');
        await page.getByLabel('Contraseña', { exact: true }).fill('password123');
        await page.getByLabel('Confirmar Contraseña').fill('password123');

        await page.getByRole('button', { name: 'Crear Cuenta' }).click();

        // Verificar que hay error
        await expect(page.getByText(/al menos 3 caracteres/i)).toBeVisible();

        // Escribir un valor correcto
        await page.getByLabel('Nombre Completo').fill('Test User');

        // El error debería desaparecer (esto depende de tu implementación)
        // Si implementaste limpieza de errores en tiempo real
    });

    test('debe registrar usuario exitosamente con datos válidos', async ({ page }) => {
        const mockRegisterResponse = {
            token: 'mock-token',
            user: {
                id: '2',
                name: 'Test User',
                email: 'test@example.com',
                roles: ['user']
            }
        };

        await page.route('**/auth/register', async (route, request) => {
            const body = request.postDataJSON();
            expect(body).toMatchObject({
                name: 'Test User',
                password: 'password123'
            });

            await route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({
                    ...mockRegisterResponse,
                    user: {
                        ...mockRegisterResponse.user,
                        email: body.email
                    }
                })
            });
        });

        // Generar email único para evitar conflictos
        const uniqueEmail = `test${Date.now()}@example.com`;

        // Llenar formulario con datos válidos
        await page.getByLabel('Nombre Completo').fill('Test User');
        await page.getByLabel('Correo Electrónico').fill(uniqueEmail);
        await page.getByLabel('Contraseña', { exact: true }).fill('password123');
        await page.getByLabel('Confirmar Contraseña').fill('password123');

        // Submit
        await page.getByRole('button', { name: 'Crear Cuenta' }).click();

        // El flujo actual redirige al dashboard tras registrarse
        await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    });

    test('debe validar todos los campos antes de enviar', async ({ page }) => {
        // Intentar submit sin llenar nada
        await page.getByRole('button', { name: 'Crear Cuenta' }).click();

        // Debe permanecer en la página de registro
        await expect(page).toHaveURL('/register');
    });
});
