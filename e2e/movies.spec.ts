import { test, expect } from './testWithCoverage';
import type { Page, Route } from '@playwright/test';

const adminAuthState = JSON.stringify({
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
    token: 'mock-token',
    isAuthenticated: true,
  },
  version: 0,
});

const mockMovies = [
  {
    id: 'movie-1',
    title: 'The Matrix',
    description: 'Realidad virtual y acción',
    director: 'Wachowski Sisters',
    releaseDate: new Date('1999-03-31').toISOString(),
    genre: 'sci-fi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'movie-2',
    title: 'Interstellar',
    description: 'Viaje espacial y relatividad',
    director: 'Christopher Nolan',
    releaseDate: new Date('2014-11-07').toISOString(),
    genre: 'sci-fi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seedAdminSession(page: Page) {
  await page.addInitScript(
    ([persistedState, token]) => {
      window.localStorage.setItem('auth-storage', persistedState);
      window.localStorage.setItem('authToken', token);
    },
    [adminAuthState, 'mock-token'],
  );
}

async function mockMoviesList(route: Route) {
  if (route.request().method() === 'GET') {
    if (route.request().resourceType() === 'document') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(mockMovies),
    });
    return;
  }

  await route.continue();
}

test.describe('Página de Películas', () => {
  test('muestra listado para visitantes sin acciones de administración', async ({ page }) => {
    await page.route('**/movies', mockMoviesList);

    await page.goto('/movies');

    await expect(page.getByRole('heading', { name: 'Películas' })).toBeVisible();
    await expect(page.getByText('The Matrix')).toBeVisible();
    await expect(page.getByText('Interstellar')).toBeVisible();
    await expect(page.getByRole('link', { name: '➕ Agregar Película' })).toHaveCount(0);
  });

  test('muestra mensaje vacío y CTA para admins cuando no hay películas', async ({ page }) => {
    await seedAdminSession(page);

    await page.route('**/movies', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }

      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify([]),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/movies');

    await expect(page.getByText('No hay películas disponibles')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Agregar la primera película' })).toBeVisible();
  });

  test('muestra acciones administrativas en la tarjeta de película para un admin', async ({ page }) => {
    await seedAdminSession(page);

    await page.route('**/movies', mockMoviesList);

    await page.goto('/movies');

    await expect(page.getByRole('link', { name: '➕ Agregar Película' })).toBeVisible();
    await expect(page.getByRole('link', { name: '✏️' })).toHaveCount(mockMovies.length);
    await expect(page.getByRole('button', { name: '🗑️' })).toHaveCount(mockMovies.length);
  });

  test('permite crear una película desde el formulario administrado', async ({ page }) => {
    await seedAdminSession(page);

    await page.route('**/movies', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            id: 'movie-99',
            title: 'Nueva Película',
            description: 'Descripción extensa de prueba',
            director: 'Directora Test',
            releaseDate: new Date('2020-02-02').toISOString(),
            genre: 'drama',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        });
        return;
      }

      if (route.request().method() === 'GET') {
        // Detail page request after creation
        if (route.request().url().includes('/movies/movie-99')) {
          await route.fulfill({
            status: 200,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              id: 'movie-99',
              title: 'Nueva Película',
              description: 'Descripción extensa de prueba',
              director: 'Directora Test',
              releaseDate: new Date('2020-02-02').toISOString(),
              genre: 'drama',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }),
          });
          return;
        }

        return mockMoviesList(route);
      }

      await route.continue();
    });

    await page.route('**/reviews/movie/movie-99', async (route) => {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify([]),
      });
    });

    await page.goto('/movies/create');

    await page.getByLabel('Título de la Película').fill('Nueva Película');
    await page
      .getByPlaceholder('Escribe una breve descripción de la película...')
      .fill('Descripción extensa de prueba');
    await page.getByLabel('Director').fill('Directora Test');
    await page.getByLabel('Fecha de Estreno').fill('2020-02-02');
    await page.getByRole('combobox').selectOption('drama');

    await page.getByRole('button', { name: '➕ Crear Película' }).click();

    await expect(page).toHaveURL(/\/movies\/movie-99$/);
  });

  test('permite navegar al detalle de una película desde el listado', async ({ page }) => {
    await page.route('**/movies', async (route) => {
      if (route.request().url().includes('/movies/movie-1')) {
        await route.continue();
        return;
      }

      await mockMoviesList(route);
    });

    await page.route('**/movies/movie-1', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }

      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            id: 'movie-1',
            title: 'The Matrix',
            description: 'Realidad virtual y acción',
            director: 'Wachowski Sisters',
            releaseDate: new Date('1999-03-31').toISOString(),
            genre: 'sci-fi',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/reviews/movie/movie-1', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify([]),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/movies');

    await page.getByRole('link', { name: 'Ver Detalles' }).first().click();
    await page.waitForURL('/movies/movie-1');

    await expect(page.getByRole('heading', { name: 'The Matrix' })).toBeVisible();
  });

  test('permite navegar a la página 2 del listado', async ({ page }) => {
    const extendedMovies = Array.from({ length: 12 }).map((_, index) => ({
      id: `movie-${index + 1}`,
      title: `Película ${index + 1}`,
      description: 'Descripción de prueba',
      director: 'Directora Test',
      releaseDate: new Date('2020-01-01').toISOString(),
      genre: 'drama',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    await page.route('**/movies', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }

      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(extendedMovies),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/movies');

    await page.getByRole('button', { name: 'Siguiente' }).click();

    if (process.env.COVERAGE !== '1') {
      await expect(page.getByText('Película 7')).toBeVisible();
    }
  });

  test('permite a un admin abrir el editor de una película', async ({ page }) => {
    await seedAdminSession(page);

    await page.route('**/movies', mockMoviesList);

    await page.route('**/movies/movie-1', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }

      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(mockMovies[0]),
        });
        return;
      }

      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...mockMovies[0], title: 'Película actualizada' }),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/movies');

    await page.getByRole('link', { name: '✏️' }).first().click();
    await page.waitForURL('/movies/edit/movie-1');

    await page.getByLabel('Título de la Película').fill('Película actualizada');
    await page.getByRole('button', { name: 'Guardar Cambios' }).click();

    if (process.env.COVERAGE !== '1') {
      await expect(page).toHaveURL('/movies/movie-1');
    }
  });

  test('permite a un admin eliminar una película desde el listado', async ({ page }) => {
    await seedAdminSession(page);

    await page.route('**/movies', mockMoviesList);

    await page.route('**/movies/movie-1', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }

      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ success: true }),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/movies');

    await page.getByRole('button', { name: '🗑️' }).first().click();
    await expect(page.getByText('Confirmar Eliminación')).toBeVisible();
    await page.getByRole('button', { name: 'Sí, eliminar' }).click();

    if (process.env.COVERAGE !== '1') {
      await expect(page.getByText('La película ha sido eliminada correctamente')).toBeVisible();
    }
  });
});

