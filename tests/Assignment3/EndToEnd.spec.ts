import {test, expect} from "@playwright/test";
import { RegistrationPage } from "./RegistrationPage";
import { LoginPage } from "./LoginPage";
import { ProductPage } from "./ProductPage";
import { CheckoutPurchasePage } from "./CheckoutPurchasePage";
test.use({
      launchOptions: {slowMo: 1500 }
});
/*test ("user can Register ", async ({page}) => {
      const registrationPage = new RegistrationPage(page);
      await registrationPage.open();
      const registrationButtonLocator = page.getByRole("link", { name: "Register" });
      await expect(registrationButtonLocator).toBeVisible();

      await registrationPage.RegistrationPageActions();

      //await expect (page.getByText("Account Created Successfully")).toBeVisible();

});*/
      

test ("user can  register then login with registered account and complete a purchase" , async({page})=>{
  test.setTimeout(90_000);



      const registrationPage = new RegistrationPage(page);
      const loginPage= new LoginPage (page);
      const productPage = new ProductPage(page);
      const checkoutPurchasePage = new CheckoutPurchasePage (page);
      const registrationButtonLocator = page.getByRole("link", { name: "Register" });
      await registrationPage.open();

      await expect(registrationButtonLocator).toBeVisible();

      await registrationPage.RegistrationPageActions();

      
      await loginPage.open();
      await loginPage.LoginPageActions();
      await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");
      await productPage.ProductPageActions();
      await expect(productPage.cartCountLocator.locator("label")).toHaveText("1");
      await productPage.CartClickAction();
      //await checkoutPurchasePage.open();
      //await expect(page).toHaveURL(
  //  "https://rahulshettyacademy.com/client/#/dashboard/cart"
//);

await expect(page.getByText("ZARA COAT 3", { exact: true })).toBeVisible();

await checkoutPurchasePage.CheckoutPurchasePageActions();
      await checkoutPurchasePage.CheckoutPurchasePageActions();
      await expect(page.getByText("Payment Method", { exact: true })).toBeVisible();
      await expect(page.getByText("Credit Card", { exact: true }));

      


});

