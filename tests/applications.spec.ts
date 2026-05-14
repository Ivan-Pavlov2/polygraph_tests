import { expect, Page, test } from '@playwright/test';
import Application from './pageObjects/application.page';
import { table } from 'console';
import { TIMEOUT } from 'dns';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Обработка заявок', async () => {
	test('Установление и снятие чек бокса', async ({ page }) => {
        const application = new Application(page);
        
        await application.chooseApplication.setChecked(true);
        await expect(application.chooseApplication).toBeChecked();
        await application.chooseApplication.setChecked(false);
        await application.chooseApplication.isDisabled();
	});

    test('Отображение стобцов', async ({ page }) => {
        const application = new Application(page);

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

    test('Комплексная проверка бесконечного скролла', async ({ page }) => {
        const application = new Application(page);
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

    test('Изменения ширины столбца таблицы', async ({ page }) => {
          
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

    test('Создание заявки', async ({ page }) => {
        const application = new Application(page);
                
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.createBtn.nth(0).click();
        await expect(page.getByText('Создание заявки')).toBeVisible();
        await application.legalEntity.click();
        await application.legalEntityName1.click();
        await page.getByText('Создание заявки').click();
        await application.applicant.click();
        await application.applicantName1.click();
        await application.applicantJob.fill('Тестировщик');
        await application.surname.fill('Тестовый');
        await application.name.fill('Авто');
        await application.patronymic.fill('Тест');
        await application.job.click();
        await application.jobName.click();
        await application.bithdayPlace.fill('Москва');
        await application.phoneNumber.fill('89661326768');
        await application.email.fill('avtotest@mail.ru');
        await application.birthday.click();
        await page.getByRole('button', { name: '1' }).nth(0).click();
        await page.getByText('Создание заявки').click();
        await application.createBtn.nth(1).click();
        await page.waitForTimeout(3000);
        await expect(page.locator('[id^="cell-contactPersonJobPosition"]').nth(0)).toHaveText('Тестировщик');
    });

    test('Редактирование заявки', async ({ page }) => {
        const application = new Application(page);
                
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.actionBtn.nth(26).click();
        await application.editBtn.waitFor({ state: 'visible' });
        await application.editBtn.click();
        await expect(page.getByText('Редактирование заявки')).toBeVisible();
        await application.legalEntityForEdit.click();
        await application.legalEntityName.click();
        await page.getByText('Редактирование заявки').click();
        await application.applicant.click();
        await application.applicantName.click();
        await application.placeJob.fill('Департамент образования и контроля за детьми');
        await application.applicantJob.fill('Тестировщица');
        await application.applicantEmail.fill('testEdit@mail.ru');
        await application.surname.fill('Тестовик');
        await application.name.fill('Авто');
        await application.patronymic.fill('Редактор');
        await application.job.click();
        await application.jobName1.click();
        await application.bithdayPlace.fill('Коморка');
        await application.phoneNumber.fill('89661326666');
        await application.email.fill('avtotestedit@mail.ru');
        await application.birthday.click();
        await page.getByRole('button', { name: '3' }).nth(0).click();
        await application.saveBtn.click();
        await page.waitForTimeout(3000);
        await expect(page.locator('[id^="cell-organizationName"]').nth(0)).toHaveText('ЗАО Елена');
        await expect(page.locator('[id^="cell-contactPersonJobPosition"]').nth(0)).toHaveText('Тестировщица');
        await expect(page.locator('[id^="cell-contactPersonWorkPlace"]').nth(0)).toHaveText('Департамент образования и контроля за детьми');
        await expect(page.locator('[id^="cell-contactPersonFullName"]').nth(0)).toHaveText('Шестакова Алла Михайлов');
        await expect(page.locator('[id^="cell-contactPersonEmail"]').nth(0)).toHaveText('testEdit@mail.ru');
        await expect(page.locator('[id^="cell-lastName"]').nth(0)).toHaveText('Тестовик');
        await expect(page.locator('[id^="cell-firstName"]').nth(0)).toHaveText('Авто');
        await expect(page.locator('[id^="cell-middleName"]').nth(0)).toHaveText('Редактор');
        await expect(page.locator('[id^="cell-jobPositionName"]').nth(0)).toHaveText('Дизайнер');
        await expect(page.locator('[id^="cell-birthday"]').nth(0)).toHaveText('2025-07-03T00:00:00.000Z');
        await expect(page.locator('[id^="cell-birthPlace"]').nth(0)).toHaveText('Коморка');
        await expect(page.locator('[id^="cell-phone"]').nth(0)).toHaveText('+7 (966) 132-66-66');
        await expect(page.locator('[id^="cell-email"]').nth(0)).toHaveText('avtotestedit@mail.ru');
        await application.actionBtn.nth(22).click();
        await application.deleteSection.waitFor({ state: 'visible' });
        await application.deleteSection.click();
        await expect(page.getByText('Удаление')).toBeVisible();
        await application.deleteBtn.click();
        await expect(page.locator('[id^="cell-middleName"]').nth(0)).not.toHaveText('Редактор');
    });

    test('Проверка обязательных полей', async ({ page }) => {
        const application = new Application(page);
                
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.createBtn.nth(0).click();
        await expect(page.getByText('Создание заявки')).toBeVisible();
        await application.legalEntity.click();
        await application.legalEntityName1.click();
        await page.getByText('Создание заявки').click();
        await application.createBtn.nth(1).click();
        await expect(application.requiredField).toBeVisible();
        await application.applicant.click();
        await application.applicantName1.click();
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(1)).toBeVisible();
        await application.surname.fill('Тестовый');
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(1)).toBeVisible();
        await application.name.fill('Авто');
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(1)).toBeVisible();
        await application.patronymic.fill('Тест');
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(1)).toBeVisible();
        await application.job.click();
        await application.jobName.click();
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(1)).toBeVisible();
        await application.birthday.click();
        await page.getByRole('button', { name: '1' }).nth(0).click();
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(1)).toBeVisible();
        await application.bithdayPlace.fill('Москва');
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(1)).toBeVisible();
        await application.phoneNumber.fill('89661326768');
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(1)).toBeVisible();
        await application.email.fill('avtotest@mail.ru');
        await application.createBtn.nth(1).click();
        await page.waitForTimeout(3000);
        await expect(page.locator('[id^="cell-contactPersonJobPosition"]').nth(0)).toHaveText('Тестировщик');
    });

    test('Корректность полей', async ({ page }) => {
        const application = new Application(page);
                
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.createBtn.nth(0).click();
        await expect(page.getByText('Создание заявки')).toBeVisible();

        await application.surname.fill('1');
        await page.getByText('Создание заявки').click();
        await expect(page.getByText('Введите текст на русском языке без цифр')).toBeVisible();

        await application.name.fill('As');
        await page.getByText('Создание заявки').click();
        await expect(page.getByText('Введите текст на русском языке без цифр').nth(1)).toBeVisible();

        await application.bithdayPlace.fill('asd1');
        await page.getByText('Создание заявки').click();
        await expect(page.getByText('Введите текст на русском языке без цифр').nth(2)).toBeHidden();

        await application.phoneNumber.fill('64432331232');
        await page.getByText('Создание заявки').click();
        await expect(page.getByText('Введите корректный номер телефона')).toBeVisible();

        await application.email.fill('ффыв');
        await page.getByText('Создание заявки').click();
        await expect(page.getByText('Введите корректный адрес электронной почты')).toBeVisible();

        await application.cancelBtn.click();
        await expect(page.getByText('Создание заявки')).toBeHidden();
    });

    test('Просмотр заявки', async ({ page }) => {
        const application = new Application(page);
                
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.actionBtn.nth(26).click();
        await application.viewBtn.waitFor({ state: 'visible' });
        await application.viewBtn.click();
        await expect(application.patronymicEmpty).toBeVisible();
        await application.cancelBtn.click();
        await expect(application.patronymicEmpty).toBeHidden();
    });

    test('Назначение исследования', async ({ page }) => {
        const application = new Application(page);
    
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.actionBtn.nth(26).click();
        await application.sheduleStudy.waitFor({ state: 'visible' });
        await application.sheduleStudy.click();
        await expect(page.getByText('Расписание').nth(1)).toBeVisible();

        const response = await page.waitForResponse(response => response.url().includes('/api/claim_examinations/available_slots') && response.status() === 200);
        const responseBody = await response.json();
       
        const availableSlot = responseBody.find((item: any) => 
            item.availableSlotIds.length > 0
        );

        const days = availableSlot.date.split('-')[2].replace(/^0+/, '');

        await page.locator('div').filter({ hasText: /^Shemagonov A\.$/ }).click();
        await page.getByRole('option', { name: 'Гупенко Ю' }).click();
        await page.getByRole('button', { name: days, exact: true }).click();
        await page.locator('.v-time-and-date').nth(0).click();

        const [year, month, day] = availableSlot.date.split('-');
        const formattedDate = `${day}.${month}.${year}`;

        const time = await page.locator('.v-time-and-date').nth(0).innerText()

        if (time === '9:00 - 13:00') {
            await application.applyBtn.click();
            await application.confirmBtn.click();
            await expect(page.locator('[id^="cell-examinedAt"]').nth(0)).toHaveText(`${formattedDate}, 09:00`);
            await expect(page.locator('[id^="cell-examiner"]').nth(0)).toHaveText('Гупенко Ю.');
        } else {
            await application.applyBtn.click();
            await application.confirmBtn.click();
            await expect(page.locator('[id^="cell-examinedAt"]').nth(0)).toHaveText(`${formattedDate}, 14:00`);
            await expect(page.locator('[id^="cell-examiner"]').nth(0)).toHaveText('Гупенко Ю.');
        }
    });

    test('Перенос исследования', async ({ page }) => {
        const application = new Application(page);
    
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.actionBtn.nth(26).click();
        await application.transferStudy.waitFor({ state: 'visible' });
        await application.transferStudy.click();
        await expect(page.getByText('Расписание').nth(1)).toBeVisible();

        await page.locator('div').filter({ hasText: /^Гупенко Ю\.$/ }).click();
        await page.getByRole('option', { name: 'Егорова К.' }).click();

        const response = await page.waitForResponse(response => response.url().includes('/api/claim_examinations/available_slots') && response.status() === 200);
        const responseBody = await response.json();
       
        const availableSlot = responseBody.find((item: any) => 
            item.availableSlotIds.length > 0
        );

        const days = availableSlot.date.split('-')[2].replace(/^0+/, '');

        await page.getByRole('button', { name: days, exact: true }).click();
        await page.locator('.v-time-and-date').nth(0).click();

        const [year, month, day] = availableSlot.date.split('-');
        const formattedDate = `${day}.${month}.${year}`;

        const time = await page.locator('.v-time-and-date').nth(0).innerText()

        if (time === '9:00 - 13:00') {
            await application.applyBtn.click();
            await application.confirmBtn.click();
            await expect(page.locator('[id^="cell-examinedAt"]').nth(0)).toHaveText(`${formattedDate}, 09:00`);
            await expect(page.locator('[id^="cell-examiner"]').nth(0)).toHaveText('Егорова К.');
        } else {
            await application.applyBtn.click();
            await application.confirmBtn.click();
            await expect(page.locator('[id^="cell-examinedAt"]').nth(0)).toHaveText(`${formattedDate}, 14:00`);
            await expect(page.locator('[id^="cell-examiner"]').nth(0)).toHaveText('Егорова К.');
        }
    });

    test('Поиск заявок требующих переноса', async ({ page }) => {
        const application = new Application(page);
        
        await application.showBtn.waitFor({ state: 'visible' });
        await application.showBtn.click();
        await expect(page.locator('[id^="cell-status"]').nth(0)).toHaveText('Требует переноса');
        await expect(page.locator('[id^="cell-status"]').nth(1)).toHaveText('Требует переноса');
        await expect(page.locator('.v-status__label').nth(0)).toHaveCSS('color', 'rgb(255, 158, 0)');
        await application.cleanBtn.click();
        await expect(page.locator('[id^="cell-status"]').nth(0)).not.toHaveText('Требует переноса');
	});

     test('Поиск не обработанных заявок', async ({ page }) => {
        const application = new Application(page);
        
        await application.statusFiltr.waitFor({ state: 'visible' });
        await application.statusFiltr.click();
        await page.getByRole('option', { name: 'Создана' }).getByRole('checkbox').setChecked(true);

        await expect(page.locator('[id^="cell-status"]').nth(0)).toHaveText('Создана');
        await expect(page.locator('[id^="cell-status"]').nth(1)).toHaveText('Создана');
        await application.cleanBtn.click();
	});

    test('Фильтрация', async ({ page }) => {
        const application = new Application(page);
        
        await application.statusFiltr.waitFor({ state: 'visible' });
        await application.nameFiltr.fill('735');
        await application.nameFiltr.press('Enter');
        await expect(page.locator('[id^="cell-number"]').nth(0)).toHaveText('695');
        await application.closeBtn.nth(0).click();
        await application.closeBtn.nth(0).waitFor({ state: 'hidden' });
        await expect(page.locator('[id^="cell-number"]').nth(0)).not.toHaveText('695');

        await application.nameFiltr.fill('Иван');
        await application.nameFiltr.press('Enter');
        await expect(page.locator('[id^="cell-contactPersonFullName"], [id^="cell-firstName"], [id^="cell-lastName"], [id^="cell-middleName"]').nth(0)).toContainText('Иван');
        await application.closeBtn.nth(0).click();
        await application.closeBtn.nth(0).waitFor({ state: 'hidden' });

        await application.dateFiltr.fill('08.07.2025 - 09.07.2025');
        await page.locator('.v-header__content').click();
        await expect(page.locator('[id^="cell-examinedAt"]').nth(0)).toHaveText((/^(08\.07\.2025|09\.07\.2025), \d{2}:\d{2}$/));
        await application.dateFiltr.click();
        await application.closeBtn.nth(1).click();
        await application.closeBtn.nth(1).waitFor({ state: 'hidden' });



	});
});