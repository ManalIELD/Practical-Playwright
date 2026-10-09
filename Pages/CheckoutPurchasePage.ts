import { expect, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPurchasePage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  // locators
  getCheckoutButtonLocator() {
    return this.page.getByRole("button", { name: "Checkout" });
  }

  getCardNumberLocator() {
    return this.page
      .locator(".field")
      .filter({ hasText: "Credit Card Number" })
      .getByRole("textbox");
  }

  getExpiryDayLocator() {
    return this.page
      .locator(".field.small")
      .filter({ hasText: "Expiry Date" })
      .getByRole("combobox")
      .nth(0);
  }

  getExpiryMonthLocator() {
    return this.page
      .locator(".field.small")
      .filter({ hasText: "Expiry Date" })
      .getByRole("combobox")
      .nth(1);
  }

  getCvvLocator() {
    return this.page
      .locator(".field")
      .filter({ hasText: "CVV Code" })
      .getByRole("textbox");
  }

  getNameOnCardLocator() {
    return this.page
      .locator(".field")
      .filter({ hasText: "Name on Card" })
      .getByRole("textbox");
  }

  getCountryLocator() {
    return this.page.locator('input[placeholder="Select Country"]');
  }

  // Auto-suggest option, depends on the country name
  getCountrySuggestionLocator(country: string) {
    return this.page.locator("span.ng-star-inserted").filter({ hasText: country });
  }

  getPlaceOrderButtonLocator() {
    return this.page.getByText("Place Order");
  }

  // after checkout purchase (orders locators)
  getOrderIdLocator() {
    return this.page.locator("td.em-spacer-1 label").filter({ hasText: "|" });
  }
 
  getOrdersHistoryLinkLocator() {
    return this.page.locator('label[routerlink="/dashboard/myorders"]');
  }

  // actions
  override async open(): Promise<void> {
    await super.open();
  }

  async clickCheckoutButton(): Promise<void> {
    await this.getCheckoutButtonLocator().click();
  }

  async fillCardNumber(cardNumber: string): Promise<void> {
    await this.getCardNumberLocator().fill(cardNumber);
  }

  async selectExpiryDay(day: string): Promise<void> {
    await this.getExpiryDayLocator().selectOption(day);
  }

  async selectExpiryMonth(month: string): Promise<void> {
    await this.getExpiryMonthLocator().selectOption(month);
  }

  async fillCvv(cvv: string): Promise<void> {
    await this.getCvvLocator().fill(cvv);
  }

  async fillNameOnCard(name: string): Promise<void> {
    await this.getNameOnCardLocator().fill(name);
  }

  // Types slowly letter by letter so the auto-suggest list appears
  async typeCountryPrefix(prefix: string): Promise<void> {
    await this.getCountryLocator().pressSequentially(prefix, { delay: 100 });
  }

  async selectCountrySuggestion(country: string): Promise<void> {
    await this.getCountrySuggestionLocator(country).click();
  }

  // Type the prefix for country field and select the country from the auto-suggest list
  async selectCountry(prefix: string, country: string): Promise<void> {
    await this.typeCountryPrefix(prefix);
    await this.selectCountrySuggestion(country);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.getPlaceOrderButtonLocator().click();
  }

  
  // order actions
  async clickOrdersHistory(): Promise<void> {
    await this.getOrdersHistoryLinkLocator().click();
  }
  // i used nth as used in months , days to get the index of orders 
  async getOrderIdText(index: number = 0): Promise<string> {
  return (await this.getOrderIdLocator().nth(index).innerText())
    .replace(/\|/g, "")
    .trim();
}

  //assertions
  //assert checkout page is visible
  async expectCheckoutPageVisible(): Promise<void> {
    await expect(
    this.getCardNumberLocator()
  ).toBeVisible();
  } 
  
  // assert orders after checkout 

  async expectOrderIdVisible(index: number): Promise<void> {
    await expect(
      this.getOrderIdLocator().filter({ hasText: await this.getOrderIdText(index) }),
      "Expected order ID to be visible after checkout"
    ).toBeVisible();
  } 

  // Verify order confirmation page
  async expectOrderConfirmationPageVisible(): Promise<void> {
      await expect(this.page).toHaveURL(/dashboard\/thanks/i);
  }

async expectThankYouHeadingVisible(): Promise<void> {
  
  await expect(
    this.page.getByRole("heading", {
      name: "Thankyou for the order.",
    })
  ).toHaveText("Thankyou for the order.");
}
}