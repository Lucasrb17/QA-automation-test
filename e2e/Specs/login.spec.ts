// apps/panel/e2e/specs/login.spec.ts
import { test, expect } from '@playwright/test';
import { mainUser } from '../constants/test-users';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('debería loguearse y ver la agenda', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(mainUser.email, mainUser.password);

    await page.waitForURL('**/bookings');
    await expect(page.getByRole('link', { name: 'Agenda' })).toBeVisible();
  });

  test('debería mostrar error si el email es inválido', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.completeFirstLoginStep('correo-incorrecto');

    await expect(loginPage.emailValidationError).toBeVisible();
    await expect(loginPage.passwordInput).not.toBeVisible();
  });

  test('debería mostrar error si la contraseña es incorrecta', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(mainUser.email, 'contraseña-mal');

    await expect(loginPage.passwordValidationError).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
