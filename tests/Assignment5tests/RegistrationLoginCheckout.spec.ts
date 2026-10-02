/// <reference types="node" />

import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../../Pages/RegistrationPage";
import { LoginPage } from "../../Pages/LoginPage";
import { ProductPage } from "../../Pages/ProductPage";
import { CheckoutPurchasePage } from "../../Pages/CheckoutPurchasePage";
import fs from "fs";
import path from "path";

const jsonPath = path.join(path.resolve(), "test-data", "data.json");

const testData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
const loginDataScenarios = Array.isArray(testData.loginData)
  ? testData.loginData
  : [];

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
 test("user cannot add an invalid product to the cart", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const data = testData;

  const invalidProduct: string = data.invalidProducts[0];

  // Login
  await loginPage.open();
  await loginPage.LoginPageActions(data.email, data.password);

  await expect(page).toHaveURL(/dashboard/);

  // Invalid product
  await expect(productPage.getAddToCartLocator(invalidProduct)).toHaveCount(0);
});     
 
test("user can register and complete a purchase (e2e)", async ({ page }) => {
  test.setTimeout(90_000);
 
  const registrationPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const checkoutPurchasePage = new CheckoutPurchasePage(page);
 
  const data = testData;
  const productName: string = data.products[1];
  const runId = String(Math.floor(Date.now() / 1000)).slice(-3);

const firstName = `${data.firstName}${runId}`;
const lastName = `${data.lastName}${runId}`;
const email = data.email.replace("@", `${runId}@`);
 
  // Register
  await registrationPage.open(); 
  await expect(registrationPage.getRegistrationButtonLocator()).toBeVisible();
  await registrationPage.clickRegistrationButton();
 
  await registrationPage.fillFirstName(firstName);
  await registrationPage.fillLastName(lastName);
  await registrationPage.fillEmail(email);
  await registrationPage.fillPhoneNumber(data.phoneNumber);
  await registrationPage.selectOccupation(data.occupation);
  await registrationPage.selectGender(data.gender);
  await registrationPage.fillPassword(data.password);
  await registrationPage.fillConfirmPassword(data.confirmPassword);
  await registrationPage.checkAgeCheckbox();
  await registrationPage.clickRegisterButton();
 
  // login
  await loginPage.open();
  await loginPage.LoginPageActions(data.email, data.password);
 
 
  // Add product to cart
  await productPage.clickAddToCart(productName);
  await expect(productPage.getCartCountLocator().locator("label")).toHaveText("1");
  await productPage.clickCart();
  await expect(page.getByText(productName, { exact: true })).toBeVisible();
 
  // Checkout
  await checkoutPurchasePage.clickCheckoutButton();
  await expect(checkoutPurchasePage.getCardNumberLocator()).toBeVisible();
 
  await checkoutPurchasePage.fillCardNumber(data.creditCardNumber);
  await checkoutPurchasePage.selectExpiryDay(data.creditcardexoiryday);
  await checkoutPurchasePage.selectExpiryMonth(data.creditcardexoirymonth);
  await checkoutPurchasePage.fillCvv(data.cvv);
  await checkoutPurchasePage.fillNameOnCard(data.creditCardName);
  await checkoutPurchasePage.selectCountry(data.CountryPrefix, data.country);
 
  //const urlBeforeSubmit = page.url();
  await checkoutPurchasePage.clickPlaceOrder();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/dashboard\/thanks/i);
  //await expect(page).toHaveURL(urlBeforeSubmit);
 
  // Confirmation
  //await expect(page.getByText("Payment Method", { exact: true })).toBeVisible();
  //await expect(page.getByText("Credit Card", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Thankyou for the order." })
  ).toHaveText("Thankyou for the order.");
});

 