import { type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegistrationPage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }
  override async open(): Promise<void> {
    await super.open();
  }
  // locators
  getRegistrationButtonLocator() {
    return this.page.getByRole("link", { name: "Register" , exact: true });
  }

  getHomePageLocator() {
    return this.page.getByRole("heading", { name: "We Make Your Shopping Simple" });
  }

  getRegistrationPageLocator() {
    return this.page.getByRole("heading", { name: "Register" });
  }

  getFirstNameLocator() {
    return this.page.getByPlaceholder("First Name");
  }

  getLastNameLocator() {
    return this.page.getByPlaceholder("Last Name");
  }

  getEmailLocator() {
    return this.page.getByPlaceholder("email@example.com");
  }

  getPhoneNumberLocator() {
    return this.page.getByPlaceholder("enter your number");
  }

  getOccupationLocator() {
    return this.page.getByRole("combobox");
  }

  getGenderLocator(gender: string) {
    return this.page.getByLabel(gender);
  }

  getPasswordLocator() {
    return this.page.getByPlaceholder("Passsword", { exact: true });
  }

  getConfirmPasswordLocator() {
    return this.page.getByPlaceholder("Confirm Passsword", { exact: true });
  }

  getAgeCheckboxLocator() {
    return this.page.getByRole("checkbox");
  }

  getRegisterButtonLocator() {
    return this.page.getByRole("button", { name: "Register" });
  }

  // action

  async clickRegistrationButton(): Promise<void> {
    await this.getRegistrationButtonLocator().click();
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.getFirstNameLocator().fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.getLastNameLocator().fill(lastName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.getEmailLocator().fill(email);
  }

  async fillPhoneNumber(phoneNumber: string): Promise<void> {
    await this.getPhoneNumberLocator().fill(phoneNumber);
  }

  async selectOccupation(occupation: string): Promise<void> {
    await this.getOccupationLocator().selectOption({ label: occupation });
  }

  async selectGender(gender: string): Promise<void> {
    await this.getGenderLocator(gender).check();
  }

  async fillPassword(password: string): Promise<void> {
    await this.getPasswordLocator().fill(password);
  }

  async fillConfirmPassword(confirmPassword: string): Promise<void> {
    await this.getConfirmPasswordLocator().fill(confirmPassword);
  }

  async checkAgeCheckbox(): Promise<void> {
    await this.getAgeCheckboxLocator().check();
  }

  async clickRegisterButton(): Promise<void> {
    await this.getRegisterButtonLocator().click();
  }
}
 

