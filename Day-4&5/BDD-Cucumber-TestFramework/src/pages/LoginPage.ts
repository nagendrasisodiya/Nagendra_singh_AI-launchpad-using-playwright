import {expect, Page} from '@playwright/test';

export class LoginPage {
    constructor(
        private page: Page
    ) {}


    async openApp() {
        await this.page.goto(
            'https://www.saucedemo.com/');
    }

    async login() {
        console.log(
            'Entering credentials');
    // Example
        await this.page.fill('input[name="user-name"]','standard_user');
        await this.page.fill("//input[@id='password']",'secret_sauce');
    }
    async click(){
        await this.page.click('input[name="login-button"]');
    }
    async loginWithInvalidCredentials(){
        console.log("Login with InvalidCredentials");
// Example
        await this.page.fill('input[name="user-name"]','tumit');
        await this.page.fill("//input[@id='password']",'mutituu');
    }
    async errorcheck(){
        await expect(this.page.locator('[data-test="error"]')).toBeVisible()
        console.log(await this.page.locator('[data-test="error"]').textContent());
    }
    // async loginwithmultipleusers(username: string, password : string){
    //
    //     await this.page.fill(this.txtUser,username);
    //
    //     await this.page.fill(this.txtPass,password);
    //
    //     await this.page.click(this.btnLogin);
    // }
}

