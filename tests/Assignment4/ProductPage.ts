import {test, expect, type Page, type Locator} from "@playwright/test";   
import {BasePage} from "./BasePage";

export class ProductPage extends BasePage {
       readonly productLocator: Locator;
       //readonly carticonLocator: Locator;
       readonly cartCountLocator: Locator;
      constructor( readonly page: Page   ) {
            super(page);
            this.productLocator = page
  .locator("div.card-body")
  .filter({ hasText: "ZARA COAT 3" })
  .getByRole("button", { name: "Add To Cart" });
 this .cartCountLocator= page.locator(
    'button[routerlink="/dashboard/cart"]'
  );

          //  this.carticonLocator = page.getByRole("link", { name: "Cart" }).locator("label"); 
      }
      async ProductPageActions(): Promise<void>{
            await this.productLocator.click();
      }
      async CartClickAction (): Promise<void>{
                        await this.cartCountLocator.click();

      }
      }