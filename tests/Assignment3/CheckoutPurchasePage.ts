import {test, expect, type Page, type Locator} from "@playwright/test";   
import {BasePage} from "./BasePage";
import {TestData} from "./TestData";

export class CheckoutPurchasePage extends BasePage {
      private readonly checkoutButtonLocator: Locator;
      private readonly cardlocator: Locator;
      private readonly expiryDayLocator: Locator;
      private readonly expiryMonthLocator: Locator;
      private readonly cvvLocator: Locator;
      private readonly nameLocator: Locator;
      private readonly placeOrderButtonLocator: Locator;
      constructor( readonly page: Page   ) {

            super(page);
      this.checkoutButtonLocator = page.getByRole("button", { name: "Checkout" });
      this.cardlocator = page
                             .locator('.field')
                             .filter({ hasText: 'Credit Card Number' })
                             .getByRole('textbox');
      this.expiryDayLocator = page
                         .locator(".field.small")
                         .filter({ hasText: "Expiry Date" })
                         .getByRole("combobox")
                         .nth(0);
      this.expiryMonthLocator = page
                        .locator(".field.small")
                        .filter({ hasText: "Expiry Date" })
                        .getByRole("combobox")
                        .nth(0);
      this.cvvLocator = page
                        .locator(".field")
                        .filter({ hasText: "CVV Code" })
                        .getByRole("textbox");
      this.nameLocator = page
                        .locator(".field")
                        .filter({ hasText: "Name on Card" })
                        .getByRole("textbox");
      this.placeOrderButtonLocator = page.getByRole("button", { name: "Place Order" });
     
    }
    override async open(): Promise<void>{
      await super.open();
     await this.page.goto("https://rahulshettyacademy.com/client/#/dashboard/cart");
    }

async CheckoutPurchasePageActions(): Promise<void>{
      
      await this.checkoutButtonLocator.click();
      await this.cardlocator.fill(TestData.creditCardNumber);
      await this.expiryDayLocator.selectOption(TestData.creditcardexoiryday);
      await this.expiryMonthLocator.selectOption(TestData.creditcardexoirymonth);
      await this.cvvLocator.fill(TestData.cvv);
      await this.nameLocator.fill(TestData.creditCardName);
     await this.placeOrderButtonLocator.click();   
  
}
}