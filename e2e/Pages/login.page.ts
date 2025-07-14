// apps/panel/e2e/pages/login.page.ts
import type { Page } from '@playwright/test';

export class LoginPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto() {
		await this.page.goto('/login');
	}

	async completeFirstLoginStep(email: string) {
		await this.page.getByTestId('email-input').fill(email);
		await this.page.getByRole('button', { name: 'Continuar' }).click();
	}

	async login(email: string, password: string) {
		await this.completeFirstLoginStep(email);
		await this.page.getByTestId('login-button').click();
		await this.page.getByRole('textbox', { name: 'Contraseña' }).fill(password);
		await this.page.getByTestId('password').locator('button').click();
		await this.page.getByTestId('login-button').click();
	}

	get emailValidationError() {
		return this.page.locator('.z-Text-root').filter({ hasText: 'Ingresá un e-mail válido' });
	}

	get passwordValidationError() {
		return this.page.locator('.z-Text-root').filter({ hasText: 'El e-mail y la contraseña no son correctas.' });
	}

	get passwordInput() {
		return this.page.getByRole('textbox', { name: 'Contraseña' });
	}

	get forgotPasswordButton() {
		return this.page.getByRole('button', { name: '¿Olvidaste tu contraseña?' });
	}

	get sendEmailButton() {
		return this.page.getByRole('button', { name: 'Enviar correo' });
	}

	get createAccountButton() {
		return this.page.getByRole('button', { name: 'Crear cuenta' });
	}
}
