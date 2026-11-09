import { env } from "process";
import { test, expect } from "@playwright/test";
import { CartPage } from "../../Pages/Client/CartPage";
import { CheckoutPurchasePage } from "../../Pages/CheckoutPurchasePage";
import { DashboardPage } from "../../Pages/Client/DashboardPage";
import { LoginPage } from "../../Pages/LoginPage";
import { readFileSync } from "fs";
import * as path from "path";

const email = env.EMAIL ?? "";
const password = env.PASSWORD ?? "";

const productName = "ZARA COAT 3";
//const products = ["ZARA COAT 3", "ADIDAS ORIGINAL", "IPHONE 13 PRO"];
const jsonPath = path.join(path.resolve(), "test-data", "data.json");
const data = JSON.parse(readFileSync(jsonPath, "utf-8"));
const validProducts = data.products;
const invalidProducts = data.invalidProducts;


async function loginOnNewPage(browser: import("@playwright/test").Browser) {
  if (!email || !password) {
    throw new Error("Set EMAIL and PASSWORD inside the .env file");
  }
  // browser fixture -> new page (no logout needed)
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.LoginPageActions(email, password);
  return page;
}

// ---------- positive + smoke ----------
test.describe("Login", { tag: ["@positive", "@smoke"] }, () => {
  test("valid login", async ({ browser }) => {
    const page = await loginOnNewPage(browser);

    await expect(page).toHaveURL(/dashboard/i);

    const validShot = await page.screenshot({
      path: "reports/screenshots/login-valid.png",
      fullPage: true,
    });
    await test.info().attach("login-valid", {
      body: validShot,
      contentType: "image/png",
    });

    await page.close();
  });
});

test.describe("Dashboard", { tag: ["@positive", "@smoke"] }, () => {
  test.describe.configure({ mode: "parallel" });

  test("List ZARA COAT 3", async ({ browser }) => {
    const page = await loginOnNewPage(browser);
    const dashboard = new DashboardPage(page);

    await dashboard.expectProductVisible(validProducts[1]);
    await page.close();
  });

  test("List ADIDAS ORIGINAL", async ({ browser }) => {
    const page = await loginOnNewPage(browser);
    const dashboard = new DashboardPage(page);
    await dashboard.expectProductVisible(validProducts[0]);
    await page.close();
  });

  test("List IPHONE 13 PRO", async ({ browser }) => {
    const page = await loginOnNewPage(browser);
    const dashboard = new DashboardPage(page);
    await dashboard.expectProductVisible(validProducts[2]);
    await page.close();
  });
});

// ---------- negative ----------
test.describe("Invalid scenarios", { tag: "@negative" }, () => {
  test.describe.configure({ mode: "parallel" });

  test("invalid login wrong password", async ({ browser }) => {
    const page = await browser.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.LoginPageActions(email || "user@mail.com", "wrong-password");
    await loginPage.expectInvalidLogin();

    const invalidShot = await page.screenshot({
      path: "reports/screenshots/login-invalid.png",
      fullPage: true,
    });
    await test.info().attach("login-invalid", {
      body: invalidShot,
      contentType: "image/png",
    });

    await page.close();
  });

  test("invalid login wrong email", async ({ browser }) => {
    const page = await browser.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.LoginPageActions("not-a-user@mail.com", password || "Test1234@");
    await loginPage.expectInvalidLogin();
    await page.close();
  });

  test("invalid product add - product not exist", async ({ browser }) => {
    const page = await loginOnNewPage(browser);
    const dashboard = new DashboardPage(page);

    await dashboard.expectCannotAddProduct(invalidProducts[0]);
    await page.close();
  });

  test("invalid product add - wrong spelling", async ({ browser }) => {
    const page = await loginOnNewPage(browser);
    const dashboard = new DashboardPage(page);

    await dashboard.expectCannotAddProduct(invalidProducts[1]);
    await page.close();
  });
});

// ---------- regression: positive flow ----------
test.describe("Positive flow", { tag: "@regression" }, () => {
  test.describe.configure({ mode: "serial" });

  // cleanup cart on a fresh page from browser fixture
  test.afterAll(async ({ browser }) => {
    if (!email || !password) return;

    const page = await browser.newPage();
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);

    await loginPage.open();
    await loginPage.LoginPageActions(email, password);
    await cartPage.clearCart();
    await page.close();
  });

  // get products in cart by row locators -> remove any -> check leftover
  test("cart get products then removedProduct", async ({ browser }) => {
    const page = await loginOnNewPage(browser);
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);

    await cartPage.clearCart();
    await page.getByRole("button", { name: "HOME" }).click();
    await expect(page).toHaveURL(/dashboard/i);

    for (let i = 0; i < validProducts.length; i++) {
      await dashboardPage.addProductToCart(validProducts[i]);
      await dashboardPage.expectCartCount(i + 1);
    }

    await cartPage.Open();
    await expect(cartPage.getCartRowsLocator()).toHaveCount(validProducts.length);

    const productsInCart = await cartPage.getProductsInCart();
    expect(productsInCart.length).toBe(validProducts.length);

    const productsToRemove = [productsInCart[0], productsInCart[1]];
    const expectedLeft = productsInCart.length - productsToRemove.length;

    await cartPage.removedProducts(productsToRemove);
    await cartPage.expectCartItemsCount(expectedLeft);

    const leftInCart = await cartPage.getProductsInCart();
    expect(leftInCart.length).toBe(expectedLeft);
    for (const removed of productsToRemove) {
      expect(leftInCart.map((p) => p.toLowerCase())).not.toContain(removed.toLowerCase());
    }

    await page.close();
  });

  test("login to checkout", async ({ browser }) => {
    test.setTimeout(90_000);

    const page = await loginOnNewPage(browser);
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPurchasePage(page);

    await cartPage.clearCart();
    await page.getByRole("button", { name: "HOME" }).click();
    await expect(page).toHaveURL(/dashboard/i);

    await dashboardPage.addProductToCart(productName);
    await cartPage.Open();
    await cartPage.expectedAddedProduct(productName);

    await checkoutPage.clickCheckoutButton();
    await checkoutPage.expectCheckoutPageVisible();
    await checkoutPage.fillCardNumber(data.creditCardNumber);
    await checkoutPage.selectExpiryDay(data.creditcardexoiryday);
    await checkoutPage.selectExpiryMonth(data.creditcardexoirymonth);
    await checkoutPage.fillCvv(data.cvv);
    await checkoutPage.fillNameOnCard(data.creditCardName);
    await checkoutPage.selectCountry(data.CountryPrefix, data.country);
    await checkoutPage.clickPlaceOrder();

    await checkoutPage.expectOrderConfirmationPageVisible();
    await checkoutPage.expectThankYouHeadingVisible();
    await page.close();
  });
});
