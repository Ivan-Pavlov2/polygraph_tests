import { expect, Page, test as base } from '@playwright/test';
import Auth from './auth.component';
import Research, { reasonsData } from './pageObjects/research.page';
import Application from './pageObjects/application.page';

type FixturesResearch = {
    auth: Auth;
    application: Application;
    research: Research;
};

const test = base.extend<FixturesResearch>({ 
    auth: async ({ page }, use) => {
        const auth = new Auth(page);
        await auth.login();
        await use(auth);
    },
    application: async ({ page}, use) => {
        const application = new Application(page);
        await use(application);
    },
    research: async ({ page, application }, use) => {
        const research = new Research(page, application);
        await use(research);
    }
});


test.describe('Проведение исследования', () => {

    for (const reason of reasonsData) {
        test(`Проверка причины: ${reason}`, async ({ page, auth, application, research }) => {
            await application.createApplication();
            await application.assignmentApplication();

            await application.createBtn.nth(0).waitFor({ state: 'visible' });
            await application.actionBtn.nth(27).click();
            await application.editBtn.waitFor({ state: 'visible' });
            await application.editBtn.click();
            await expect(page.getByText('Редактирование заявки')).toBeVisible();

            await research.chekAbsence(reason);
            
            await application.actionBtn.nth(27).click();
            await application.deleteSection.waitFor({ state: 'visible' });
            await application.deleteSection.click();
            await expect(page.getByText('Удаление')).toBeVisible();
            await application.deleteBtn.click();

            await page.getByPlaceholder('Введите фио кандидата, фио заявителя, номер заявки').click();
            await page.getByRole('button').filter({ hasText: 'close' }).click();
        });
    }

    test(`Проверка назначения времени`, async ({ page, auth, application, research }) => {
        await application.createApplication();
        await application.assignmentApplication();
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.actionBtn.nth(27).click();
        await application.editBtn.waitFor({ state: 'visible' });
        await application.editBtn.click();
        await expect(page.getByText('Редактирование заявки')).toBeVisible();


        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        await page.getByRole('button', { name: 'Старт' }).click();
        await expect(page.getByRole('textbox', { name: 'Время начала исследования' })).toHaveValue(currentTime);
        await page.getByRole('button', { name: 'Стоп' }).click();
        await expect(page.getByRole('textbox', { name: 'Время окончания исследования' })).toHaveValue(currentTime);
    });
});