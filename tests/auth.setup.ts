import { test as setup } from '@playwright/test';
import ConfigModel from './application/Config.model';
import KeycloakPage from './pageObjects/keycloak.page';
import path from 'path';
import Logger from './application/Logger.service';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('keycloak authorization', async ({ page }) => {
	const config = new ConfigModel();
	const keycloakPage = new KeycloakPage(page);

	if (!config.keycloak.isActive) {
		Logger.log('Авторизация в keycloak отключена');
		return;
	} else {
		await page.goto('/');
		await keycloakPage.authenticate();

		// Установить одно общее состояние авторизации
		await page.context().storageState({ path: authFile });
	}

	// Если будет нужно установить несколько разных состояний для авторизации https://playwright.dev/docs/auth#moderate-one-account-per-parallel-worker
});
