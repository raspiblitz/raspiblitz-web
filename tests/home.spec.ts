import { LoginPage } from "./fixtures/login-page";
import { fulfillRoute } from "./utils";
import { test as base, expect } from "@playwright/test";

type MyFixtures = {
  loginPage: LoginPage;
};

const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(page);

    await use(loginPage);
  },
});

test.beforeEach(async ({ page }) => {
  await page.route("**/api/lightning/list-all-tx?reversed=true", (route) =>
    fulfillRoute(route, []),
  );
  // mock a sse connection - needs to be improved
  await page.route("**/api/sse/subscribe", (route) => {
    const events = [
      `event: system_startup_info\n data: ${JSON.stringify({
        bitcoin: "done",
        bitcoin_msg: "",
        lightning: "",
        lightning_msg: "",
      })}`,
    ];

    route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      headers: {
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      },
      body: events[0],
    });
  });
});

test("should route to home and save token after login", async ({
  loginPage,
  page,
}) => {
  await page.waitForURL("/home");
  await expect(page).toHaveURL("/home");
  expect(
    await page.evaluate((_) => localStorage.getItem("access_token")),
  ).toMatch("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
});

test("should login automatically if token is not expired", async ({
  loginPage,
  page,
}) => {
  await page.waitForURL("/home");
  await expect(page).toHaveURL("/home");

  await page.reload();
  await page.waitForURL("/home");
  await expect(page).toHaveURL("/home");
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
});

test("redirect to home if token is not expired & login page was called", async ({
  loginPage,
  page,
}) => {
  await page.waitForURL("/home");
  await expect(page).toHaveURL("/home");

  await page.goto("/login");
  await page.waitForURL("/home");
  await expect(page).toHaveURL("/home");
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
});
