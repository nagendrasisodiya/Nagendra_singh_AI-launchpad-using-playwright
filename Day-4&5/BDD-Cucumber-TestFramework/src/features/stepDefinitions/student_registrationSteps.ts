import {Given, Then, When} from '@cucumber/cucumber';
import { StudentRegistrationPage } from '../../pages/student_registrationPage';
import { CustomWorld } from '../../support/world';

let reg: StudentRegistrationPage;

Given(
    'the user opens the student registration page',
    async function (this: CustomWorld) {
        reg = new StudentRegistrationPage(this.page);

        await reg.openApp();
    }
);

When(
    'the user fills the student registration form with {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string} and {string}',
    async function (
        this: CustomWorld,
        name: string,
        email: string,
        gender: string,
        mobile: string,
        subject: string,
        hobby: string,
        address: string,
        state: string,
        city: string
    ) {
        await reg.fillForm(name, email, gender, mobile, subject, hobby, address, state, city);
    }
);

Then(
    'the login button should be enabled',
    async function (this: CustomWorld) {
        await reg.verifyLoginButtonIsEnabled();
    }
);