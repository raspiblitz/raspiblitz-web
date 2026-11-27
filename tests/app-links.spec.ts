import { expect, test } from "@playwright/test";
import { dashboardStatus } from "./status";

test("the dashboard opens installed apps on their advertised ports", async ({
  page,
  baseURL,
}) => {
  const secure = new URL(baseURL!).protocol === "https:";
  const apps = [
    { id: "rtl", name: "Ride the Lightning", http: "3000", https: "3001" },
    { id: "thunderhub", name: "ThunderHub", http: "3010", https: "3011" },
    { id: "specter", name: "Specter", http: "25441", https: null },
  ];
  // Keep the event stream open throughout the user journey. The release UI
  // logs out when EventSource closes, as a finite route.fulfill body would.
  await page.addInitScript((apps) => {
    class TestStream extends EventTarget {
      constructor() {
        super();
        setTimeout(() => {
          const data = apps.map((app) => ({
            id: app.id,
            version: "test",
            installed: true,
            configured: true,
            status: "online",
            address: `http://node.test:${app.http}`,
            http_port: app.http,
            https_port: app.https,
          }));
          this.dispatchEvent(
            new MessageEvent("app_state_update_message", {
              data: JSON.stringify({
                state: "success",
                message: { data, errors: [], timestamp: 1 },
              }),
            }),
          );
        }, 100);
      }
      close() {}
    }
    Object.defineProperty(window, "EventSource", { value: TestStream });
  }, apps);
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/api/system/login") {
      const payload = Buffer.from(
        JSON.stringify({ user_id: "admin", expires: Date.now() + 3600000 }),
      ).toString("base64");
      await route.fulfill({ body: `test.${payload}.test` });
    } else {
      await route.fulfill({
        json: path === "/api/setup/status" ? dashboardStatus : {},
      });
    }
  });
  await page
    .context()
    .route("**://node.test:*/**", (route) =>
      route.fulfill({ body: "App landing page" }),
    );
  await page.goto("/");
  await page.getByPlaceholder("Password A").fill("test-password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/home$/);
  for (const app of apps) {
    const tls = secure && app.https;
    const url = `${tls ? "https" : "http"}://node.test:${tls || app.http}/`;
    const link = page
      .getByRole("navigation")
      .getByRole("link", { name: app.name });
    await expect(link).toBeVisible();
    if (secure && !app.https) await expect(link).toContainText("(HTTP)");
    const opened = page.waitForEvent("popup");
    await link.click();
    const tab = await opened;
    await expect(tab).toHaveURL(url);
    expect(await tab.evaluate(() => window.opener === null)).toBe(true);
    await tab.close();
  }
  if (secure) {
    await page.goto("/login?back=/apps/specter");
    await page.getByPlaceholder("Password A").fill("test-password");
    await page.getByRole("button", { name: "Log in" }).click();
    const fallback = page.getByRole("link", { name: /open specter \(HTTP\)/i });
    await expect(fallback).toBeVisible();
    expect(page.context().pages()).toHaveLength(1);
    const opened = page.waitForEvent("popup");
    await fallback.click();
    const tab = await opened;
    await expect(tab).toHaveURL("http://node.test:25441/");
    expect(await tab.evaluate(() => window.opener === null)).toBe(true);
    await tab.close();
  }
});
