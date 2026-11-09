import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "../BasePage";

export class CartPage extends BasePage {
  private readonly cartLink: Locator;

  constructor(readonly page: Page) {
    super(page);
    this.cartLink = page.locator("button[routerlink='/dashboard/cart']");
  }

  // Locators
  getCartRowsLocator() {
    return this.page.locator(".cartWrap li");
  }

  // locate one product row by name
  getProductRowLocator(productName: string) {
    return this.getCartRowsLocator().filter({ hasText: productName });
  }

  // Actions
  async Open(): Promise<void> {
    await this.cartLink.click();
  }

  async expectedAddedProduct(name: string): Promise<void> {
    await expect(
      this.page.locator(".cartSection h3").filter({ hasText: name })
    ).toBeVisible();
  }

  async clearCart(): Promise<void> {
    await this.Open();
    const rows = this.getCartRowsLocator();
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      await rows.first().locator(".btn-danger").click();
    }

    await expect(rows).toHaveCount(0);
  }

  async expectProductVisibility(productName: string): Promise<void> {
    await expect(
      this.getProductRowLocator(productName),
      `Expected "${productName}" to be visible in the cart`
    ).toBeVisible();
  }

  // read product names currently in cart from row locators
  async getProductsInCart(): Promise<string[]> {
    const titles = this.page.locator(".cartWrap li .cartSection h3");
    return titles.allTextContents();
  }

  // remove one specific product by name (row locator)
  async removedProduct(productName: string): Promise<void> {
    const row = this.getProductRowLocator(productName);

    if ((await row.count()) === 0) return;

    await row.locator(".btn-danger").click();
    await expect(row).toHaveCount(0);
  }

  // remove selected products from cart, leftover = before - removed.length
  async removedProducts(productsToRemove: string[]): Promise<void> {
    const before = await this.getCartRowsLocator().count();

    for (const name of productsToRemove) {
      await this.removedProduct(name);
    }

    const expectedLeft = before - productsToRemove.length;
    await expect(this.getCartRowsLocator()).toHaveCount(expectedLeft);
  }

  async expectCartItemsCount(expectedCount: number): Promise<void> {
    await expect(this.getCartRowsLocator()).toHaveCount(expectedCount);
  }

  async expectProductsInCart(productNames: string[]): Promise<void> {
    const inCart = await this.getProductsInCart();
    for (const name of productNames) {
      expect(inCart.map((p) => p.toLowerCase())).toContain(name.toLowerCase());
    }
  }
}
