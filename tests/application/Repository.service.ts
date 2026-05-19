import { APIRequestContext, expect } from '@playwright/test';
import { AuthHeaders } from '../pageObjects/keycloak.page';
import ConfigModel from './Config.model';

export default class Repository {
	getApiUrl(subUrl: string): string {
		const config = new ConfigModel();

		return (config.API_URL ?? '') + subUrl;
	}

	async deleteInstance(request: APIRequestContext, headers: AuthHeaders, ids: string | string[]) {
		if (typeof ids === 'string') {
			ids = [ids];
		}

		const results = await Promise.all(ids.map((id) => request.delete(this.getApiUrl(`/instances/${id}`), headers)));
		results.forEach((result) => {
			expect(result.ok()).toBeTruthy();
		});
	};

	async deleteEntity(request: APIRequestContext, headers: AuthHeaders, id: string) {
		const url = this.getApiUrl(`/entities/${id}`);
		const result = await request.delete(url, headers);
		expect(result.ok()).toBeTruthy();
	}
	async deleteGroup(request: APIRequestContext, headers: AuthHeaders, id: string) {
		const url = this.getApiUrl(`/entity_groups/${id}`);
		const result = await request.delete(url, headers);
		expect(result.ok()).toBeTruthy();
	}

	async getAllInstanceIds(request: APIRequestContext, headers: AuthHeaders, entityId: string): Promise<string[]> {
		const url = this.getApiUrl(`/entities/${entityId}/instances?page=1&perPage=200`);
		const result = await request.get(url, headers);
		expect(result.ok()).toBeTruthy();
		const rows = (await result.json())?.instances;
		const ids = rows.map((row: { id: any; }) => row.id);
		// console.log(`entityId="${entityId}" instancesCount="${ids.length}"`, '\n' + ids.join('\n'));
		return ids;
	};
}
