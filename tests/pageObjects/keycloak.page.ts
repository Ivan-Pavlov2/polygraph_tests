import { expect, Locator, Page } from '@playwright/test';
import ConfigModel from '../application/Config.model';

export default class KeycloakPage {
	readonly page: Page;
	readonly loginWithRswId: Locator;
	readonly loginInput: Locator;
	readonly passwordInput: Locator;
	readonly signIn: Locator;

	constructor(page: Page) {
		this.page = page;

		this.loginWithRswId = page.getByRole('link', { name: 'RSW ID' });

		this.loginInput = page.locator('#username');
		this.passwordInput = page.locator('#password');
		this.signIn = page.locator('#kc-login');
	}

	async fillLoginInput(login: string): Promise<void> {
		await this.loginInput.fill(login);
	}

	async fillPasswordInput(password: string): Promise<void> {
		await this.passwordInput.fill(password);
	}

	async authenticate(): Promise<void> {
		const config = new ConfigModel();
		await this.loginWithRswId.click();

		await this.fillLoginInput(config.keycloak.user);
		await this.fillPasswordInput(config.keycloak.password);

		await this.signIn.click();

		// await this.page.waitForURL('/');
		// await expect(this.page).toHaveTitle(/Аналитика/);
	}

	static async catchToken(page: Page): Promise<AuthHeaders> {
		const config = new ConfigModel();
		if (!config.keycloak.isActive) {
			throw new Error('Авторизация отключена, ловля токена не должна использоваться');
		}

		const response = await page.waitForResponse('https://auth.royalsw.ru/realms/**/protocol/openid-connect/token');
		const result = await response.json();

		return {
			headers: {
				Authorization: 'Bearer ' + result.access_token,
			},
		};
	}
}

export interface AuthHeaders {
	headers: {
		Authorization: string;
	};
}
