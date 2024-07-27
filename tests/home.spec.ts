import {test as base, expect} from '@playwright/test';
import {LoginPage} from "./fixtures/login-page";

type MyFixtures = {
    loginPage: LoginPage;
};

const test = base.extend<MyFixtures>({
    loginPage: async ({page}, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(page);

        await use(loginPage);
    },
});

test('should route to home', async ({loginPage, page}) => {
    await page.waitForURL("/home");
    await expect(page).toHaveURL("/home");
});
