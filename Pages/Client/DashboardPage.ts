import { expect, type Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class DashboardPage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  // Locators
  getProductCardLocator(productName: string) {
    return this.page.locator(".card-body").filter({ hasText: productName });
  }

  getAddToCartLocator(productName: string) {
    return this.getProductCardLocator(productName).getByRole("button", {
      name: /add to cart/i,
    });
  }

  getCartButtonLocator() {
    return this.page.locator("[routerLink*='cart']");
  }


  // Actions
  override async open(): Promise<void> {
    await super.open();
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.expectProductVisible(productName);
    await this.getAddToCartLocator(productName).click();
  }

  // invalid product: no card / no add button for that name
  async expectCannotAddProduct(productName: string): Promise<void> {
    await expect(this.getProductCardLocator(productName)).toHaveCount(0);
    await expect(this.getAddToCartLocator(productName)).toHaveCount(0);
  }

  async openCart(): Promise<void> {
    await this.getCartButtonLocator().click();
  }

  // assertions 
async expectProductVisible(productName: string): Promise<void> {
    await expect(
      this.getProductCardLocator(productName),
      `Expected product "${productName}" to be visible on the dashboard`
    ).toBeVisible();
  }

  async expectProductNotVisible(productName: string): Promise<void> {
    await expect(
      this.getProductCardLocator(productName),
      `Expected product "${productName}" not to be visible on the dashboard`
    ).toHaveCount(0);
  }

  async expectCartCount(expectedCount: number): Promise<void> {

    await expect(
    this.getCartButtonLocator().locator("label")
  ).toHaveText(expectedCount.toString());
   
  }
  async expecturlToContainDashboard(): Promise<void> {
    await expect(
      this.page,
      `Expected URL to contain "/dashboard" but got ${this.page.url()}`
    ).toHaveURL(/.*dashboard.*/);
  }
}