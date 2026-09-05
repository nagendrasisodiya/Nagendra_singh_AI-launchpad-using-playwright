import {Page} from "@playwright/test";

export async  function loginUtils(page: Page): Promise<void> {
    await page.goto(
        'https://www.playwrightpad.in/sandbox/banking'
    );

    await page
        .getByRole('textbox', { name: 'Enter username' })
        .fill('apex_user');

    await page
        .getByPlaceholder('Enter password')
        .fill('Password123!');

    await page
        .getByRole('button', { name: 'LOGIN' })
        .click();
}