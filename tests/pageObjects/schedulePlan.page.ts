import { expect, Locator, Page } from "@playwright/test";

export default class SchedulePlan {

	readonly page: Page;
	readonly timetable: Locator;
	readonly settings: Locator;
	readonly holiday: Locator;
	readonly sick: Locator;
	readonly vacation: Locator;
	readonly addBtn: Locator;
	readonly poligrafologChoose: Locator;
	readonly holidayChoose: Locator;
	readonly oneDayOnly: Locator;
	readonly workDayChoose: Locator;
	readonly user: Locator;
	

    constructor(page: Page) {
		this.page = page;

        this.timetable = page.getByText('calendar_monthРасписание');
        this.settings = page.getByRole('button', { name: 'Расширять' });
        this.holiday = page.getByText('fiber_manual_recordВыходные и праздники');
        this.sick = page.getByText('fiber_manual_recordБольничный');
        this.vacation = page.getByText('fiber_manual_recordОтпуска');

		this.addBtn = page.getByRole('button', { name: 'Добавить' });
		this.poligrafologChoose = page.getByText('Пользователь *keyboard_arrow_down');
		this.holidayChoose = page.locator('div').filter({ hasText: /^Рабочий$/ });
		this.workDayChoose = page.locator('div').filter({ hasText: /^Выходной$/ });
		this.oneDayOnly = page.getByRole('checkbox', { name: 'Только один день' });

		this.user = page.locator('div:nth-child(2) > .q-field > .q-field__inner > .q-field__control > .q-field__control-container > .q-field__native');
		



	}

	async getFirstWorkDay() {
		const monday = await this.getFirstWorkDate();
		const day = parseInt(monday.split('.')[0]);
  		return day;
  	}

	async getFirstWorkDate() {
		const today = new Date();
  		const dayOfWeek = today.getDay();// 0-воскресенье, 1-понедельник
  
  		// Вычисляем разницу дней до понедельника
  		const diffDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  		const monday = new Date(today);
  		monday.setDate(today.getDate() - diffDays);
  
  		// Форматируем дату в DD.MM.YYYY
  		const day = String(monday.getDate()).padStart(2, '0');
  		const month = String(monday.getMonth() + 1).padStart(2, '0');
  		const year = monday.getFullYear();
  
  		return `${day}.${month}.${year}`;
	}

	async getFirstHolidayDate() {
		const today = new Date();
    	const dayOfWeek = today.getDay(); // 0-воскресенье, 1-понедельник...6-суббота
    
    	// Вычисляем разницу дней до следующей субботы
    	let diffDays;
    	if (dayOfWeek === 6) {
        	// Если сегодня суббота, возвращаем сегодняшнюю дату
        	diffDays = 0;
    	} else if (dayOfWeek === 0) {
        	// Если сегодня воскресенье, следующая суббота через 6 дней
        	diffDays = 6;
    	} else {
        	// Для других дней недели (1-5)
        	diffDays = 6 - dayOfWeek;
    	}
    
    	const saturday = new Date(today);
    	saturday.setDate(today.getDate() + diffDays);
    
    	// Форматируем дату в DD.MM.YYYY
    	const day = String(saturday.getDate()).padStart(2, '0');
    	const month = String(saturday.getMonth() + 1).padStart(2, '0');
    	const year = String(saturday.getFullYear());
    
    	return `${day}.${month}.${year}`;
	}
  	
	async getSecondWorkDate() {
		const mondayDateStr = await this.getFirstWorkDate();
    
    	// Преобразуем строку обратно в Date объект
    	const [day, month, year] = mondayDateStr.split('.').map(Number);
    	const mondayDate = new Date(year, month, day);
    
    	// Добавляем 1 день для получения вторника
    	const tuesdayDate = new Date(mondayDate);
    	tuesdayDate.setDate(mondayDate.getDate() + 1);
    
    	// Форматируем вторник в тот же формат
    	const tuesdayDay = String(tuesdayDate.getDate()).padStart(2, '0');
    	const tuesdayMonth = String(tuesdayDate.getMonth()).padStart(2, '0');
    	const tuesdayYear = tuesdayDate.getFullYear();
    
    	return `${tuesdayDay}.${tuesdayMonth}.${tuesdayYear}`;
	}

	async getSecondHolidayDate() {
		const saturdayDateStr = await this.getFirstHolidayDate();
    
    	// Преобразуем строку обратно в Date объект
    	const [day, month, year] = saturdayDateStr.split('.').map(Number);
    	const saturdayDate = new Date(year, month, day);
    
    	// Добавляем 1 день для получения вторника
    	const wendsdayDate = new Date(saturdayDate);
    	wendsdayDate.setDate(saturdayDate.getDate() + 1);
    
    	// Форматируем вторник в тот же формат
    	const wendsdayDay = String(wendsdayDate.getDate()).padStart(2, '0');
    	const wendsdayMonth = String(wendsdayDate.getMonth()).padStart(2, '0');
    	const wendsdayYear = wendsdayDate.getFullYear();
    
    	return `${wendsdayDay}.${wendsdayMonth}.${wendsdayYear}`;
	}
	

  


}