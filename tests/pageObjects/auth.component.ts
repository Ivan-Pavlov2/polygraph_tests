import { expect, Locator, Page } from '@playwright/test';
import { PlaywrightWorkerOptions } from 'playwright/types/test';

export default class Auth {
    readonly page: Page;

    readonly loginWithRswId: Locator;
    readonly loginInput: Locator;
    readonly passwordInput: Locator;
    readonly signIn: Locator;

    readonly testData = {
        url: 'https://polygraph-dev.royalsw.ru/', // url контура на котором будут запускатся тесты
        // Данные основного пользоватея с ролью технического администратора, который будет выполнять все проверки
        emailInput: 'ipavlov@royalsw.me', // Логин администратора
        passwordlInput: 'leonid2002', // Пароль администратора
    };


    constructor(page: any) {
        this.page = page;
        this.loginWithRswId = page.getByRole('link', { name: 'RSW ID' });
        this.loginInput = page.locator('#username');
		this.passwordInput = page.locator('#password');
		this.signIn = page.locator('#kc-login');

    }
  
    async login() {
        await this.page.goto(this.testData.url);
        await this.page.waitForTimeout(1000);
        await this.loginWithRswId.click();
        await this.loginInput.fill(this.testData.emailInput);
        await this.passwordInput.fill(this.testData.passwordlInput);
        await this.signIn.click();
        await this.page.waitForTimeout(1000);
    }  
}


