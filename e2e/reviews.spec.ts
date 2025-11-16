import { test, expect, Page } from '@playwright/test';

const authToken = 'user-mock-token';
const credentials = {
  email: 'user@example.com',
  password: 'password123',
};

const baseUserProfile = {
  id: 'user-1',
  name: 'Review User',
  email: 'user@example.com',
  roles: ['user'],
};

async function loginAsUser(page: Page, movies: any[] = []) {
  await page.route('**/auth/login', async (route, request) => {
    const body = request.postDataJSON();
    expect(body).toEqual({
      email: credentials.email,
      password: credentials.password,
    });

    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        token: authToken,
        user: baseUserProfile,
      }),
    });
  });

  await page.route('**/users/profile', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(baseUserProfile),
      });
      return;
    }

    await route.continue();
  });

  await page.route('**/movies', async (route) => {
    if (route.request().resourceType() === 'document') {
      await route.continue();
      return;
    }

    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(movies),
      });
      return;
    }

    await route.continue();
  });

  await page.goto('/login');
  await page.getByLabel('Correo Electrónico').fill(credentials.email);
  await page.getByLabel('Contraseña').fill(credentials.password);
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.waitForURL('/movies');
}

test.describe('Sección de Reviews', () => {
  test('permite crear una review desde el detalle de una película', async ({ page }) => {
    await loginAsUser(page);

    const movieData = {
      id: 'movie-1',
      title: 'The Matrix',
      description: 'Película de ciencia ficción clásica.',
      director: 'Wachowski Sisters',
      releaseDate: new Date('1999-03-31').toISOString(),
      genre: 'sci-fi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const reviews: any[] = [];

    await page.route('**/movies/movie-1', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }

      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(movieData),
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
          body: JSON.stringify(reviews),
        });
        return;
      }

      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();

        const newReview = {
          id: 'review-2',
          rating: body.rating,
          comment: body.comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: 'user-1',
            name: 'Review User',
            email: 'user@example.com',
          },
          movie: {
            id: 'movie-1',
            title: 'The Matrix',
          },
        };

        reviews.push(newReview);

        await route.fulfill({
          status: 201,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(newReview),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/movies/movie-1');

    await expect(page.getByRole('heading', { name: 'The Matrix' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Reseñas (0)' })).toBeVisible();

    await page.getByRole('button', { name: '✍️ Escribir Reseña' }).click();
    await page.getByRole('button', { name: '⭐' }).nth(4).click();
    await page.getByLabel('Comentario').fill('Increíble película, visualmente impactante.');

    const createResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/reviews/movie/movie-1') && response.request().method() === 'POST',
    );

    await page.getByRole('button', { name: 'Publicar Reseña' }).click();
    await createResponse;

    await expect(page.getByText('Increíble película, visualmente impactante.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tu Reseña' })).toBeVisible();
  });
});
