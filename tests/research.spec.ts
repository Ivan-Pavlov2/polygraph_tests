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

    test('test', async ({ page }) => {
        await page.getByRole('row', { name: '749' }).getByRole('button').click();
        await page.getByText('Редактировать заявку').click();
        await page.getByRole('checkbox', { name: 'Медицинский отвод' }).click();
        await page.getByRole('checkbox', { name: 'Медицинский отвод' }).click();
        await page.getByRole('checkbox', { name: 'Не явился кандидат' }).click();
        await page.getByRole('checkbox', { name: 'Не явился кандидат' }).click();
        await page.getByRole('checkbox', { name: 'Исследование проведено' }).click();
        await page.getByRole('checkbox', { name: 'Заключение готово' }).click();
        await page.getByRole('textbox', { name: 'Время начала исследования' }).click();
        await page.getByRole('button', { name: 'Стоп' }).click();
        await page.getByRole('textbox', { name: 'Время окончания исследования' }).click();
        await page.getByText('Загрузите резюме кандидата').click();
        await page.getByText('Загрузите заключение полиграфолога').click();
        await page.locator('div').filter({ hasText: 'Редактирование заявкиclose' }).nth(2).setInputFiles('Титульный_лист_отчета_по_практике_Шаблон.docx');
        await page.locator('#q-portal--dialog--2 form').getByRole('button').filter({ hasText: 'close' }).click();
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await page.locator('div').filter({ hasText: /^ФИО заявителя \*closekeyboard_arrow_down$/ }).locator('div').nth(2).click();
        await page.getByRole('option', { name: 'Иванов Иван' }).locator('div').nth(2).click();
        await page.getByRole('textbox', { name: 'Департамент/ Управление' }).click();
        await page.getByRole('textbox', { name: 'Должность заявителя' }).click();
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await page.getByRole('textbox', { name: 'Департамент/ Управление' }).click();
    });

    for (const reason of reasonsData) {
        test(`Проверка причины: ${reason}`, async ({ page, auth, application, research }) => {
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