import { expect, Locator, Page } from "@playwright/test";

export default class Application {

	readonly page: Page;
	readonly chooseApplication: Locator;
	readonly createBtn: Locator;
	// readonly background: Locator;
	readonly cancelBtn: Locator;
	readonly scroll: Locator;
	readonly legalEntity: Locator;
	readonly legalEntityForEdit: Locator;
	readonly legalEntityName: Locator;
	readonly legalEntityName1: Locator;
	readonly applicant: Locator;
	readonly applicantName: Locator;
	readonly applicantName1: Locator;
	readonly surname: Locator;
	readonly name: Locator;
	readonly patronymic: Locator;
	readonly patronymicEmpty: Locator;
	readonly job: Locator;
	readonly jobName: Locator;
	readonly jobName1: Locator;
	readonly birthday: Locator;
	readonly bithdayPlace: Locator;
	readonly email: Locator;
	readonly phoneNumber: Locator;
	readonly placeJob: Locator;
	readonly applicantJob: Locator;
	readonly actionBtn: Locator;
	readonly editBtn: Locator;
	readonly applicantEmail: Locator;
	readonly saveBtn: Locator;
	readonly deleteBtn: Locator;
	readonly deleteSection: Locator;
	readonly cellBtn: Locator;
	readonly listCell: Locator;
	readonly header: Locator;
	readonly listCellAll: Locator;
	readonly clearBtn: Locator;
	readonly viewBtn: Locator;
	readonly requiredField: Locator;
	readonly sheduleStudy: Locator;
	readonly applyBtn: Locator;
	readonly confirmBtn: Locator;
	readonly transferStudy: Locator;
	readonly showBtn: Locator;
	readonly cleanBtn: Locator;
	readonly statusFiltr: Locator;
	readonly nameFiltr: Locator;
	readonly dateFiltr: Locator;
	readonly calendar: Locator;
	readonly closeBtn: Locator;

    constructor(page: Page) {
		this.page = page;

        this.chooseApplication = page.getByRole('row', { name: 'ООО ТоргПромПром Соловьев Никита Филиппов +7 (931) 423-08-59 eric_lakin@' }).getByRole('checkbox');
		this.createBtn = page.getByRole('button', { name: 'Создать' });
		this.saveBtn = page.getByRole('button', { name: 'Сохранить' });
		this.deleteBtn = page.getByRole('button', { name: 'Удалить' });
		this.cleanBtn = page.locator('.q-btn').filter({ hasText: 'Очистить' })
		this.cancelBtn = page.getByRole('button', { name: 'Отменить' });
		this.applyBtn = page.getByRole('button', { name: 'Применить' });
		this.confirmBtn = page.getByRole('button', { name: 'Подтвердить' });
		this.scroll = page.locator('.v-table__container');
		this.legalEntity = page.getByRole('combobox', { name: 'Наименование юридического лица заявителя',  exact: true });
		this.legalEntityForEdit = page.locator('div').filter({ hasText: /^ГБНФ$/ });
		this.legalEntityName = page.getByRole('option', { name: 'ЗАО Елена' }).locator('div').nth(1);
		this.legalEntityName1 = page.getByRole('option', { name: 'ГБНФ' }).locator('div').nth(1);
		this.applicant = page.getByRole('combobox', { name: 'ФИО заявителя' ,  exact: true }); // Плохой локатор
		this.applicantName = page.getByRole('option', { name: 'Шестакова Алла Михайлов' }).locator('div').nth(2);
		this.applicantName1 = page.getByRole('option', { name: 'Тестов тест Тестович' }).locator('div').nth(2);
		this.placeJob = page.getByRole('textbox', { name: 'Департамент/ Управление' });
		this.applicantJob = page.getByRole('textbox', { name: 'Должность заявителя' });
		this.applicantEmail = page.getByRole('textbox', { name: 'Email заявителя' });
		this.surname = page.getByRole('textbox', { name: 'Фамилия кандидата' });
		this.name = page.getByRole('textbox', { name: 'Имя кандидата' });
		this.patronymic  = page.getByRole('textbox', { name: 'Отчество' });
		this.patronymicEmpty = page.getByRole('checkbox', { name: 'Нет отчества' });
		this.job =  page.getByRole('combobox', { name: 'Должность кандидата',  exact: true  });
		this.jobName = page.getByRole('option', { name: 'Водитель' }).locator('div').nth(2);
		this.jobName1 = page.getByRole('option', { name: 'Главный специалист' }).locator('div').nth(2);
		this.birthday =  page.locator('label').filter({ hasText: 'Дата рождения' }).getByRole('button');
		this.bithdayPlace  = page.getByRole('textbox', { name: 'Место рождения кандидата' });
		this.email  = page.getByRole('textbox', { name: 'Email кандидата' });
		this.phoneNumber  = page.getByRole('textbox', { name: 'Номер телефона' }).nth(0);
		this.actionBtn  = page.locator('.q-icon').filter({ hasText: 'more_vert' });
		this.editBtn  = page.locator('.q-item__section').filter({ hasText: 'Редактировать заявку' });
		this.viewBtn  = page.locator('.q-item__section').filter({ hasText: 'Просмотр Заявки' });
		this.sheduleStudy  = page.locator('.q-item__section').filter({ hasText: 'Назначить исследование' });
		this.transferStudy  = page.locator('.q-item__section').filter({ hasText: 'Перенести исследование' });
		this.deleteSection  = page.locator('.q-item__section').filter({ hasText: 'Удалить заявку' });

		this.cellBtn  = page.getByRole('button', { name: 'Столбцы' });
		this.listCell  = page.getByRole('listitem').filter({ hasText: 'Статус заявки' }).getByRole('checkbox');
		this.header  = page.locator('#header-content');
		this.listCellAll  = page.getByRole('listitem').filter({ hasText: 'Все показать / скрыть Сбросить' }).getByRole('checkbox');
		this.clearBtn  = page.getByRole('button', { name: 'Сбросить' });

		this.requiredField  = page.getByText('Обязательное поле');

		this.showBtn  = page.locator('.v-text-orange-700').filter({ hasText: 'Показать' });

		this.statusFiltr  = page.getByRole('main').getByText('keyboard_arrow_down');
		this.nameFiltr  = page.getByPlaceholder('Введите фио кандидата, фио заявителя, номер заявки');
		this.dateFiltr  = page.getByRole('textbox', { name: 'Период исследования' });
		this.calendar  = page.getByRole('button').filter({ hasText: 'calendar_today' });
		this.closeBtn  = page.locator('.q-icon').filter({ hasText: 'close' });
	} 

	async getFirstValue(config: ColumnConfig, order: 'asc' | 'desc'): Promise<string> {
		await this.page.locator(`#${config.columnId}`).filter({ hasText: 'more_vert' }).click();
		await this.page.locator(`#${config.columnId}`).locator('.q-btn').filter({ hasText: 'more_vert' }).click();
		
		const sortText: string = order === 'asc' ? 'arrow_upward По возрастанию' : 'arrow_downward По убыванию';
		await this.page.getByText(sortText).click();
		
		await this.page.waitForTimeout(1000);
		
		const firstCell = this.page.locator(`[id^="${config.cellPrefix}"]`).first();
		const value: string | null = await firstCell.locator('.v-table__td-value').first().textContent();
		
		return value ? value.trim() : '';
	}

	async testSorting(displayName: string) {
		const config = columnsConfig.find(c => c.displayName === displayName);
        if (!config) throw new Error(`Колонка "${displayName}" не найдена`);
        
        const descValue = await this.getFirstValue(config, 'desc');
        const ascValue = await this.getFirstValue(config, 'asc');
        
        return {
            field: displayName,
            ascValue: ascValue,
            descValue: descValue,
            isDifferent: ascValue !== descValue
        };
    }


	async createApplication() {
        await this.createBtn.nth(0).waitFor({ state: 'visible' });
        await this.createBtn.nth(0).click();
        await expect(this.page.getByText('Создание заявки')).toBeVisible();
        await this.legalEntity.click();
		await this.legalEntityName1.waitFor({ state: 'visible' });
        await this.legalEntityName1.click();
        await this.page.waitForTimeout(1000);
        await this.page.getByText('Создание заявки').click();
        await this.applicant.click();
		await this.applicantName1.waitFor({ state: 'visible' });
        await this.applicantName1.click();
        await this.page.waitForTimeout(1000);
        await this.applicantJob.fill('Тестировщик');
        await this.surname.fill('Тестовый');
        await this.name.fill('Авто');
        await this.patronymic.fill('Тест');
        await this.job.click();
        await this.jobName.click();
        await this.bithdayPlace.fill('Москва');
        await this.phoneNumber.fill('89661326768');
        await this.email.fill('avtotest@mail.ru');
        await this.birthday.click();
        await this.page.getByRole('button', { name: '1' }).nth(0).click();
        await this.page.getByText('Создание заявки').click();
        await this.createBtn.nth(1).click();
        await this.page.waitForTimeout(3000);
        await expect(this.page.locator('[id^="cell-contactPersonJobPosition"]').nth(0)).toHaveText('Тестировщик');
    }

	async assignmentApplication() {
        await this.createBtn.nth(0).waitFor({ state: 'visible' });
        await this.actionBtn.nth(27).click();
        await this.sheduleStudy.waitFor({ state: 'visible' });
        await this.sheduleStudy.click();
        await expect(this.page.getByText('Расписание').nth(1)).toBeVisible();

        const response = await this.page.waitForResponse(response => response.url().includes('/api/claim_examinations/available_slots') && response.status() === 200);
        const responseBody = await response.json();
       
        const availableSlot = responseBody.find((item: any) => 
            item.availableSlotIds.length > 0
        );

        const days = availableSlot.date.split('-')[2].replace(/^0+/, '');

        await this.page.locator('div').filter({ hasText: /^Shemagonov A\.$/ }).click();
        await this.page.getByRole('option', { name: 'Гупенко Ю' }).click();
        await this.page.getByRole('button', { name: days, exact: true }).click();
        await this.page.locator('.v-time-and-date').nth(0).click();

        const [year, month, day] = availableSlot.date.split('-');
        const formattedDate = `${day}.${month}.${year}`;

        const time = await this.page.locator('.v-time-and-date').nth(0).innerText()

        if (time === '9:00 - 13:00') {
            await this.applyBtn.click();
            await this.confirmBtn.click();
            await expect(this.page.locator('[id^="cell-examinedAt"]').nth(0)).toHaveText(`${formattedDate}, 09:00`);
            await expect(this.page.locator('[id^="cell-examiner"]').nth(0)).toHaveText('Гупенко Ю.');
        } else {
            await this.applyBtn.click();
            await this.confirmBtn.click();
            await expect(this.page.locator('[id^="cell-examinedAt"]').nth(0)).toHaveText(`${formattedDate}, 14:00`);
            await expect(this.page.locator('[id^="cell-examiner"]').nth(0)).toHaveText('Гупенко Ю.');
        }
    }
}

interface ColumnConfig {
    displayName: string;      
    columnId: string;         
    cellPrefix: string;   
}

export type SortingResult = {
    field: string;
    ascValue: string;
    descValue: string;
    isDifferent: boolean; 
};

export const columnsConfig: ColumnConfig[] = [
    {
        displayName: 'Номер заявки',
        columnId: 'col-number',
        cellPrefix: 'cell-number'
    },
    {
        displayName: 'Статус заявки',
        columnId: 'col-status',
        cellPrefix: 'cell-status'
    },
    {
        displayName: 'Фамилия кандидата',
        columnId: 'col-lastname',
        cellPrefix: 'cell-lastName'
    },
    {
        displayName: 'Имя кандидата',
        columnId: 'col-firstname',
        cellPrefix: 'cell-firstName'
    },
    {
        displayName: 'Отчество кандидата',
        columnId: 'col-middlename',
        cellPrefix: 'cell-middleName'
    },
    {
        displayName: 'Дата рождения кандидата',
        columnId: 'col-birthday',
        cellPrefix: 'cell-birthday'
    },
    {
        displayName: 'Место рождения кандидата',
        columnId: 'col-birthplace',
        cellPrefix: 'cell-birthplace'
    },
    {
        displayName: 'Телефон кандидата',
        columnId: 'col-phone',
        cellPrefix: 'cell-phone'
    },
    {
        displayName: 'Email кандидата',
        columnId: 'col-email',
        cellPrefix: 'cell-email'
    },
    {
        displayName: 'Должность кандидата',
        columnId: 'col-jobpositionname',
        cellPrefix: 'cell-jobPositionName'
    },
    {
        displayName: 'ФИО заявителя',
        columnId: 'col-contactpersonfullname',
        cellPrefix: 'cell-contactPersonFullName'
    },
    {
        displayName: 'Наименование юридического лица заявителя',
        columnId: 'col-organizationname',
        cellPrefix: 'cell-organizationName'
    },
    {
        displayName: 'Должность заявителя',
        columnId: 'col-contactpersonworkplace',
        cellPrefix: 'cell-contactPersonJobPosition'
    }
	
];