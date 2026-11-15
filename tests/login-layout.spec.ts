import { expect, test } from '@playwright/test';
import { dashboardStatus } from './status';
import { fulfillRoute } from './utils';

test.describe('responsive login layout', () => {
  test.use({ hasTouch: true });

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/setup/status', route =>
      fulfillRoute(route, dashboardStatus),
    );
  });

  for (const [width, height] of [[320, 740], [390, 740], [844, 390]]) {
    test(`centers usable controls at ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/login');
      const password = page.getByLabel('Enter password A', { exact: true });
      const submit = page.getByRole('button', { name: 'Log in', exact: true });
      const language = page.getByRole('button', { name: 'Select language' });
      const logo = page.locator('main > svg');
      await expect(password).toBeFocused();
      await expect(submit).toBeDisabled();
      await page.evaluate(() => document.fonts.ready);

      const boxes = await Promise.all(
        [logo, password, submit, language].map(locator => locator.boundingBox()),
      );
      for (const box of boxes) {
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }
      const [logoBox, inputBox, submitBox, languageBox] = boxes.map(box => box!);
      for (const box of [logoBox, inputBox, submitBox]) {
        expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(1);
      }
      if (width < 768) {
        expect(Math.abs(inputBox.width - submitBox.width)).toBeLessThan(1);
      }
      expect(logoBox.y + logoBox.height).toBeLessThan(inputBox.y);
      expect(inputBox.y + inputBox.height).toBeLessThan(submitBox.y);
      expect(languageBox.y + languageBox.height).toBeLessThan(logoBox.y);
      for (const box of [inputBox, submitBox, languageBox]) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
      expect(await password.evaluate(el => parseFloat(getComputedStyle(el).fontSize)))
        .toBeGreaterThanOrEqual(16);
      await expect(password).toHaveAttribute('type', 'password');
      await expect(password).toHaveAttribute('autocomplete', 'current-password');
      expect(await page.evaluate(() => {
        window.scrollTo(10000, 0);
        return document.documentElement.scrollWidth <= innerWidth && scrollX === 0;
      })).toBe(true);

      await password.fill('layout-test');
      await expect(submit).toBeEnabled();
      await password.press('Tab');
      await expect(submit).toBeFocused();
      await password.fill('');
      await expect(submit).toBeDisabled();
      await page.setViewportSize({ width, height: Math.min(height, 400) });
      await submit.scrollIntoViewIfNeeded();
      const visible = await submit.boundingBox();
      expect(visible!.y).toBeGreaterThanOrEqual(0);
      expect(visible!.y + visible!.height).toBeLessThanOrEqual(Math.min(height, 400));
    });
  }
});
