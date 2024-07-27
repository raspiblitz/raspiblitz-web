import {expect, test} from "@playwright/test";
import {fulfillRoute} from "./utils";
import {dashboardStatus} from "./status";

test.describe("login", () => {
    test.beforeEach(async ({page}) => {
        await page.route("**/api/setup/status", (route) => fulfillRoute(route, dashboardStatus));
    });

    test("login with correct password", async ({page}) => {
        await page.route("**/api/system/login", (route) => route.fulfill({body: "someToken"}));
        await page.goto("/");

        await page.getByPlaceholder("Password A").fill("password");
        await page.getByRole("button", {name: "Log in"}).click();

        await page.waitForURL("/home");
        await expect(page).toHaveURL("/home");
    });

    test("login with wrong password", async ({page}) => {
        await page.route("**/api/system/login", (route) => route.fulfill({status: 401}));
        await page.goto("/");

        await page.getByPlaceholder("Password A",).fill("password");
        await page.getByRole("button", {name: "Log in"}).click();

        await expect(page.getByText("An error occurred: Unknown error. The response was: 401 Unauthorized.")).toBeVisible();
        await expect(page).toHaveURL("/");
    });
});
