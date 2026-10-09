import { type Page, expect } from "@playwright/test";
import { BasePage } from "../BasePage";

export class CartPage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  // Locators
  getProductRowLocator(productName: string) {
    return this.page
      .locator("div.cartSection h3")
      .filter({ hasText: productName });
  }

  // Assertions 
  async expectProductVisibility(productName: string): Promise<void> {
    await expect(
      this.getProductRowLocator(productName),
      `Expected "${productName}" to be visible in the cart`
    ).toBeVisible();
  }
}