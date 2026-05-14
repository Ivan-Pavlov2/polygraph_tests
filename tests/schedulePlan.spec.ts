import { expect, Page, test } from '@playwright/test';
import Application from './pageObjects/application.page';
import SchedulePlan from './pageObjects/schedulePlan.page';
import { table } from 'console';
import { TIMEOUT } from 'dns';
import { request } from 'http';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('План График', async () => {
        test('drag and drop', async ({ page }) => { 
                const schedulePlan = new SchedulePlan(page);
                
                await schedulePlan.timetable.click();
                const drag = page.locator('.v-schedule__claims__list__item').nth(0);
                const drop = page.locator('.v-schedule__calendar__right-list__item:not(.v-schedule__calendar__right-list__item--past):not(.v-schedule__calendar__right-list__item--card):not(.v-schedule__calendar__right-list__item--holiday):not(.v-schedule__calendar__right-list__item--vacation-sick)').nth(0);
    
                await page.waitForTimeout(3000);
                await drag.dragTo(drop);

                await page.waitForResponse(response => 
                response.url().includes('/api/claims/') && 
                response.url().includes('/lock') && 
                response.status() === 200);
        
                await expect(page.locator('.q-card')).toBeVisible();
                await page.locator('.q-btn__content').filter({ hasText: 'Подтвердить' }).click();
  
                const response = await page.waitForResponse(response => response.url().includes('/api/claim_examinations') && response.status() === 201);

                await page.waitForResponse(response => 
                response.url().includes('/api/claims/') && 
                response.url().includes('/unlock') && 
                response.status() === 200);

                const responseBody = await response.json();

                await expect(page.locator('.q-card')).toBeHidden();
        
                const claimStatus = responseBody.claim.status;
  
                expect(claimStatus).toBe('scheduled');
        });

         test('Днд требует переноса', async ({ page }) => { 
                const schedulePlan = new SchedulePlan(page);
                
                await schedulePlan.timetable.click();
                const drag = page.locator('.v-schedule__claims__list__item--warning').nth(0);
                const drop = page.locator('.v-schedule__calendar__right-list__item:not(.v-schedule__calendar__right-list__item--past):not(.v-schedule__calendar__right-list__item--card):not(.v-schedule__calendar__right-list__item--holiday):not(.v-schedule__calendar__right-list__item--vacation-sick)').nth(0);
    
                await page.waitForTimeout(3000);
                await drag.dragTo(drop);

                await page.waitForResponse(response => 
                response.url().includes('/api/claims/') && 
                response.url().includes('/lock') && 
                response.status() === 200);
        
                await expect(page.locator('.q-card')).toBeVisible();
                await page.locator('.q-btn__content').filter({ hasText: 'Подтвердить' }).click();
  
                const response = await page.waitForResponse(response => response.url().includes('/api/claim_examinations') && response.status() === 201);

                await page.waitForResponse(response => 
                response.url().includes('/api/claims/') && 
                response.url().includes('/unlock') && 
                response.status() === 200);

                const responseBody = await response.json();

                await expect(page.locator('.q-card')).toBeHidden();
        
                const claimStatus = responseBody.claim.status;
  
                expect(claimStatus).toBe('scheduled');
        });

        test('Днд Слот не доступен', async ({ page }) => { 
                const schedulePlan = new SchedulePlan(page);
                
                await schedulePlan.timetable.click();

                const drag = page.locator('.v-schedule__claims__list__item').nth(0);
                const drop_past = page.locator('.v-schedule__calendar__right-list__item--past').nth(0);
                const drop_sick = page.locator('.v-schedule__calendar__right-list__item--vacation-sick:not(.v-schedule__calendar__right-list__item--past)').nth(0);
                const drop_card = page.locator('.v-schedule__calendar__right-list__item--card:not(.v-schedule__calendar__right-list__item--past)').nth(0);
                const drop_holiday = page.locator('.v-schedule__calendar__right-list__item--holiday:not(.v-schedule__calendar__right-list__item--past)').nth(0);
                const warning_past = page.getByText('Нельзя назначить на прошедшую дату');
                const warning = page.getByText('Невозможно назначить заявку: слот недоступен');

                await page.waitForTimeout(3000);
                await expect (drop_past).toBeVisible();
                await drag.dragTo(drop_past);
                await expect(warning_past).toBeVisible();
                await warning_past.waitFor({ state: 'hidden' });

                await expect (drop_sick).toBeVisible();
                await drag.dragTo(drop_sick);
                await expect(warning).toBeVisible();
                await warning.waitFor({ state: 'hidden' });

                await expect (drop_holiday).toBeVisible();
                await drag.dragTo(drop_holiday);
                await expect(warning).toBeVisible();
                await warning.waitFor({ state: 'hidden' });

                // Не срабатывает с перетаскиванием в занятый слот
                // await drag.dragTo(drop_card);
                // await expect(warning).toBeVisible();
                // await warning.waitFor({ state: 'hidden' });
        });

        test('Проверка выходного на 1 день ', async ({ page }) => {
                const schedulePlan = new SchedulePlan(page);
                const application = new Application(page);

                const workDay = await schedulePlan.getFirstWorkDay();
                const holiday = Number(workDay) + 5;

// --------------------------Создание выходного----------------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.holiday.waitFor({ state: 'visible' });
                await schedulePlan.holiday.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await schedulePlan.addBtn.click();

                await schedulePlan.holidayChoose.click();
                await page.getByRole('option', { name: 'Выходной' }).click();
                await schedulePlan.oneDayOnly.setChecked(true);
                await application.calendar.click();
                console.log(holiday, workDay);
                await page.getByRole('button', { name: String(workDay), exact: true }).click();
                await page.waitForTimeout(1000);
                await application.createBtn.click();
                await application.createBtn.waitFor({ state: 'hidden' });

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                const date = await schedulePlan.getFirstWorkDate();
                // console.log(date);

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });
                
                const isSameCellMonday = await page.evaluate(() => {
                        const mondayElement = document.querySelector('.v-schedule__calendar__right-list__item');
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
  
                        return mondayElement === holidayElement;
                });

                expect(isSameCellMonday).toBe(true);
// ---------------------------------Редактирование выходного--------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.holiday.waitFor({ state: 'visible' });
                await schedulePlan.holiday.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `${date} Выходной` }).getByRole('button').click();
                await page.getByText('Редактировать').waitFor({ state: 'visible' });
                await page.getByText('Редактировать').click();
                await expect(application.saveBtn).toBeVisible();

                await schedulePlan.workDayChoose.click();
                await page.getByRole('option', { name: 'Рабочий' }).click();
                await application.calendar.click();
                await page.getByRole('button', { name: String(holiday), exact: true }).click();
                await page.waitForTimeout(1000);
                await application.saveBtn.click();
                await page.waitForTimeout(1000);
                const date1 = await schedulePlan.getFirstHolidayDate();
                // console.log(date1,'12/07/25');

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });

                const isSameCellHoliday = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const fifthWorkDayElement = workDayElements[5];
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
                        return fifthWorkDayElement === holidayElement;
                });

                expect(isSameCellHoliday).toBe(false);
// ---------------------------------Удаление рабочего--------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.holiday.waitFor({ state: 'visible' });
                await schedulePlan.holiday.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `${date1} Рабочий` }).getByRole('button').click();
                await page.getByText('Удалить').waitFor({ state: 'visible' });
                await page.getByText('Удалить').click();
                await expect(application.deleteBtn).toBeVisible();
                await application.deleteBtn.click();

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });

                const isSameCell = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const fifthWorkDayElement = workDayElements[5];
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
                        return fifthWorkDayElement === holidayElement;
                });

                expect(isSameCell).toBe(true);
        });

        test('Проверка рабочего на 1 день ', async ({ page }) => {
                const schedulePlan = new SchedulePlan(page);
                const application = new Application(page);

                const workDay = await schedulePlan.getFirstWorkDay();
                const holiday = await Number(workDay) + 5;

                // const monday = page.locator('.v-schedule__calendar__right-list__item').nth(0);
                // const new_holiday = page.locator('.v-schedule__calendar__right-list__item--holiday').nth(0);

// --------------------------Создание рабочего----------------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.holiday.waitFor({ state: 'visible' });
                await schedulePlan.holiday.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await schedulePlan.addBtn.click();

                await schedulePlan.holidayChoose.click();
                await page.getByRole('option', { name: 'Рабочий' }).click();
                await schedulePlan.oneDayOnly.setChecked(true);
                await application.calendar.click();
                await page.getByRole('button', { name: String(holiday), exact: true }).click();
                await page.waitForTimeout(1000);
                await application.createBtn.click();
                await application.createBtn.waitFor({ state: 'hidden' });

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                const date = await schedulePlan.getFirstHolidayDate();
                console.log(date);

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });
                
                const isSameCellHoliday = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const fifthWorkDayElement = workDayElements[5];
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
                        return fifthWorkDayElement === holidayElement;
                });

                expect(isSameCellHoliday).toBe(false);
// ---------------------------------Редактирование рабочего--------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.holiday.waitFor({ state: 'visible' });
                await schedulePlan.holiday.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `${date} Рабочий` }).getByRole('button').click();

                await page.getByText('Редактировать').waitFor({ state: 'visible' });
                await page.getByText('Редактировать').click();
                await expect(application.saveBtn).toBeVisible();

                await schedulePlan.holidayChoose.click();
                await page.getByRole('option', { name: 'Выходной' }).click();
                await application.calendar.click();
                await page.getByRole('button', { name: String(workDay), exact: true }).click();
                await page.waitForTimeout(1000);
                await application.saveBtn.click();
                await page.waitForTimeout(1000);
                const date1 = await schedulePlan.getFirstWorkDate();
                

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });

                 const isSameCellMonday = await page.evaluate(() => {
                        const mondayElement = document.querySelector('.v-schedule__calendar__right-list__item');
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
  
                        return mondayElement === holidayElement;
                });

                expect(isSameCellMonday).toBe(true);
// ---------------------------------Удаление Выходного--------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.holiday.waitFor({ state: 'visible' });
                await schedulePlan.holiday.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `${date1} Выходной` }).getByRole('button').click();
                await page.getByText('Удалить').waitFor({ state: 'visible' });
                await page.getByText('Удалить').click();
                await expect(application.deleteBtn).toBeVisible();
                await application.deleteBtn.click();

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });

                const isSameCell = await page.evaluate(() => {
                        const mondayElement = document.querySelector('.v-schedule__calendar__right-list__item');
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
  
                        return mondayElement === holidayElement;
                });
                expect(isSameCell).toBe(false);
        });

        test('Проверка выходного на несколько дней ', async ({ page }) => {
                const schedulePlan = new SchedulePlan(page);
                const application = new Application(page);

                const workDay = await schedulePlan.getFirstWorkDay();
// --------------------------Создание выходного----------------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.holiday.waitFor({ state: 'visible' });
                await schedulePlan.holiday.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await schedulePlan.addBtn.click();

                await schedulePlan.holidayChoose.click();
                await page.getByRole('option', { name: 'Выходной' }).click();
                await schedulePlan.oneDayOnly.setChecked(false);
                await application.calendar.click();
                await page.getByRole('button', { name: String(workDay), exact: true }).click();
                await page.getByRole('button', { name: String(workDay+1), exact: true }).click();
                await page.waitForTimeout(1000);
                await application.createBtn.click();
                await application.createBtn.waitFor({ state: 'hidden' });

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                const date = await schedulePlan.getFirstWorkDate();
                const date1 = await schedulePlan.getSecondWorkDate();

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });
                
                const isSameCellMonday = await page.evaluate(() => {
                        const mondayElement = document.querySelector('.v-schedule__calendar__right-list__item');
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
  
                        return mondayElement === holidayElement;
                });
                expect(isSameCellMonday).toBe(true);

                const isSameCellThusday = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[1];
                        const holidayElement = document.querySelectorAll('.v-schedule__calendar__right-list__item--holiday');
                        const newHolidayElement = holidayElement[1];
                        return newWorkDayElement === newHolidayElement;
                });
                expect(isSameCellThusday).toBe(true);
// ---------------------------------Удаление Выходного--------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.holiday.waitFor({ state: 'visible' });
                await schedulePlan.holiday.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `${date} Выходной` }).getByRole('button').click();
                await page.getByText('Удалить').waitFor({ state: 'visible' });
                await page.getByText('Удалить').click();
                await expect(application.deleteBtn).toBeVisible();
                await application.deleteBtn.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `${date1} Выходной` }).getByRole('button').click();
                await page.getByText('Удалить').waitFor({ state: 'visible' });
                await page.getByText('Удалить').click();
                await expect(application.deleteBtn).toBeVisible();
                await application.deleteBtn.click();

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });

                const isSameCell = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const fifthWorkDayElement = workDayElements[0];
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
                        return fifthWorkDayElement === holidayElement;
                });

                expect(isSameCell).toBe(false);

                const isSameCell1 = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const fifthWorkDayElement = workDayElements[1];
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
                        return fifthWorkDayElement === holidayElement;
                });
                expect(isSameCell1).toBe(false);
        });

        test('Проверка рабочего на несколько дней ', async ({ page }) => {
                const schedulePlan = new SchedulePlan(page);
                const application = new Application(page);

                const workDay = await schedulePlan.getFirstWorkDay();
                const holiday = await Number(workDay) + 5;

                // const monday = page.locator('.v-schedule__calendar__right-list__item').nth(0);
                // const new_holiday = page.locator('.v-schedule__calendar__right-list__item--holiday').nth(0);

// --------------------------Создание рабочего----------------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.holiday.waitFor({ state: 'visible' });
                await schedulePlan.holiday.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await schedulePlan.addBtn.click();

                await schedulePlan.holidayChoose.click();
                await page.getByRole('option', { name: 'Рабочий' }).click();
                await schedulePlan.oneDayOnly.setChecked(false);
                await application.calendar.click();
                await page.getByRole('button', { name: String(holiday), exact: true }).click();
                await page.getByRole('button', { name: String(holiday+1), exact: true }).click();
                await page.waitForTimeout(1000);
                await application.createBtn.click();
                await application.createBtn.waitFor({ state: 'hidden' });

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                const date = await schedulePlan.getFirstHolidayDate();
                const date1 = await schedulePlan.getSecondHolidayDate();

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });
                
                const isSameCellHoliday = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const fifthWorkDayElement = workDayElements[5];
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
                        return fifthWorkDayElement === holidayElement;
                });

                expect(isSameCellHoliday).toBe(false);

                const isSameCellHoliday1 = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[6];
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
                        return newWorkDayElement === holidayElement;
                });

                expect(isSameCellHoliday1).toBe(false);
// ---------------------------------Удаление рабочего--------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.holiday.waitFor({ state: 'visible' });
                await schedulePlan.holiday.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `${date} Рабочий` }).getByRole('button').click();
                await page.getByText('Удалить').waitFor({ state: 'visible' });
                await page.getByText('Удалить').click();
                await expect(application.deleteBtn).toBeVisible();
                await application.deleteBtn.click();

                await page.locator('[id^="cell-period"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `${date1} Рабочий` }).getByRole('button').click();
                await page.getByText('Удалить').waitFor({ state: 'visible' });
                await page.getByText('Удалить').click();
                await expect(application.deleteBtn).toBeVisible();
                await application.deleteBtn.click();

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });

                const isSameCell = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const fifthWorkDayElement = workDayElements[5];
                        const holidayElement = document.querySelector('.v-schedule__calendar__right-list__item--holiday');
                        return fifthWorkDayElement === holidayElement;
                });

                expect(isSameCell).toBe(true);

                const isSameCell1 = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[6];
                        const holidayElement = document.querySelectorAll('.v-schedule__calendar__right-list__item--holiday');
                        const newHolidayElement = holidayElement[1];

                        return newWorkDayElement === newHolidayElement;
                });

                expect(isSameCell1).toBe(true);
        });

        test('Больничный', async ({ page }) => {
                const schedulePlan = new SchedulePlan(page);
                const application = new Application(page);

                const workDay = await schedulePlan.getFirstWorkDay();
                // const holiday = await Number(workDay) + 5;

                // const monday = page.locator('.v-schedule__calendar__right-list__item').nth(0);
                // const new_holiday = page.locator('.v-schedule__calendar__right-list__item--holiday').nth(0);

// --------------------------Создание Больничного----------------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.sick.waitFor({ state: 'visible' });
                await schedulePlan.sick.click();

                await page.locator('[id^="cell-periodDate"]').nth(0).waitFor({ state: 'visible' });
                await schedulePlan.addBtn.click();

                await schedulePlan.user.click();
                await page.getByRole('option', { name: 'Shemagonov Arseniy' }).click();
                await schedulePlan.oneDayOnly.setChecked(true);
                await application.calendar.click();
                await page.getByRole('button', { name: String(workDay), exact: true }).click();
                await page.waitForTimeout(1000);
                await application.saveBtn.click();
                await application.saveBtn.waitFor({ state: 'hidden' });

                await page.locator('[id^="cell-periodDate"]').nth(0).waitFor({ state: 'visible' });
                const date = await schedulePlan.getFirstWorkDate();

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item--vacation-sick').nth(0).waitFor({ state: 'visible' });
                
                const isSameCellSick = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[0];
                        const sickElement = document.querySelector('.v-schedule__calendar__right-list__item--vacation-sick');
                        return newWorkDayElement === sickElement;
                });

                expect(isSameCellSick).toBe(true);
// ---------------------------------Редактирование Больничного--------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.sick.waitFor({ state: 'visible' });
                await schedulePlan.sick.click();

                await page.locator('[id^="cell-periodDate"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `Shemagonov Arseniy ${date}` }).getByRole('button').click();

                await page.getByText('Редактировать').waitFor({ state: 'visible' });
                await page.getByText('Редактировать').click();
                await expect(application.saveBtn).toBeVisible();

                await schedulePlan.user.click();
                await page.getByRole('option', { name: 'Гупенко Юрий' }).click();
                await schedulePlan.oneDayOnly.setChecked(false);
                await application.calendar.click();
                await page.getByRole('button', { name: String(workDay), exact: true }).click();
                await page.getByRole('button', { name: String(workDay+1), exact: true }).click();
                await page.waitForTimeout(1000);
                await application.saveBtn.click();
                await page.waitForTimeout(1000);

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item--vacation-sick').nth(0).waitFor({ state: 'visible' });
                await page.waitForTimeout(1000);

                const isSameCellSick1 = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[0];
                        const sickElement = document.querySelector('.v-schedule__calendar__right-list__item--vacation-sick');
                        return newWorkDayElement === sickElement;
                });

                expect(isSameCellSick1).toBe(false);

                const isSameCellSick2 = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[14];
                        const sickElement = document.querySelector('.v-schedule__calendar__right-list__item--vacation-sick');
                        return newWorkDayElement === sickElement;
                });

                expect(isSameCellSick2).toBe(true);


// ---------------------------------Удаление Больничного--------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.sick.waitFor({ state: 'visible' });
                await schedulePlan.sick.click();

                await page.locator('[id^="cell-periodDate"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `Гупенко Юрий ${date}` }).getByRole('button').click();
                await page.getByText('Удалить').waitFor({ state: 'visible' });
                await page.getByText('Удалить').click();
                await expect(application.deleteBtn).toBeVisible();
                await application.deleteBtn.click();

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });
                await page.waitForTimeout(1000);

                const isSameCellSick3 = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[14];
                        const sickElement = document.querySelector('.v-schedule__calendar__right-list__item--vacation-sick');
                        return newWorkDayElement === sickElement;
                });

                expect(isSameCellSick3).toBe(false);
        });

        test('Отпуск', async ({ page }) => {
                const schedulePlan = new SchedulePlan(page);
                const application = new Application(page);

                const workDay = await schedulePlan.getFirstWorkDay();
// --------------------------Создание отпуска----------------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.vacation.waitFor({ state: 'visible' });
                await schedulePlan.vacation.click();

                await page.locator('[id^="cell-periodDate"]').nth(0).waitFor({ state: 'visible' });
                await schedulePlan.addBtn.click();

                await schedulePlan.user.click();
                await page.getByRole('option', { name: 'Shemagonov Arseniy' }).click();
                await schedulePlan.oneDayOnly.setChecked(true);
                await application.calendar.click();
                await page.getByRole('button', { name: String(workDay), exact: true }).click();
                await page.waitForTimeout(1000);
                await application.saveBtn.click();
                await application.saveBtn.waitFor({ state: 'hidden' });

                await page.locator('[id^="cell-periodDate"]').nth(0).waitFor({ state: 'visible' });
                const date = await schedulePlan.getFirstWorkDate();

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item--vacation-sick').nth(0).waitFor({ state: 'visible' });
                
                const isSameCellSick = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[0];
                        const sickElement = document.querySelector('.v-schedule__calendar__right-list__item--vacation-sick');
                        return newWorkDayElement === sickElement;
                });

                expect(isSameCellSick).toBe(true);
// ---------------------------------Редактирование отпуска--------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.vacation.waitFor({ state: 'visible' });
                await schedulePlan.vacation.click();

                await page.locator('[id^="cell-periodDate"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `Shemagonov Arseniy ${date}` }).getByRole('button').click();

                await page.getByText('Редактировать').waitFor({ state: 'visible' });
                await page.getByText('Редактировать').click();
                await expect(application.saveBtn).toBeVisible();

                await schedulePlan.user.click();
                await page.getByRole('option', { name: 'Гупенко Юрий' }).click();
                await schedulePlan.oneDayOnly.setChecked(false);
                await application.calendar.click();
                await page.getByRole('button', { name: String(workDay), exact: true }).click();
                await page.getByRole('button', { name: String(workDay+1), exact: true }).click();
                await page.waitForTimeout(1000);
                await application.saveBtn.click();
                await page.waitForTimeout(1000);

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item--vacation-sick').nth(0).waitFor({ state: 'visible' });
                await page.waitForTimeout(1000);

                const isSameCellSick1 = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[0];
                        const sickElement = document.querySelector('.v-schedule__calendar__right-list__item--vacation-sick');
                        return newWorkDayElement === sickElement;
                });

                expect(isSameCellSick1).toBe(false);

                const isSameCellSick2 = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[14];
                        const sickElement = document.querySelector('.v-schedule__calendar__right-list__item--vacation-sick');
                        return newWorkDayElement === sickElement;
                });

                expect(isSameCellSick2).toBe(true);


// ---------------------------------Удаление отпуска--------------------------------------------------------
                await schedulePlan.settings.click();
                await schedulePlan.vacation.waitFor({ state: 'visible' });
                await schedulePlan.vacation.click();

                await page.locator('[id^="cell-periodDate"]').nth(0).waitFor({ state: 'visible' });
                await page.getByRole('row', { name: `Гупенко Юрий ${date}` }).getByRole('button').click();
                await page.getByText('Удалить').waitFor({ state: 'visible' });
                await page.getByText('Удалить').click();
                await expect(application.deleteBtn).toBeVisible();
                await application.deleteBtn.click();

                await schedulePlan.timetable.click();
                await page.locator('.v-schedule__calendar__right-list__item').nth(0).waitFor({ state: 'visible' });
                await page.waitForTimeout(1000);

                const isSameCellSick3 = await page.evaluate(() => {
                        const workDayElements = document.querySelectorAll('.v-schedule__calendar__right-list__item');
                        const newWorkDayElement = workDayElements[14];
                        const sickElement = document.querySelector('.v-schedule__calendar__right-list__item--vacation-sick');
                        return newWorkDayElement === sickElement;
                });

                expect(isSameCellSick3).toBe(false);
        });

});