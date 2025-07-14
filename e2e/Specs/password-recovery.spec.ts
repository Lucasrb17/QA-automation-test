// apps/panel/e2e/specs/password-recovery.spec.ts
import { test, expect } from '@playwright/test';
import { recoveryUser } from '../constants/test-users';

test.describe('Recuperación de contraseña', () => {
  test('debería mostrar la página de confirmación luego de solicitar el correo', async ({ page }) => {
    await page.goto('https://dashboard-local.zala.app:4002/login');

    // Completar email
    await page.getByTestId('email-input').fill(recoveryUser.email);
    await page.getByRole('button', { name: 'Continuar' }).click();

    // Click en "¿Olvidaste tu contraseña?"
    await page.getByText('¿Olvidaste tu contraseña?').click();

    // Verificamos que estamos en la página correcta
    await expect(page.locator('#root')).toContainText('¿Olvidó su contraseña?');
    await expect(page.getByText(recoveryUser.email)).toBeVisible();

    // Enviar correo
    await page.getByRole('button', { name: 'Enviar correo' }).click();

    // Confirmación visible
    await expect(page.getByRole('button', { name: 'Confirmar' })).toBeVisible();
  });
});