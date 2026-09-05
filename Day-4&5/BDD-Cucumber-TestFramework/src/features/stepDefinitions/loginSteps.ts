import {Given,When,Then} from '@cucumber/cucumber';
import {LoginPage} from '../../pages/LoginPage'
import {CustomWorld} from '../../support/world'


let login : LoginPage;

Given('the user is on the login page', async function (this: CustomWorld) {
    // Write code here that turns the phrase above into concrete actions
    login = new LoginPage(this.page);
    await login.openApp();
});

When('the user enters valid credentials', async function (this: CustomWorld) {
    // Write code here that turns the phrase above into concrete actions
    await login.login();
});

When('clicks the login button', async function (this: CustomWorld) {
    // Write code here that turns the phrase above into concrete actions
    await login.click();
});

Then('the user should be redirected to the dashboard', async function (this: CustomWorld) {
    // Write code here that turns the phrase above into concrete actions
    console.log('User is redirected to the dashboard');
});

When('the user enters invalid credentials', async function (this: CustomWorld) {
    // Write code here that turns the phrase above into concrete actions
    await login.loginWithInvalidCredentials();
});

Then('an error message should be displayed', async function (this: CustomWorld) {
    // Write code here that turns the phrase above into concrete actions
    await login.errorcheck();
});

When('the user enters {string} and {string}', async function (string, string2) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('the user should see {string}', async function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});
