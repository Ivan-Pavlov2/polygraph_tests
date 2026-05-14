import { ConfigDTO } from './Config.interface';

export default class ConfigModel implements ConfigDTO {
	static config: ConfigModel;
	URL: string = '';
	API_URL: string = '';

	keycloak = {
		isActive: true,
		user: '',
		password: '',
	};

	PLAYWRIGHT: {
		WORKERS?: number;
	} = {};

	constructor() {
		if (ConfigModel.config) {
			return ConfigModel.config;
		}

		const env = process.env || {};

		if (env.URL) {
			this.URL = env.URL;
		} else {
			throw new Error('".env" is not include URL=string');
		}

		if (env.API_URL) {
			this.API_URL = env.API_URL;
		}

		if ('KEYCLOAK_IS_ACTIVE' in env) {
			this.keycloak.isActive = env.KEYCLOAK_IS_ACTIVE === 'true';
		} else {
			this.keycloak.isActive = true;
		}

		if (this.keycloak.isActive) {
			if (env.KEYCLOAK_USER) {
				this.keycloak.user = env.KEYCLOAK_USER;
			} else {
				throw new Error('".env" is not include KEYCLOAK_USER=string');
			}

			if (env.KEYCLOAK_PASSWORD) {
				this.keycloak.password = env.KEYCLOAK_PASSWORD;
			} else {
				throw new Error('".env" is not include KEYCLOAK_PASSWORD=string');
			}
		}

		if ('PLAYWRIGHT_WORKERS' in env) {
			const number = Number(env.PLAYWRIGHT_WORKERS);

			if (isNaN(number)) {
				throw new Error('"PLAYWRIGHT_WORKERS" must be NaN');
			}

			this.PLAYWRIGHT.WORKERS = number;
		}

		ConfigModel.config = this;
	}
}
