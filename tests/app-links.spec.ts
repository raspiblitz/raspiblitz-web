import { expect, test } from "@playwright/test";
import { dashboardStatus } from "./status";

test("the dashboard opens installed apps on their advertised ports", async ({ page, baseURL }) => {
  const secure = new URL(baseURL!).protocol === "https:";
  const apps = [
    { id: "rtl", name: "Ride the Lightning", http: "3000", https: "3001" },
    { id: "thunderhub", name: "ThunderHub", http: "3010", https: "3011" },
  ];
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/api/sse/subscribe") {
      const data = apps.map((app) => ({
        id: app.id, version: "test", installed: true, configured: true, status: "online",
        address: `http://node.test:${app.http}`, http_port: app.http, https_port: app.https,
      }));
      const message = { state: "success", message: { data, errors: [], timestamp: 1 } };
      await route.fulfill({ contentType: "text/event-stream", body: `event: app_state_update_message\ndata: ${JSON.stringify(message)}\n\n` });
    } else if (path === "/api/system/login") {
      const payload = Buffer.from(JSON.stringify({ user_id: "admin", expires: Date.now() + 3600000 })).toString("base64");
      await route.fulfill({ body: `test.${payload}.test` });
    } else {
      await route.fulfill({ json: path === "/api/setup/status" ? dashboardStatus : {} });
    }
  });
  await page.context().route("**://node.test:*/**", (route) => route.fulfill({ body: "App landing page" }));
  await page.goto("/");
  await page.getByPlaceholder("Password A").fill("test-password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/home$/);
  for (const app of apps) {
    const url = `${secure ? "https" : "http"}://node.test:${secure ? app.https : app.http}/`;
    const link = page.getByRole("navigation").getByRole("link", { name: app.name });
    await expect(link).toBeVisible();
    const opened = page.waitForEvent("popup");
    await link.click();
    const tab = await opened;
    await expect(tab).toHaveURL(url);
    await tab.close();
  }
});
