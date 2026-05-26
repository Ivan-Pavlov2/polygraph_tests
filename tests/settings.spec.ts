import { expect, Page, test as base } from '@playwright/test';
import Auth from './pageObjects/auth.component';
import Setting, { directoriesData } from './pageObjects/setting.page';

type FixturesSetting = {
    auth: Auth;
    setting: Setting;
};

const test = base.extend<FixturesSetting>({ 
    auth: async ({ page }, use) => {
        const auth = new Auth(page);
        await auth.login();
        await use(auth);
    },
    setting: async ({ page}, use) => {
        const setting = new Setting(page);
        await use(setting);
    }
});


test.describe('Комплексное тестирование настроек системы', () => {

    for (const directory of directoriesData) {
        test(`Полный цикл тестирования: ${directory.name}`, async ({ page, auth, setting }) => {
            const fields = directory.fields(page);
            const editFields = directory.editFields ? directory.editFields(page) : fields;

            // ========== ТЕСТ 1: ПЕРЕХОД К СПРАВОЧНИКУ ==========
            await setting.goToSection(directory.name);
            await page.waitForTimeout(1000);

            // ========== ТЕСТ 2: СОЗДАНИЕ ЗАПИСИ ==========
            await setting.addBtn.click();
            await page.waitForTimeout(1000);
            await setting.fillCatalog(fields);
            await setting.createBtn.click();
            await page.waitForTimeout(1000);

            // ========== ТЕСТ 3: РЕДАКТИРОВАНИЕ ЗАПИСИ ==========
            await page.waitForTimeout(1000);
            await setting.goToEdit(fields[0].value);
            await setting.fillCatalog(editFields);
            await setting.saveBtn.click();
            await page.waitForTimeout(1000);

            await expect(page.getByRole('row', { name: editFields[0].value }).getByRole('button')).toBeVisible();

            // ========== ТЕСТ 4: УДАЛЕНИЕ ЗАПИСИ ==========
            await setting.goToDelete(editFields[0].value);
            await page.waitForTimeout(1000);

            await expect(page.getByRole('row', { name: editFields[0].value }).getByRole('button')).toBeHidden();
        });
    }
});