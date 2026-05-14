export interface ConfigDTO {
	/**
	 * URL вебморды
	 */
	URL: string;

	/**
	 * Блок для авторизации
	 */
	keycloak: {
		isActive?: boolean;
		user: string;
		password: string;
	};
}
