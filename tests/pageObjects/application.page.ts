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
		this.legalEntity = page.locator('div').filter({ hasText: /^Наименование юридического лица заявителя \*keyboard_arrow_down$/ }).locator('div').nth(1);
		this.legalEntityForEdit = page.locator('div').filter({ hasText: /^ГБНФ$/ });
		this.legalEntityName = page.getByRole('option', { name: 'ЗАО Елена' }).locator('div').nth(1);
		this.legalEntityName1 = page.getByRole('option', { name: 'ГБНФ' }).locator('div').nth(1);
		this.applicant = page.locator('div > label:nth-child(2) > .q-field__inner > .q-field__control > .q-field__control-container > .q-field__native').nth(1); // Плохой локатор
		this.applicantName = page.getByRole('option', { name: 'Шестакова Алла Михайлов' }).locator('div').nth(2);
		this.applicantName1 = page.getByRole('option', { name: 'Павлов Иван Леонидович' }).locator('div').nth(2);
		this.placeJob = page.getByRole('textbox', { name: 'Департамент/ Управление' });
		this.applicantJob = page.getByRole('textbox', { name: 'Должность заявителя' });
		this.applicantEmail = page.getByRole('textbox', { name: 'Email заявителя' });
		this.surname = page.getByRole('textbox', { name: 'Фамилия кандидата' });
		this.name = page.getByRole('textbox', { name: 'Имя кандидата' });
		this.patronymic  = page.getByRole('textbox', { name: 'Отчество' });
		this.patronymicEmpty = page.getByRole('checkbox', { name: 'Нет отчества' });
		this.job =  page.getByRole('combobox', { name: 'Должность кандидата' });
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


}