import {test, expect, type Page, type Locator} from "@playwright/test";   
import {BasePage} from "./BasePage";

export class ElementLocators extends BasePage {   
      private readonly nameLocator: Locator;
      private readonly emailLocator: Locator;
      private readonly passwordLocator: Locator;
      private readonly checkBoxLocator: Locator;
      private readonly genderLocator: Locator;
      private readonly employmentStatusLocator: Locator;
      private readonly dateOfBirthLocator: Locator;
      private readonly submitButtonLocator: Locator;
      private readonly shopLocator: Locator;    
      private readonly shopPageLocator: Locator;
      private readonly appCardLocator: Locator;
      constructor( readonly page: Page   ) {
            super(page);
            this.nameLocator =  page.locator('form input[name="name"]');
            this.emailLocator = page.locator('form input[name="email"]');
            this.passwordLocator = page.getByPlaceholder("Password");
            this.checkBoxLocator = page.getByLabel("Check me out if you Love IceCreams!");
            this.genderLocator = page.getByLabel("Gender");
            this.employmentStatusLocator = page.getByLabel("Employed");
            this.dateOfBirthLocator = page.locator('form input[name="bday"]');
            this.submitButtonLocator = page.getByRole("button", { name: "Submit" });
            this.shopLocator = page.getByRole("link", { name: "Shop" });
            this.shopPageLocator = page.getByRole("heading", { name: "Shop Name" });
            this.appCardLocator = page.locator("app-card");
      }
      override async open(): Promise<void>{
            await super.open();
            
            

      }
    async HomeLocatorsActions(): Promise<void>{
         await this.nameLocator.fill("user name");
            await this.emailLocator.fill("user@gmail.com");
            await this.passwordLocator.fill("123456");
            await this.checkBoxLocator.check();
            await this.genderLocator.selectOption("Female");
            await this.employmentStatusLocator.check();
            await this.dateOfBirthLocator.fill("1991-01-01");
            await this.submitButtonLocator.click();
           
      


}

async ShopLocatorsActions(): Promise<void>{
       await this.shopLocator.click();
            await this.appCardLocator.filter({ hasText: "iphone X" }).getByRole("button", { name: "Add" }).click();
            await this.appCardLocator.filter({ hasText: "Blackberry" }).getByRole("button", { name: "Add" }).click();
}
}