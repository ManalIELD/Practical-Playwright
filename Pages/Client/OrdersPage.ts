import { Locator, type Page, expect } from "@playwright/test";
import { BasePage } from "../BasePage";

export class OrdersPage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  // Locators
  getOrderIdLocator(orderId: string) {
    return this.page.locator('th[scope="row"]').filter({ hasText: orderId });
  }

  // Assertions
  async expectOrderVisible(orderId: string): Promise<void> {
    await expect(
      this.getOrderIdLocator(orderId),
      `Expected order ${orderId} to be in the orders history`
    ).toBeVisible();
  }
}