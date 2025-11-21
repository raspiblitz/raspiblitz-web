// @ts-expect-error
import { signToken } from '../../backend-mock/auth';
import { dashboardStatus } from '../status';
import { fulfillRoute } from '../utils';
import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(public readonly page: Page) {
    this.passwordInput = this.page.getByPlaceholder('Password A');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
  }

  async login(page: Page) {
    await page.route('**/api/setup/status', route =>
      fulfillRoute(route, dashboardStatus),
    );
    await this.page.route('**/api/system/login', route =>
      route.fulfill({ body: signToken() }),
    );
    await this.page.goto('/');

    await this.passwordInput.fill('password');
    await this.loginButton.click();
  }
}
