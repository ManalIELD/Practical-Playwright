/// <reference types="node" />

import { test, expect } from "@playwright/test";
import { AuthApi } from "../../APIs/AuthAPI/AuthApi";
import { ProductPage } from "../../Pages/ProductPage";
import { CheckoutPurchasePage } from "../../Pages/CheckoutPurchasePage";
import { OrdersPage } from "../../Pages/Client/OrdersPage";
import { DashboardPage } from "../../Pages/Client/DashboardPage";
import fs from "fs";
import path from "path";
import { CartPage } from "../../Pages/Client/CartPage";

const jsonPath = path.join(path.resolve(), "test-data", "data.json");
const testData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const validAccount = testData.loginDataScenarios.find(
  (account: {
    username: string;
    password: string;
    validity: string;
  }) => String(account.validity).toLowerCase() === "valid"
);

if (!validAccount) {
  throw new Error("data.json has no valid login account");
}

let token: string;

test.use({
  launchOptions: {
    slowMo: 1500,
  },
});

test.beforeAll(async () => {
  const auth = await AuthApi.create();

  try {
    token = await auth.login({
      userEmail: validAccount.username,
      userPassword: validAccount.password,
    });
  } finally {
    await auth.dispose();
  }
});

test("user can complete a purchase and verify the order", async ({ page }) => {
  test.setTimeout(90_000);

  const productPage = new DashboardPage(page);
  const cartPage = new CartPage(page);
  const checkoutPurchasePage = new CheckoutPurchasePage(page);
  const ordersPage = new OrdersPage(page);

const firstProduct: string = testData.products[1];
const secondProduct: string = testData.products[2];



  // Login using API token
  await page.addInitScript((authToken) => {
    localStorage.setItem("token", authToken);
  }, token);

  // Open dashboard
  await productPage.open();

  await expect(page).toHaveURL(/dashboard/i);

  // Verify products are available
  await productPage.expectProductVisible(firstProduct);
  await productPage.expectProductVisible(secondProduct);
  //await expect(
  //  productPage.getAddToCartLocator(firstProduct)
 // ).toBeVisible();

 /* await expect(
    productPage.getAddToCartLocator(secondProduct)
  ).toBeVisible();*/

  // Add product to cart
  await productPage.addProductToCart(firstProduct);
  await productPage.addProductToCart(secondProduct);

  // Verify cart count

  await productPage.expectCartCount(2);

  /*await expect(
    productPage.getCartCountLocator().locator("label")
  ).toHaveText("2");*/

  await productPage.expecturlToContainDashboard();

  // Open cart
  await productPage.openCart();

  // Verify products are in cart
  await cartPage.expectProductVisibility(firstProduct);
  await cartPage.expectProductVisibility(secondProduct);

  /*await expect(
    page.getByText(firstProduct, { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(secondProduct, { exact: true })
  ).toBeVisible();*/

  // Checkout
  await checkoutPurchasePage.clickCheckoutButton();

  // Verify checkout page
  await checkoutPurchasePage.expectCheckoutPageVisible();

  // Fill payment information
  await checkoutPurchasePage.fillCardNumber(
    testData.creditCardNumber
  );

  await checkoutPurchasePage.selectExpiryDay(
    testData.creditcardexoiryday
  );

  await checkoutPurchasePage.selectExpiryMonth(
    testData.creditcardexoirymonth
  );

  await checkoutPurchasePage.fillCvv(
    testData.cvv
  );

  await checkoutPurchasePage.fillNameOnCard(
    testData.creditCardName
  );

  await checkoutPurchasePage.selectCountry(
    testData.CountryPrefix,
    testData.country
  );

  // Place order
  await checkoutPurchasePage.clickPlaceOrder();

  // Verify order confirmation page
  await checkoutPurchasePage.expectOrderConfirmationPageVisible();
  await checkoutPurchasePage.expectThankYouHeadingVisible();


  // Get order ID from confirmation after checkout page 
  const firstOrderId = await checkoutPurchasePage.getOrderIdText(0);
  const secondOrderId = await checkoutPurchasePage.getOrderIdText(1);

//asssert in checkout page 
  await checkoutPurchasePage.expectOrderIdVisible(0);
  await checkoutPurchasePage.expectOrderIdVisible(1); 

// go to history page 
  await checkoutPurchasePage.clickOrdersHistory();
// verify they are visible and same as from checkpout page as check same order ids are visible in the history page 
  await ordersPage.expectOrderVisible(firstOrderId);
  await ordersPage.expectOrderVisible(secondOrderId);


  
});

