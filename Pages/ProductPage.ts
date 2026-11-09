import { type Page } from "@playwright/test";
import { BasePage } from "./BasePage";
 
export class ProductPage extends BasePage {
      override async open(): Promise<void> {
        await super.open();
      }
  constructor(readonly page: Page) {
    super(page);
  }
 
//Locators 
 getAddToCartLocator(productName: string) {
    return this.page
      .locator("div.card-body")
      .filter({ hasText: productName })
      .getByRole("button", { name: "Add To Cart" });
  }
 
  getCartCountLocator() {
    return this.page.locator('button[routerlink="/dashboard/cart"]');
  }
 
  // Action
  async clickAddToCart(productName: string): Promise<void> {
    await this.getAddToCartLocator(productName).click();
  }
 
  async clickCart(): Promise<void> {
    await this.getCartCountLocator().click();
  }
}
 