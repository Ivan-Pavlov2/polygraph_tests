import { expect, Locator, Page } from "@playwright/test";
import Application from "./application.page";

export default class Research {

	readonly page: Page;
	readonly application: Application;

	
	

    constructor(page: Page, application: Application ) {
		  this.page = page;
		  this.application = application;


	  }

	async fillApplicantInfo() {
		await this.page.locator('div').filter({ hasText: /^ФИО заявителя \*closekeyboard_arrow_down$/ }).locator('div').nth(2).click();
    await this.page.getByRole('option', { name: 'Тестов Тест Тестович' }).locator('div').nth(2).click();
  }

  async chekAbsence(reason: string) {
    await this.page.getByRole('checkbox', { name: reason }).click();

    // await this.fillApplicantInfo();

    await this.application.saveBtn.click();
    await this.page.waitForTimeout(1000);


    await this.page.getByPlaceholder('Введите фио кандидата, фио заявителя, номер заявки').fill('Тестович');
    await this.page.waitForTimeout(1000);
    await this.page.getByPlaceholder('Введите фио кандидата, фио заявителя, номер заявки').press('Enter');
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByText(reason)).toBeVisible(); 
  }

}

export const reasonsData = [
    'Медицинский отвод',
    'Не явился кандидат'
  ];
