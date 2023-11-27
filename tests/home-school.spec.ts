import { test, expect } from "@playwright/test";

//Клики по разным кнопкам на странице
test.describe('Check click buttons in page Home-school', async () => {


    test.beforeEach(async ({ page }) => {
        await page.goto('https://foxford.ru/home-school');
    });

    // При клике на кнопку "Поступить в школу" - скроллит к блоку заявки на поступление
    test.only('Check click "to Enroll In School"', async ({ page }) => {
        await page.getByText('Поступить в школу').click();
        const block = await page.locator('#request');
        expect(block).toBeVisible()
    });

    //При клике на кнопки(их две) "Попробовать бесплатно" переходим на страницу демо
    test('Check click "to Try Free"', async ({ page }) => {
        const buttons: any = await page.getByText('Попробовать бесплатно').all();
        for (const button of buttons) {
            await button.click();
            expect(page.url()).toContain('/demo');
            await page.goBack();
        }
    });

    //При клике на кнопку "Узнать больше" 1-4 классов редирект на страницу /primary
    test('Check click "to Learn More" by 1-4 class', async ({ page }) => {
        await page.getByRole('link', { name: '1-4 классы' }).click();
        expect(page.url()).toContain('/primary');
    })

    // При клике на кнопку "Узнать больше" 5-8 классов редирект на страницу /middle
    test('Check click "to Learn More" by 5-8 class', async ({ page }) => {
        await page.getByRole('link', { name: '5-8 классы' }).click();
        expect(page.url()).toContain('/middle')
    })

    // При клике на кнопку "Узнать больше" 9-11 классов редирект на страницу /high
    test('Check click "to Learn More" by 9-11 class', async ({ page }) => {
        await page.getByRole('link', { name: '9-11 классы' }).click();
        expect(page.url()).toContain('/high');
    })

    // При клике на кнопку "Подробнее об аттесатции" редирект на страницу /attestation
    test('Check click "more About Attestation" ', async ({ page }) => {
        await page.click('text=Подробнее об аттестации');
        const newPage = await page.waitForEvent('popup');
        expect(newPage.url()).toContain('/attestation');
    })

    // При клике на кнопку "Скачать" редирект на страницу /perehod-na-semeynoe-obrazovanie
    test('Check click "download  Guide" ', async ({ page }) => {
        await page.getByText('Скачать гайд').click();
        const newPage = await page.waitForEvent('popup');
        expect(newPage.url()).toContain('/perehod-na-semeynoe-obrazovanie');
    })

    // При клике на кнопку "Посмотреть лицензию" редирект на страницу открывается лицензия
    test('Check click "view License" ', async ({ page }) => {
        await page.getByText('Посмотреть лицензию').click();
        const newPage = await page.waitForEvent('popup');
        expect(newPage.url()).toContain('https://a.foxford.ngcdn.ru/assets/webpack/images/license.27ddeacf.jpg')
    })

});



//Плашки скидки на обучение
test.describe('Check discount element', async () => {

    let data: any;
    let discount: any;

    test.beforeEach(async ({ page }) => {
        await page.goto('https://foxford.ru/home-school');
        let response = await fetch("https://foxford.ru/api/externship/products/prices?year=2023");
        data = await response.json();
        discount = data.full_payment?.discount;


    });

    // Данные из первой плашки скидки тянуться из апи полной оплаты (скидка и дата окончания)
    test('Show correct discount in card one', async ({ page }) => {

        async function formatDate(dateString: any) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.toLocaleString('ru-RU', { month: 'long' });
            return `${day} ${month}`;
        }

        if (data && data.full_payment && data.full_payment.discount && data.full_payment.ends_at) {
            const element = await page.locator('.styled__DiscountText-jZzMO');
            const elementText = await element.innerText();
            const endsAt = new Date(data.full_payment.ends_at);
            const formattedExpectedText = `–${discount}% ДО ${formatDate(endsAt)}`;
            expect(elementText).toBe(formattedExpectedText);
        }
    });

    // Если скидки в апишке в полной оплате равна нулю, то не показываем первую плашку скидки
    test('If in offer no discount,do not show card one', async ({ page }) => {

        if (discount === 0) {
            const element = await page.locator('.styled__DiscountText-jZzMO');
            expect(element).toBeHidden();
        }

    });

    test('Show correct discount in card two', async ({ page }) => {

        async function formatDate(dateString: any) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.toLocaleString('ru-RU', { month: 'long' });
            return `${day} ${month}`;
        }

        if (data && data.full_payment && data.full_payment.discount && data.full_payment.ends_at) {
            const element = await page.locator('.styled__Sale-cxmyYd');
            const elementText = await element.innerText();
            const endsAt = new Date(data.full_payment.ends_at);
            const formattedExpectedText = `–${discount}% ДО ${formatDate(endsAt)}`;
            expect(elementText).toBe(formattedExpectedText);
        }
    })

    // Если скидки в апишке в полной оплате равна нулю, то не показываем вторую плашку скидки
    test('If in offer no discount,do not show card two', async ({ page }) => {

        if (discount === 0) {
            const element = await page.locator('.styled__Sale-cxmyYd');
            expect(element).toBeHidden();
        }
    });

});




// Блок онлайн-платформы
test.describe('Check click buttons in block online-platform in page Home-school', async () => {

    let screen;

    test.beforeEach(async ({ page }) => {
        await page.goto('https://foxford.ru/home-school');
    });


    // При клике на кнопку "Онлайн уроки" вижу экран Онлайн-уроков 
    test('Check click "online lesson" button', async ({ page }) => {
        await page.locator('//div[text()="Онлайн-уроки"]').click()
        screen = await page.locator('//img[@alt="Онлайн-уроки"]');
        expect(screen).toBeVisible();
    });

    // При клике на кнопку "Расписание" вижу экран Расписание
    test('Check click "scheldue" button', async ({ page }) => {
        await page.locator('//div[text()="Расписание"]').click()
        screen = await page.locator('//img[@alt="Расписание"]');
        expect(screen).toBeVisible();
    });

    // При клике на кнопку "Домашние задания" вижу экран Домашняя работа
    test('Check click "homework" button', async ({ page }) => {
        await page.locator('//div[text()="Домашние задания"]').click()
        screen = await page.locator('//img[@alt="Домашние задания"]');
        expect(screen).toBeVisible();
    });

    // При клике на кнопку "Успеваемость" вижу экран Успеваемость
    test('Check click "school performance" button', async ({ page }) => {
        await page.locator('//div[text()="Успеваемость"]').click()
        screen = await page.locator('//img[@alt="Успеваемость"]');
        expect(screen).toBeVisible();
    });

    //При клике на кнопку "Начать учиться" на каждом экране скроллит к блоку Заявки
    test('Check click "start learn" buttons', async ({ page }) => {
        const buttons: any = await page.locator('//div[@tabindex="-1"]//div[text()="Начать учиться"]').all();
        const block = await page.locator('#request');
        for (const button of buttons) {
            await button.click();
            expect(block).toBeVisible();
        }
    });

});



// Блок заявки на обучение
test.describe('Check request block', async () => {


    test.beforeEach(async ({ page }) => {
        await page.goto('https://foxford.ru/home-school');
    });

    // При клике на кнопку "Частые вопросы" - открывается страница в ноушене
    test('Check click button "often questions"', async ({ page }) => {
        await page.getByText('Частые вопросы').click();
        expect(page.url()).toContain('https://foxford.notion.site/e2dd1cb9e0474cb298b79bc5f4f92ec8');
    });


});
