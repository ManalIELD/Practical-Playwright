import {test, expect, type Page, type Locator} from "@playwright/test";   
import {BasePage} from "./BasePage";
import {TestData} from "./TestData";

export class RegistrationPage extends BasePage {
      private readonly RegistrationButtonLocator: Locator;
      private readonly HomePageLocator: Locator;    
      private readonly RegistrationPageLocator: Locator; 
      private readonly firstNameLocator: Locator;
      private readonly lastNameLocator: Locator;
      private readonly emailLocator: Locator;
      private readonly phoneNumberLocator: Locator;
      private readonly occupationLocator: Locator;
      private readonly genderLocator: Locator;
      private readonly passwordLocator: Locator;
      private readonly confirmPasswordLocator: Locator
      private readonly agecheckboxLocator: Locator;
      private readonly registerButtonLocator: Locator;   



      constructor( readonly page: Page   ) {
            super(page);
            this.RegistrationButtonLocator = page.getByRole("link", { name: "Register" });
            this.HomePageLocator = page.getByRole("heading", { name: "We Make Your Shopping Simple" });
            this.RegistrationPageLocator = page.getByRole("heading", { name: "Register" });
            this.firstNameLocator = page.getByPlaceholder("First Name");
            this.lastNameLocator = page.getByPlaceholder("Last Name");
            this.emailLocator = page.getByPlaceholder("email@example.com");
            this.phoneNumberLocator = page.getByPlaceholder("enter your number");
            this.occupationLocator = page.getByRole("combobox");
            this.genderLocator = page.getByLabel(TestData.gender);
            this.passwordLocator = page.getByPlaceholder("Passsword", { exact: true });
            this.confirmPasswordLocator = page.getByPlaceholder("Confirm Passsword", { exact: true });
            this.agecheckboxLocator = page.getByRole("checkbox");
            this.registerButtonLocator = page.getByRole("button", { name: "Register" });
      }
       override async open(): Promise<void>{
            await super.open();
            await this.RegistrationButtonLocator.click();
            await expect(this.RegistrationPageLocator).toBeVisible();
      }

      async RegistrationPageActions(): Promise<void>{
            await this.firstNameLocator.fill(TestData.firstName);
            await this.lastNameLocator.fill(TestData.lastName);
            await this.emailLocator.fill(TestData.email);
            await this.phoneNumberLocator.fill(TestData.phoneNumber);
            await this.occupationLocator.selectOption({ label : TestData.occupation});
            await this.genderLocator.check();
            await this.passwordLocator.fill(TestData.password);
            await this.confirmPasswordLocator.fill(TestData.confirmPassword);
            await this.agecheckboxLocator.check();
            await this.registerButtonLocator.click();
      }
}