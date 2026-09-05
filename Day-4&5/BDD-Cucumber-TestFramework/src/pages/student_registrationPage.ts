import { expect, Page } from '@playwright/test';

export class StudentRegistrationPage {
    constructor(private page: Page) {}

    async openApp() {
        await this.page.goto(
            'https://www.tutorialspoint.com/selenium/practice/selenium_automation_practice.php'
        );
    }

    async fillForm(name: string, email: string, gender: string, mobile: string, subject: string, hobby: string, address: string, state: string, city: string
    ) {
        await this.page.getByRole('textbox', { name: 'Name:' }).fill(name);
        await this.page.getByRole('textbox', { name: 'Email:' }).fill(email);
        await this.page.locator(`//label[normalize-space()='${gender}']/preceding-sibling::input`).check();
        await this.page.getByRole('textbox', { name: /Mobile/i }).fill(mobile);
        await this.page.getByRole('textbox', { name: 'Subjects:' }).fill(subject);
        await this.page.locator(`//label[normalize-space()='${hobby}']/preceding-sibling::input`).check();
        await this.page.getByPlaceholder('Currend Address').fill(address);
        await this.page.locator('#state').selectOption({ label: state });
        await this.page.locator('#city').selectOption({ label: city });
    }

    async verifyLoginButtonIsEnabled() {
        await expect(this.page.locator('input[value="Login"]')).toBeEnabled();
    }
}