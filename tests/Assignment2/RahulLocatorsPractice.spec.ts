import {test, expect} from "@playwright/test";
import {ElementLocators} from "./ElementLocators";
test.use({
      launchOptions: {slowMo: 1500 }
});
test ("user can open the website to fill the form ", async ({page}) => {
      const elementLocators = new ElementLocators(page);
      await elementLocators.open(); 
      await expect(page.getByRole('heading', { name: 'Protractor Tutorial' })).toBeVisible();
                

      await elementLocators.HomeLocatorsActions();
      await expect(
    page.getByText('The Form has been submitted successfully!.')
).toBeVisible();
      await elementLocators.ShopLocatorsActions();
      await expect(page).toHaveURL('https://rahulshettyacademy.com/angularpractice/shop');
      
     await expect(page.locator('a.nav-link.btn-primary')).toHaveText(/2/);
});

