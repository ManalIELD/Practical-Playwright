import {test, expect, type Page} from "@playwright/test";   
import {BasePage} from "./BasePage";

export class UserLoginPage extends BasePage {   
      constructor( readonly page: Page  , readonly username: string, readonly password: string  ) 
      {
            super(page);
            this.username = username;
            this.password = password;

      }
      override async open(): Promise<void>{
                    super.open();
                   await expect(this.page.locator('.login_logo')).toHaveText('Swag Labs');
                   
                   await this.page.getByPlaceholder('Username')
                   .fill(this.username);
                   await this.page.getByPlaceholder('Password')
                   .fill(this.password);

      }
      async userLogin(): Promise<void>{
           await this.page.getByRole('button', { name: 'Login' })
           .click(); //action click 
      }
      async userRedirectedSuccessfully(): Promise<void>{
            await this.page
            .waitForURL('https://www.saucedemo.com/inventory.html');  //wait for url to be changed 
            await this.page
                  .getByRole('button', { name: 'Cart, empty' }); // get locator for cart 
      }
      
}