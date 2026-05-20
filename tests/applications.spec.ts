import { expect, Page, test as base } from '@playwright/test';
import Application from './pageObjects/application.page';
import Auth from './auth.component';

type FixturesApplication = {
    auth: Auth;
    application: Application;
};

const test = base.extend<FixturesApplication>({ 
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

test.describe('Обработка заявок', async () => {

    test('Создание заявки', async ({ page, application, auth }) => {           
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

    test('Редактирование заявки', async ({ page, application, auth }) => {
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.actionBtn.nth(27).click();
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
        await expect(page.locator('[id^="cell-jobPositionName"]').nth(0)).toHaveText('Главный специалист');
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

    test('Проверка обязательных полей', async ({ page, application, auth }) => {
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
        await expect(application.requiredField.nth(0)).toBeVisible();
        await application.surname.fill('Тестовый');
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(0)).toBeVisible();
        await application.name.fill('Авто');
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(0)).toBeVisible();
        await application.patronymic.fill('Тест');
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(0)).toBeVisible();
        await application.job.click();
        await application.jobName.click();
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(0)).toBeVisible();
        await application.birthday.click();
        await page.getByRole('button', { name: '1' }).nth(0).click();
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(0)).toBeVisible();
        await application.bithdayPlace.fill('Москва');
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(0)).toBeVisible();
        await application.phoneNumber.fill('89661326768');
        await application.createBtn.nth(1).click();
        await expect(application.requiredField.nth(0)).toBeVisible();
        await application.email.fill('avtotest@mail.ru');
        await application.createBtn.nth(1).click();
        await page.waitForTimeout(3000);
        await expect(page.locator('[id^="cell-contactPersonJobPosition"]').nth(0)).toHaveText('Тестировщик');
    });

    test('Корректность полей', async ({ page, application, auth }) => {   
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

    test('Просмотр заявки', async ({ page, application, auth}) => {    
        await application.createBtn.nth(0).waitFor({ state: 'visible' });
        await application.actionBtn.nth(26).click();
        await application.viewBtn.waitFor({ state: 'visible' });
        await application.viewBtn.click();
        await expect(application.patronymicEmpty).toBeVisible();
        await application.cancelBtn.click();
        await expect(application.patronymicEmpty).toBeHidden();
    });

    test('Назначение исследования', async ({ page, application, auth }) => {
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

    test('Перенос исследования', async ({ page, application, auth }) => {
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

    test('Поиск заявок требующих переноса', async ({ page, application, auth }) => {
        await application.showBtn.waitFor({ state: 'visible' });
        await application.showBtn.click();
        await expect(page.locator('[id^="cell-status"]').nth(0)).toHaveText('Требует переноса');
        await expect(page.locator('[id^="cell-status"]').nth(1)).toHaveText('Требует переноса');
        await expect(page.locator('.v-status__label').nth(0)).toHaveCSS('color', 'rgb(255, 158, 0)');
        await application.cleanBtn.click();
        await expect(page.locator('[id^="cell-status"]').nth(0)).not.toHaveText('Требует переноса');
	});

     test('Поиск не обработанных заявок', async ({ page, application, auth }) => {
        await application.statusFiltr.waitFor({ state: 'visible' });
        await application.statusFiltr.click();
        await page.getByRole('option', { name: 'Создана' }).getByRole('checkbox').setChecked(true);

        await expect(page.locator('[id^="cell-status"]').nth(0)).toHaveText('Создана');
        await expect(page.locator('[id^="cell-status"]').nth(1)).toHaveText('Создана');
        await application.cleanBtn.click();
	});

    test('Фильтрация', async ({ page, application, auth }) => {
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