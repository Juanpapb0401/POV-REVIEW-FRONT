import { test, expect, Page } from '@playwright/test';

const adminPersistedState = JSON.stringify({
  state: {
    user: {
      id: 'admin-1',
      name: 'Admin Tester',
      email: 'admin@test.com',
      roles: ['admin'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token: 'admin-token',
    isAuthenticated: true,
  },
  version: 0,
});

const mockUsers = [
  {
    id: 'u-1',
    name: 'Admin Tester',
    email: 'admin@test.com',
    roles: ['admin'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'u-2',
    name: 'User Example',
    email: 'user@example.com',
    roles: ['user'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seedAdmin(page: Page) {
  await page.addInitScript(
    ([authState, token]) => {
      window.localStorage.setItem('auth-storage', authState);
      window.localStorage.setItem('authToken', token);
    },
    [adminPersistedState, 'admin-token'],
  );
}

test.describe('Dashboard de Administración', () => {
  test('muestra la tabla de usuarios para un administrador', async ({ page }) => {
    await seedAdmin(page);

    await page.route('**/users?limit=50&offset=1', async (route) => {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(mockUsers),
      });
    });

    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Panel de Administración' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Admin Tester' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'User Example' })).toBeVisible();
  });

  test('permite cambiar el rol de un usuario regular', async ({ page }) => {
    await seedAdmin(page);

    await page.route('**/users?limit=50&offset=1', async (route) => {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(mockUsers),
      });
    });

    await page.route('**/users/u-2/roles', async (route) => {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...mockUsers[1],
          roles: ['admin'],
        }),
      });
    });

    await page.goto('/dashboard');

    await page.getByRole('button', { name: '👑 Admin' }).click();
    await expect(page.getByText('¡Éxito!')).toBeVisible();
  });

  test('permite eliminar a un usuario desde el dashboard', async ({ page }) => {
    await seedAdmin(page);

    await page.route('**/users?limit=50&offset=1', async (route) => {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(mockUsers),
      });
    });

    await page.route('**/users/u-2', async (route) => {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/dashboard');

    await page.getByRole('button', { name: '🗑️' }).last().click();
    await expect(page.getByText('Confirmar Eliminación')).toBeVisible();
    await page.getByRole('button', { name: 'Sí, confirmar' }).click();
    await expect(page.getByText('¡Éxito!')).toBeVisible();
  });
});

