import { type Page } from "@playwright/test";
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

  // Types slowly so the auto-suggest list appears
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
}