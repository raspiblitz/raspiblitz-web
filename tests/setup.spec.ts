import { test } from "@playwright/test";

test("simple setup path", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // setup choice
  await page.getByLabel("Fresh Setup").click({ force: true }); // label is somehow covered
  await page.getByRole("button", { name: "Continue" }).click();

  // delete data info
  await page.getByRole("button", { name: "Yes, delete all data" }).click();

  // node name
  await page.getByLabel("Node Name").fill("BlueNode");
  await page.getByRole("button", { name: "Continue" }).click();

  // implementation choice
  await page
    .getByLabel("Bitcoin Full Node with Lightning LND Implementation ")
    .click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  // password node
  await page.getByLabel("Node Password", { exact: true }).fill("node12345");
  await page
    .getByLabel("Repeat Node Password", { exact: true })
    .fill("node12345");
  await page.getByRole("button", { name: "Continue" }).click();

  // password apps
  await page.getByAltText("Set your Apps password");
  await page.getByLabel("Apps Password", { exact: true }).fill("apps12345");
  await page
    .getByLabel("Repeat Apps Password", { exact: true })
    .fill("apps12345");
  await page.getByRole("button", { name: "Continue" }).click();

  // password wallet
  await page.getByLabel("Wallet Password", { exact: true }).fill("wallet12345");
  await page
    .getByLabel("Repeat Wallet Password", { exact: true })
    .fill("wallet12345");
  await page.getByRole("button", { name: "Continue" }).click();

  // ready to setup
  await page.getByRole("button", { name: "Start setup" }).click();
});
