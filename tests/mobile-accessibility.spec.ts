import { expect, test, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/');
  await page.getByPlaceholder('Password A').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL('/home');
  const unlock = page.getByRole('dialog');
  await expect(unlock).toBeVisible();
  await unlock.getByPlaceholder('Password C').fill('password');
  await unlock.getByRole('button', { name: 'Unlock', exact: true }).click();
  await expect(unlock).toBeHidden();
  await expect(page.getByRole('heading', { name: 'RAM Usage' })).toBeVisible();
  await expect(page.getByText('Bitcoin done', { exact: true })).toBeHidden();
}

test('app previews expose usable controls and select the right screenshot after video', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await page.goto('/apps/mempool/info');
  const carousel = page.getByRole('region', { name: 'Mempool.space app previews' });
  await expect(carousel.locator('video')).toBeVisible();
  const second = carousel.getByRole('button', { name: 'Show screenshot 2' });
  await second.focus();
  await page.keyboard.press('Enter');
  await expect(carousel.getByRole('img')).toHaveAccessibleName('Mempool.space screenshot 2 of 3');
  await expect(second).toHaveAttribute('aria-current', 'true');
  await carousel.getByRole('button', { name: 'Next preview' }).click();
  await expect(carousel.getByRole('img')).toHaveAccessibleName('Mempool.space screenshot 3 of 3');
  await carousel.getByRole('button', { name: 'Next preview' }).click();
  await expect(carousel.locator('video')).toBeVisible();
  const controls = carousel.getByRole('button');
  for (const control of await controls.all()) {
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  const media = await carousel.locator('video').boundingBox();
  const button = await second.boundingBox();
  expect(button!.y).toBeGreaterThanOrEqual(media!.y + media!.height);
  await page.screenshot({ path: test.info().outputPath('carousel-mobile.png'), fullPage: true });
});

test('QR dialog contains keyboard focus, dismisses and restores the opener', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  const opener = page.getByRole('button', { name: 'Show QR Code', exact: true });
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'NodeID', exact: true });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press(i % 2 ? 'Shift+Tab' : 'Tab');
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('qr-mobile.png'), animations: 'disabled' });
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await page.keyboard.press('Space');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('hardware metrics reflow by card width without clipping values', async ({ page }) => {
  await login(page);
  const card = page.locator('.bd-card').filter({ has: page.getByRole('heading', { name: 'Hardware Details' }) });
  const metrics = card.locator('article').first();
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const [width, columns] of [[240, 1], [520, 2]]) {
    await card.evaluate((el, width) => { el.style.width = `${width}px`; el.style.flexShrink = '0'; }, width);
    await expect.poll(() => metrics.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(columns);
  }
  await card.evaluate(el => { el.style.removeProperty('width'); el.style.removeProperty('flex-shrink'); });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(card).toBeVisible();
    expect(await card.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    for (const value of await card.locator('p').all()) {
      expect(await value.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    }
    await card.screenshot({ path: test.info().outputPath(`hardware-${width}.png`) });
  }
});
