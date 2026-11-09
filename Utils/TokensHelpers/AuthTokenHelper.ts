import { Page } from "@playwright/test";

export class AuthTokenHelper {
  static async inject(page: Page, token: string): Promise<void> {
    await page.addInitScript((value) => {
      window.localStorage.setItem("token", value);
    }, token);
  }
}