import { test, expect } from '@playwright/test';

test('flujo completo de onboarding luego de crear cuenta', async ({ page }) => {
  // Variables dinámicas
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${hh}${mm}${ss}`;

  const email = `usuario_${timestamp}@gmail.com`;
  const telefono = '011' + Math.floor(10000000 + Math.random() * 90000000);
  const nombreNegocio = `Random${timestamp}`;

  // Registro de usuario
  await page.goto('https://dashboard-local.zala.app:4002/signup');
  await page.getByTestId('first-name-input').fill('lucas');
  await page.getByTestId('last-name-input').fill('romero');
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('phone-number-input').fill(telefono);
  await page.getByRole('button', { name: 'Continuar' }).click();

  // Contraseña
  const passwordInput = page.getByTestId('password').getByRole('textbox', { name: 'Contraseña' });
  await passwordInput.press('CapsLock');
  await passwordInput.fill('A');
  await passwordInput.press('CapsLock');
  await passwordInput.fill('Abc12345');

  const repeatPasswordInput = page.getByRole('textbox', { name: 'Repetí la contraseña' });
  await repeatPasswordInput.fill('A');
  await repeatPasswordInput.press('CapsLock');
  await repeatPasswordInput.fill('Abc12345');

  await page.getByRole('button', { name: 'Crear cuenta' }).click();

  // Onboarding
  await page.waitForURL('https://dashboard-local.zala.app:4002/onboarding');
  await expect(page.getByRole('heading', { name: '¡Bienvenido a Zala!' })).toBeVisible();
  await expect(page.getByText('¿Cuál es tu actividad')).toBeVisible();

  await page.getByRole('radio', { name: 'Baño y peluquería de mascotas' }).click();
  await page.getByRole('textbox', { name: '¿Cómo se llama tu negocio?' }).fill(nombreNegocio);
  await page.getByRole('radio', { name: 'Trabajo de forma individual' }).click();
  await page.waitForTimeout(6000);
  await page.getByRole('button', { name: 'Siguiente' }).click();
  
  
  // Validaciones obligatorias
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await expect(page.getByText('Completá el nombre del')).toBeVisible();
  await expect(page.getByText('Elegí al menos una ubicación')).toBeVisible();

  // Servicio y ubicación
  await page.getByRole('textbox', { name: 'Nombre del servicio principal' }).fill('random123');
  await page.getByRole('checkbox', { name: 'En mi local' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await expect(page.getByText('Requerido').first()).toBeVisible();
  await expect(page.getByText('Requerido').nth(1)).toBeVisible();

  await page.getByTestId('address.address1').fill('alle12');
  await page.getByTestId('address.address2').fill('344');
  await page.getByTestId('address.city').fill('allec1');
  await page.getByRole('textbox', { name: 'Cód. Postal' }).fill('234');
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();

  // Costo del servicio
  await expect(page.getByText('Completá el costo del servicio')).toBeVisible();
  await page.locator('div').filter({ hasText: /^LunesMartesMiercolesJuevesViernes$/ }).nth(1).click();
  await page.getByRole('option', { name: 'Sábado' }).click();
  await page.getByRole('option', { name: 'Domingo' }).click();
  await expect(page.locator('#root').getByText('Sábado')).toBeVisible();
  await expect(page.locator('#root').getByText('Domingo')).toBeVisible();

  await page.getByTestId('price').fill('9999');
  await page.getByRole('button', { name: 'Siguiente' }).click();

  // Marca
  await expect(page.getByRole('heading', { name: 'Personalización de marca' })).toBeVisible();
  await page.locator('div').filter({ hasText: /^Vista previa clara$/ }).locator('svg').click();
  await page.locator('div').filter({ hasText: /^Vista previa oscura$/ }).locator('path').first().click();
  await expect(page.getByRole('heading', { name: 'Vista previa clara' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Instagram' }).fill('random123');
  await page.locator('div').filter({ hasText: /^Subí el logo$/ }).nth(1).click();

  // Finalizar
  await page.getByRole('button', { name: 'Crear negocio' }).click();
});