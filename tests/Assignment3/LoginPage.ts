import {test, expect, type Page, type Locator} from "@playwright/test";   
import {BasePage} from "./BasePage";
import {TestData} from "./TestData"; 


export class LoginPage extends BasePage {
      private readonly  emailLocator: Locator;
      private readonly passwordLocator: Locator 
      private readonly loginButtonLocator: Locator;

      constructor( readonly page: Page   ) {
            super(page);
            this.emailLocator = page.getByPlaceholder("email@example.com");
            this.passwordLocator = page.getByPlaceholder("enter your passsword");
            this.loginButtonLocator = page.getByRole("button", { name: "Login" });
      }

      override async open(): Promise<void>{
            await super.open();
            }
async  LoginPageActions(): Promise<void>{
            await this.emailLocator.fill(TestData.loginemail);
            await this.passwordLocator.fill(TestData.password);
            await this.loginButtonLocator.click();
      }

}