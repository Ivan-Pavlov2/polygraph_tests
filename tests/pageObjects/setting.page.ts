import { expect, Locator, Page } from "@playwright/test";

export default class Setting {

	readonly page: Page;

	readonly addBtn: Locator;
	readonly saveBtn: Locator;
	readonly createBtn: Locator;
	
	

    constructor(page: Page) {
		this.page = page;

        this.addBtn = page.getByRole('button', { name: 'Создать' }).nth(0);
        this.saveBtn = page.getByRole('button', { name: 'Сохранить' }).nth(0);
        this.createBtn = page.locator('#q-portal--dialog--1').getByRole('button', { name: 'Создать' });

	}

	async goToSection(sectionName: string) {
		await this.page.getByRole('button', { name: 'Расширять' }).click();  
        await this.page.getByText(`fiber_manual_record${sectionName}`).click();
    }

	async goToEdit(fieldName: string) {
		await this.page.getByRole('row', { name: fieldName }).getByRole('button').click();
    await this.page.getByText('Редактировать').click();
    }

	async goToDelete(fieldName: string) {
		await this.page.getByRole('row', { name: fieldName }).getByRole('button').click();
		await this.page.getByText('Удалить').click();
		await this.page.getByRole('button', { name: 'Удалить' }).click();
    }

	async fillCatalog(items: CatalogInput) {
    for (const item of items) {
        if (item.isDropdown) {
			      await this.page.getByText(`${item.selector} *keyboard_arrow_down`).click();
            await this.page.getByRole('option', { name: item.value }).locator('div').nth(2).click();
            }
          else {
            await this.page.getByRole('textbox', { name: item.selector }).fill(item.value);
          }
      }
  }

}

export type CatalogInput = Array<{
    selector: string;
    value: string;
    isDropdown?: boolean;
}>;

export interface DirectoryTestConfig {
    name: string;
    // sectionPath: string[]; 
    fields: (page: Page) => CatalogInput;
    editFields: (page: Page) => CatalogInput;
}

export const directoriesData: DirectoryTestConfig[] = [
    {
        name: 'Заявители',
        fields: (page: Page): CatalogInput => [
          { selector: 'Фамилия', value: 'Синицин' },
          { selector: 'Имя', value: 'Евгений' },
          { selector: 'Отчество', value: 'Натальевич' },
          { selector: 'Наименование юридического лица заявителя', value: 'ЗАО Елена', isDropdown: true },
          { selector: 'Департамент/ Управление', value: 'Департамент птиц' },
          { selector: 'Должность', value: 'Зоолог' },
          { selector: 'Email', value: 'e.zoo@gmail.com' },
        ],
        editFields: (page: Page): CatalogInput => [
          { selector: 'Фамилия', value: 'Долгопят' },
          { selector: 'Имя', value: 'Роман' },
        ],
    },

	{
        name: 'Организации',
        fields: (page: Page): CatalogInput => [
          { selector: 'Полное наименование', value: 'Синицин' },
          { selector: 'Краткое наименование', value: 'Евгений' }
        ],
        editFields: (page: Page): CatalogInput => [
          { selector: 'Полное наименование', value: 'Долгопят' },
          { selector: 'Краткое наименование', value: 'Роман' },
        ],
    },

	{
        name: 'Должности',
        fields: (page: Page): CatalogInput => [
          { selector: 'Название должности', value: 'Зоолог' },
        ],
        editFields: (page: Page): CatalogInput => [
          { selector: 'Название должности', value: 'Культуролог' },
        ],
    },
];