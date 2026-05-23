import { expect, Page, test as base } from '@playwright/test';
import Auth from './auth.component';
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

    const results: Array<{
        directory: string;
        tests: Array<{
            name: string;
            status: 'passed' | 'failed';
            error?: string;
        }>;
    }> = [];

    const getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) return error.message;
        if (typeof error === 'string') return error;
        return 'Неизвестная ошибка';
    };

    for (const directory of directoriesData) {
        test(`Полный цикл тестирования: ${directory.name}`, async ({ page, auth, setting }) => {

            const directoryResults = {
                directory: directory.name,
                tests: [] as Array<{ name: string; status: 'passed' | 'failed'; error?: string }>
            };

            const fields = directory.fields(page);
            const editFields = directory.editFields ? directory.editFields(page) : fields;

            // ========== ТЕСТ 1: ПЕРЕХОД К СПРАВОЧНИКУ ==========
            let transitionPassed = true;
            let transitionError = '';
            try {
                await setting.goToSection(directory.name);
                await page.waitForTimeout(1000);
            } catch (error) {
                transitionPassed = false;
                transitionError = getErrorMessage(error);
            }
            directoryResults.tests.push({
                name: 'Переход к справочнику',
                status: transitionPassed ? 'passed' : 'failed',
                error: transitionError
            });

            // ========== ТЕСТ 3: СОЗДАНИЕ ЗАПИСИ ==========
            let createPassed = true;
            let createError = '';
            try {
                await setting.addBtn.click();
                await page.waitForTimeout(1000);
                await setting.fillCatalog(fields);
                await setting.createBtn.click();
                await page.waitForTimeout(1000);
            } catch (error) {
                createPassed = false;
                createError = getErrorMessage(error);
            }
            directoryResults.tests.push({
                name: 'Создание записи',
                status: createPassed ? 'passed' : 'failed',
                error: createError
            });

            // ========== ТЕСТ 5: РЕДАКТИРОВАНИЕ ЗАПИСИ ==========
            let editPassed = true;
            let editError = '';
            try {
                await page.waitForTimeout(1000);
                await setting.goToEdit(fields[0].value);
                await setting.fillCatalog(editFields);
                await setting.saveBtn.click();
                await page.waitForTimeout(1000);

                await expect(page.getByRole('row', { name: editFields[0].value }).getByRole('button')).toBeVisible();

             } catch (error) {
                editPassed = false;
                editError = getErrorMessage(error);
             }
             directoryResults.tests.push({
                name: 'Редактирование записи',
                status: editPassed ? 'passed' : 'failed',
                error: editError
             });

            // ========== ТЕСТ 6: Удаление записи ==========
            let deletePassed = true;
            let deleteError = '';
            try {
                await setting.goToDelete(editFields[0].value);
                await page.waitForTimeout(1000);

                await expect(page.getByRole('row', { name: editFields[0].value }).getByRole('button')).toBeHidden();

            } catch (error) {
                deletePassed = false;
                deleteError = getErrorMessage(error);
            }
            directoryResults.tests.push({
                name: 'Удаление записи',
                status: deletePassed ? 'passed' : 'failed',
                error: deleteError
            });

            // Сохраняем результаты
            results.push(directoryResults);
        });
    }

    // ========== ВЫВОД КРАСИВОГО ОТЧЁТА ПОСЛЕ ВСЕХ ТЕСТОВ ==========
    test.afterAll(async () => {
        console.log('\n');
        console.log('╔' + '═'.repeat(78) + '╗');
        console.log('║' + ' '.repeat(25) + 'ОТЧЁТ О ТЕСТИРОВАНИИ СПРАВОЧНИКОВ' + ' '.repeat(25) + '║');
        console.log('╚' + '═'.repeat(78) + '╝');
        console.log('\n');

        let totalTests = 0;
        let passedTests = 0;
        let failedTests = 0;

        for (const directoryResult of results) {
            console.log(`📁 ${directoryResult.directory}`);
            console.log('─'.repeat(60));

            for (const test of directoryResult.tests) {
                totalTests++;
                if (test.status === 'passed') {
                    passedTests++;
                    console.log(`   ✅ ${test.name} - ПРОЙДЕН`);
                } else {
                    failedTests++;
                    console.log(`   ❌ ${test.name} - НЕ ПРОЙДЕН`);
                    if (test.error) {
                        console.log(`      Ошибка: ${test.error}`);
                    }
                }
            }
            console.log('');
        }

        // Общая статистика 
        console.log('═'.repeat(60));
        console.log(`📊 ИТОГОВАЯ СТАТИСТИКА:`);
        console.log(`   ✅ ПРОЙДЕНО: ${passedTests}/${totalTests} (${((passedTests / totalTests) * 100).toFixed(2)}%)`);
        console.log(`   ❌ НЕ ПРОЙДЕНО: ${failedTests}/${totalTests} (${((failedTests / totalTests) * 100).toFixed(2)}%)`);
        console.log(`   📁 ВСЕГО СПРАВОЧНИКОВ: ${results.length}`);
        console.log('═'.repeat(60));

        if (failedTests === 0) {
            console.log('\n🎉 ПОЗДРАВЛЯЮ! ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО! 🎉');
        } else {
            console.log(`\n⚠️ ВНИМАНИЕ! ${failedTests} ТЕСТОВ НЕ ПРОЙДЕНЫ!`);
        }
        console.log('\n');
    });
});