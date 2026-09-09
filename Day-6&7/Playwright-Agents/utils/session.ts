import { LoginPage } from '../pages/LoginPage';
import { getEnv } from './environment';

export async function loginAsStandardUser(loginPage: LoginPage): Promise<void> {
  const username = getEnv('SAUCE_USERNAME', 'standard_user');
  const password = getEnv('SAUCE_PASSWORD', 'secret_sauce');
  await loginPage.goto();
  await loginPage.login(username, password);
}

