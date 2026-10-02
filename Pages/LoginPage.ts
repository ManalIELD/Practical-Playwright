import {test, expect, type Page, type Locator} from "@playwright/test";   
import {BasePage} from "./BasePage";


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
async  LoginPageActions(email: string, password: string): Promise<void>{
            await this.emailLocator.fill(email);
            await this.passwordLocator.fill(password);
            await this.loginButtonLocator.click();
      }

}