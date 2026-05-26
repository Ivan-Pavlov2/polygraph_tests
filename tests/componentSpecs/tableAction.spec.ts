import { expect, Page, test as base } from '@playwright/test';
import Auth from '../pageObjects/auth.component';
import Application from '../pageObjects/application.page';


type FixturesTable = {
    auth: Auth;
    application: Application;
};

const test = base.extend<FixturesTable>({ 
    auth: async ({ page }, use) => {
        const auth = new Auth(page);
        await auth.login();
        await use(auth);
    },
    application: async ({ page}, use) => {
        const application = new Application(page);
        await use(application);
    }
});


test.describe('Работа с таблицей', async () => {
    test('Установление и снятие чек бокса', async ({ page, application, auth }) => {
        await application.chooseApplication.setChecked(true);
        await expect(application.chooseApplication).toBeChecked();
        await application.chooseApplication.setChecked(false);
        await application.chooseApplication.isDisabled();
    });

    test('Отображение стобцов', async ({ page, application, auth }) => {
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.cellBtn.click();
        await application.listCell.setChecked(false);
        await application.header.click();
        await expect(page.locator('[id^="cell-status"]').nth(0)).toBeHidden();
        await expect(page.locator('[id^="cell-phone"]').nth(0)).toBeVisible();
        await application.cellBtn.click();
        await application.listCell.setChecked(true);
        await application.header.click();
        await expect(page.locator('[id^="cell-status"]').nth(0)).toBeVisible();

        await application.cellBtn.click();
        await application.listCellAll.setChecked(false);
        await application.header.click();
        await expect(page.locator('[id^="cell-status"]').nth(0)).toBeHidden();
        await expect(page.locator('[id^="cell-phone"]').nth(0)).toBeHidden();
        await expect(page.locator('[id^="cell-number"]').nth(0)).toBeVisible();
        await application.cellBtn.click();
        await application.listCellAll.setChecked(true);
        await application.header.click();
        await expect(page.locator('[id^="cell-status"]').nth(0)).toBeVisible();
        await expect(page.locator('[id^="cell-phone"]').nth(0)).toBeVisible();
        await expect(page.locator('[id^="cell-number"]').nth(0)).toBeVisible();

        await application.cellBtn.click();
        await application.listCellAll.setChecked(false);
        await application.header.click();
        await expect(page.locator('[id^="cell-status"]').nth(0)).toBeHidden();
        await expect(page.locator('[id^="cell-phone"]').nth(0)).toBeHidden();
        await expect(page.locator('[id^="cell-number"]').nth(0)).toBeVisible();
        await application.cellBtn.click();
        await application.clearBtn.click();
        await application.header.click();
        await expect(page.locator('[id^="cell-status"]').nth(0)).toBeVisible();
        await expect(page.locator('[id^="cell-phone"]').nth(0)).toBeVisible();
        await expect(page.locator('[id^="cell-number"]').nth(0)).toBeVisible(); 
    });

    test('Комплексная проверка бесконечного скролла', async ({ page, application, auth }) => {
        await application.scroll.hover();
        await page.waitForTimeout(1000);

        
        // 1. Проверяем, что контейнер доступен для скролла
        await expect(application.scroll).toBeVisible();
            
        const canScroll = await application.scroll.evaluate(el => {
            return el.scrollHeight > el.clientHeight;
        });
        expect(canScroll).toBeTruthy();
        
        // 2. Основной цикл проверки скролла
        for (let j = 0; j < 5; j++) {
            const initialItems = await page.locator('.v-table__td').all();
            const initialLastItem = initialItems[initialItems.length - 1];
            const initialLastText = await initialLastItem.textContent();
        
            // Ожидаем возможный API запрос
            const responsePromise = page.waitForResponse(response => 
                response.url().includes('/api/claims?page') && response.status() === 200
            ).catch(() => null);
        
            // Выполняем скролл
            await page.locator('.v-table__container').evaluate(el => el.scrollBy(0, 1500));
            await page.waitForTimeout(1000);
        
            // Ждем либо ответа API, либо изменения DOM
            await Promise.race([
                responsePromise,
                page.waitForSelector('.v-table__td:not(:text-matches("' + initialLastText + '"))', { timeout: 5000 })
            ]);
        
            // 5. Проверяем результаты
            await expect(async () => {
            const newItems = await page.locator('.v-table__td').all();
                    
            const newLastItem = newItems[newItems.length - 1];
             const newLastText = await newLastItem.textContent();
            expect(newLastText).not.toEqual(initialLastText);
            }).toPass({ timeout: 8000 });
        
            // 6. Дополнительные проверки
            const scrollPosition = await application.scroll.evaluate(el => el.scrollTop);
            const scrollHeight = await application.scroll.evaluate(el => el.scrollHeight);
            console.log(`Итерация ${j + 1}: Позиция скролла ${scrollPosition}/${scrollHeight}`);
        
            // Проверяем видимость новых элементов
            const newLastItem = page.locator('.v-table__td').last();
            await expect(newLastItem).toBeVisible();
        }
    });

    test('Изменения ширины столбца таблицы', async ({ page, auth }) => {
        const table = page.locator('.v-table__thead');
        const columnHeader = page.locator('.v-table__th').nth(1); // Выбираем второй столбец
        const columnIcon = columnHeader.locator('.q-icon:text("more_vert")'); // Выбираем иконку второго столбеца
        const columnResizer = columnHeader.locator('.v-table__th__resize'); // Локатор для ресайзера
          
        // Получаем начальную ширину столбца
        await columnHeader.hover()
        await columnIcon.click();
        const initialWidth = await columnHeader.evaluate(el => el.clientWidth);
        console.log(`Начальная ширина столбца: ${initialWidth}px`);
        
        // Перемещаем мышь на 100px вправо для увеличения ширины
        await columnResizer.hover();
        await page.mouse.down();
        await page.mouse.move(await columnResizer.boundingBox().then(b => b.x + 100),await columnResizer.boundingBox().then(b => b.y));
        await page.mouse.up();
        
        // Проверяем, что ширина изменилась
        const newWidth = await columnHeader.evaluate(el => el.clientWidth);
        console.log(`Ширина столбца после увелечения: ${newWidth}px`);
        expect(newWidth).toBeGreaterThan(initialWidth);

        // Перемещаем мышь на 100px влево для уменьшения ширины
        await columnResizer.hover();
        await page.mouse.down();
        await page.mouse.move(await columnResizer.boundingBox().then(b => b.x - 100),await columnResizer.boundingBox().then(b => b.y));
        await page.mouse.up();

        // Проверяем, что ширина изменилась
        const oldWidth = await columnHeader.evaluate(el => el.clientWidth);
        console.log(`Ширина столбца после уменьшения: ${oldWidth}px`);
        expect(newWidth).toBeGreaterThan(oldWidth);
    });
});