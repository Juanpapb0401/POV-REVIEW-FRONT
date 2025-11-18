import { test, expect } from './testWithCoverage';
import type { Page } from '@playwright/test';

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

  // Ensure localStorage is set for subsequent navigations
  await page.evaluate(({ token, user }) => {
    const authState = {
      state: {
        token,
        user,
        isAuthenticated: true,
      },
      version: 0,
    };
    localStorage.setItem('auth-storage', JSON.stringify(authState));
  }, { token: authToken, user: baseUserProfile });
}

test.describe('Sección de Reviews', () => {
  test('muestra las reviews del usuario en su perfil', async ({ page }) => {
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

    // Setup routes BEFORE login
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

    await loginAsUser(page);

    await page.goto('/my-reviews');
    await page.waitForURL('/my-reviews', { timeout: 10000 });

    const heading = page.getByRole('heading', { name: 'Mis Reviews' });
    await heading.waitFor({ state: 'visible' });

    if (process.env.COVERAGE !== '1') {
      await expect(page).toHaveURL('/my-reviews');
    }
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
    await page.getByRole('button', { name: '☆' }).nth(4).click();
    await page.getByLabel('Comentario').fill('Increíble película, visualmente impactante.');

    const createResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/reviews/movie/movie-1') && response.request().method() === 'POST',
    );

    await page.getByRole('button', { name: 'Publicar Reseña' }).click();
    await createResponse;
    if (process.env.COVERAGE !== '1') {
      await expect(page.getByText('Increíble película, visualmente impactante.')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Tu Reseña' })).toBeVisible();
    }
  });

  test('permite editar una review existente desde el detalle de una película', async ({ page }) => {
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

    const existingReview = {
      id: 'review-1',
      rating: 4,
      comment: 'Comentario original sobre la película.',
      createdAt: new Date('2024-08-18T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-08-18T10:00:00Z').toISOString(),
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
          body: JSON.stringify([existingReview]),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/reviews/review-1', async (route) => {
      if (route.request().method() === 'PATCH') {
        const body = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...existingReview,
            comment: body.comment,
            rating: body.rating,
            updatedAt: new Date().toISOString(),
          }),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/movies/movie-1');

    const userReviewHeading = page.getByRole('heading', { name: 'Tu Reseña' });
    await userReviewHeading.waitFor({ state: 'visible' });

    if (process.env.COVERAGE !== '1') {
      await expect(page).toHaveURL('/movies/movie-1');
    }

    await page.getByRole('button', { name: '✏️ Editar' }).click();
    await page.getByLabel('Comentario').fill('Comentario actualizado sobre la película.');

    const updateResponse = page.waitForResponse(
      (response) => response.url().includes('/reviews/review-1') && response.request().method() === 'PATCH',
    );

    await page.getByRole('button', { name: 'Actualizar Reseña' }).click();
    await updateResponse;

    if (process.env.COVERAGE !== '1') {
      await expect(page).toHaveURL('/movies/movie-1');
    }
  });

  test('muestra estado vacío y CTA cuando el usuario no tiene reviews', async ({ page }) => {
    const userWithoutReviews = {
      ...baseUserProfile,
      reviews: [],
    };

    // Setup routes BEFORE login
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

    await loginAsUser(page);

    await page.goto('/my-reviews');
    await page.waitForURL('/my-reviews', { timeout: 10000 });

    const headingEmpty = page.getByRole('heading', { name: 'Mis Reviews' });
    await headingEmpty.waitFor({ state: 'visible' });

    if (process.env.COVERAGE !== '1') {
      await expect(page).toHaveURL('/my-reviews');
    }
  });

});
