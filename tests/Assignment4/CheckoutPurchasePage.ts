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
      private readonly countryLocator: Locator;
      private readonly placeOrderButtonLocator: Locator;
      private readonly CountrySuggestions: Locator;
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
                        .nth(1);
      this.cvvLocator = page
                        .locator(".field")
                        .filter({ hasText: "CVV Code" })
                        .getByRole("textbox");
      this.nameLocator = page
                        .locator(".field")
                        .filter({ hasText: "Name on Card" })
                        .getByRole("textbox");
      this.countryLocator = page.locator('input[placeholder="Select Country"]');
      this.CountrySuggestions =page.locator('span.ng-star-inserted').filter({ hasText: TestData.country})
      this.placeOrderButtonLocator = page.getByText("Place Order");
     
    }
    override async open(): Promise<void>{
      await super.open();
    // await this.page.goto("https://rahulshettyacademy.com/client/#/dashboard/cart");
    }

async CheckoutPurchasePageActions(): Promise<void>{
      
      await this.checkoutButtonLocator.click();

     await expect(this.cardlocator).toBeVisible();

      await this.cardlocator.fill(TestData.creditCardNumber);
      await this.expiryDayLocator.selectOption(TestData.creditcardexoiryday);
      await this.expiryMonthLocator.selectOption(TestData.creditcardexoirymonth);
      await this.cvvLocator.fill(TestData.cvv);
      await this.nameLocator.fill(TestData.creditCardName);
      await this.countryLocator.pressSequentially(TestData.CountryPrefix, {delay: 100});
      await this.CountrySuggestions.click();
      const urlBeforeSubmit = this.page.url();
      await this.placeOrderButtonLocator.click();
      await this.page.waitForTimeout(1000);

      await expect(this.page).toHaveURL(urlBeforeSubmit);

      //await this.placeOrderButtonLocator.click();   
  
}
}