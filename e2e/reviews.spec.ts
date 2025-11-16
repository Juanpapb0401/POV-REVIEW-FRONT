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
  test('muestra las reviews del usuario en su perfil', async ({ page }) => {
    await loginAsUser(page);

    const userWithReviews = {
      ...baseUserProfile,
      reviews: [
        {
          id: 'review-1',
          rating: 5,
          comment: 'Una de mis películas favoritas, llena de acción.',
          createdAt: new Date('2024-08-18T10:00:00Z').toISOString(),
          updatedAt: new Date('2024-08-18T10:00:00Z').toISOString(),
          movie: {
            id: 'movie-1',
            title: 'The Matrix',
          },
          user: {
            id: 'user-1',
            name: 'Review User',
            email: 'user@example.com',
          },
        },
      ],
    };

    await page.route('**/users/user-1', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }

      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(userWithReviews),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/my-reviews');
    await page.waitForURL('/my-reviews');

    await expect(page.getByRole('heading', { name: 'Mis Reviews' })).toBeVisible();
    await expect(page.getByText('The Matrix')).toBeVisible();
    await expect(page.getByText('Una de mis películas favoritas, llena de acción.')).toBeVisible();
    await expect(page.getByText('1 review en total')).toBeVisible();
    await expect(page.getByRole('button', { name: '✏️ Editar' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🗑️ Eliminar' })).toBeVisible();
  });

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

  test('muestra estado vacío y permite volver a películas cuando no hay reviews', async ({ page }) => {
    await loginAsUser(page);

    const userWithoutReviews = {
      ...baseUserProfile,
      reviews: [],
    };

    await page.route('**/users/user-1', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }

      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(userWithoutReviews),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/my-reviews');
    await page.waitForURL('/my-reviews');

    await expect(page.getByText('No has escrito ninguna review aún')).toBeVisible();

    const navigatePromise = page.waitForURL('/movies');
    await page.getByRole('button', { name: 'Ver Películas' }).click();
    await navigatePromise;
  });

  test('permite ir al detalle de la película desde mis reviews', async ({ page }) => {
    await loginAsUser(page);

    const userWithReviews = {
      ...baseUserProfile,
      reviews: [
        {
          id: 'review-1',
          rating: 4,
          comment: 'Excelente historia y efectos visuales.',
          createdAt: new Date('2024-09-10T18:30:00Z').toISOString(),
          updatedAt: new Date('2024-09-10T18:30:00Z').toISOString(),
          movie: {
            id: 'movie-1',
            title: 'The Matrix',
          },
          user: {
            id: 'user-1',
            name: 'Review User',
            email: 'user@example.com',
          },
        },
      ],
    };

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

    await page.route('**/users/user-1', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }

      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(userWithReviews),
        });
        return;
      }

      await route.continue();
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
          body: JSON.stringify(userWithReviews.reviews),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/my-reviews');
    await page.waitForURL('/my-reviews');

    const navigation = page.waitForURL('/movies/movie-1');
    await page.getByRole('button', { name: '✏️ Editar' }).click();
    await navigation;

    await expect(page.getByRole('heading', { name: 'The Matrix' })).toBeVisible();
  });
});
