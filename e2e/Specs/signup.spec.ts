// apps/panel/e2e/specs/signup.spec.ts
import { test, expect } from '@playwright/test';
import { mainUser } from '../constants/test-users';

function generateEmailFromTime(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `usuario_${hh}${mi}${ss}@gmail.com`;
}

function generateRandomPhone(): string {
  const random = Math.floor(10000000 + Math.random() * 90000000); // 8 dígitos aleatorios
  return `011${random}`;
}

test('flujo de creación de cuenta nueva', async ({ page }) => {
  const timestampEmail = generateEmailFromTime();
  const telefono = generateRandomPhone();

  await page.goto('https://dashboard-local.zala.app:4002/signup');
  await expect(page.getByRole('heading', { name: 'Creá tu cuenta' })).toBeVisible();

  // Intentar continuar sin completar nada
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByText('Ingresá tu nombre')).toBeVisible();
  await expect(page.getByText('Ingresá tu apellido')).toBeVisible();
  await expect(page.getByText('Ingresá tu email')).toBeVisible();
  await expect(page.getByText('Ingresá tu teléfono')).toBeVisible();

  // Completar campos con error de email
  await page.getByTestId('first-name-input').fill(mainUser.firstName);
  await page.getByTestId('last-name-input').fill(mainUser.lastName);
  await page.getByTestId('email-input').fill('mal email');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByText('Ingresá un e-mail válido')).toBeVisible();

  // Completar email válido y teléfono
  await page.getByTestId('email-input').fill(timestampEmail);
  await page.getByTestId('phone-number-input').fill(telefono);
  await page.getByRole('button', { name: 'Continuar' }).click();

  // Validación de contraseña débil
  await page.getByTestId('password').getByRole('textbox', { name: 'Contraseña' }).fill('abc12345');
  await expect(page.getByTestId('password').getByText('Contraseña *')).toBeVisible();
  await expect(page.getByText('Un mínimo 8 caracteres')).toBeVisible();
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page.getByText('El formato de la contraseña')).toBeVisible();

  // Contraseña correcta y repetir contraseña
  const passInput = page.getByTestId('password').getByRole('textbox', { name: 'Contraseña' });
  await passInput.fill('');
  await passInput.press('CapsLock');
  await passInput.fill('A');
  await passInput.press('CapsLock');
  await passInput.fill(mainUser.password);

  const repeatPassInput = page.getByRole('textbox', { name: 'Repetí la contraseña' });
  await repeatPassInput.click();
  await repeatPassInput.fill('A');
  await repeatPassInput.press('CapsLock');
  await repeatPassInput.fill(mainUser.password);

  // Crear cuenta
  await page.getByRole('button', { name: 'Crear cuenta' }).click();

  // Confirmación de redirección a onboarding
  await page.waitForURL('https://dashboard-local.zala.app:4002/onboarding');
  await expect(page.getByRole('heading', { name: '¡Bienvenido a Zala!' })).toBeVisible();
});