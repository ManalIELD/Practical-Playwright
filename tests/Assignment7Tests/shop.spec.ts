import { env } from "process";
import { test, expect, type Page } from "@playwright/test";
import { CartPage } from "../../Pages/Client/CartPage";
import { CheckoutPurchasePage } from "../../Pages/CheckoutPurchasePage";
import { DashboardPage } from "../../Pages/Client/DashboardPage";
import { LoginPage } from "../../Pages/LoginPage";
import { readFileSync } from "fs";
import * as path from "path";

const email = env.EMAIL ?? "";
const password = env.PASSWORD ?? "";

const productName = "ZARA COAT 3";
const jsonPath = path.join(path.resolve(), "test-data", "data.json");
const data = JSON.parse(readFileSync(jsonPath, "utf-8"));
const validProducts = data.products;
const invalidProducts = data.invalidProducts;

// screenshot each step -> shows in HTML report (works with page fixture + trace: on)
async function shot(page: Page, name: string): Promise<void> {
  const body = await page.screenshot({
    path: `reports/screenshots/${name}.png`,
    fullPage: true,
  });
  await test.info().attach(name, { body, contentType: "image/png" });
}

async function login(page: Page): Promise<void> {
  if (!email || !password) {
    throw new Error("Set EMAIL and PASSWORD inside the .env file");
  }
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await shot(page, "step-open-login");
  await loginPage.LoginPageActions(email, password);
  await shot(page, "step-after-login");
}

// ---------- positive + smoke ----------
// { page } fixture = new page each test (no logout) + config trace/screenshot apply
test.describe("Login", { tag: ["@positive", "@smoke"] }, () => {
  test("valid login", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/dashboard/i);
    await shot(page, "login-valid");
  });
});

test.describe("Dashboard", { tag: ["@positive", "@smoke"] }, () => {
  test.describe.configure({ mode: "parallel" });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("List ZARA COAT 3", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.expectProductVisible(validProducts[1]);
    await shot(page, "dashboard-zara");
  });

  test("List ADIDAS ORIGINAL", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.expectProductVisible(validProducts[0]);
    await shot(page, "dashboard-adidas");
  });

  test("List IPHONE 13 PRO", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.expectProductVisible(validProducts[2]);
    await shot(page, "dashboard-iphone");
  });
});

// ---------- negative ----------
test.describe("Invalid scenarios", { tag: "@negative" }, () => {
  test.describe.configure({ mode: "parallel" });

  test("invalid login wrong password", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await shot(page, "invalid-login-open");
    await loginPage.LoginPageActions(email || "user@mail.com", "wrong-password");
    await loginPage.expectInvalidLogin();
    await shot(page, "login-invalid-password");
  });

  test("invalid login wrong email", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await shot(page, "invalid-email-open");
    await loginPage.LoginPageActions("not-a-user@mail.com", password || "Test1234@");
    await loginPage.expectInvalidLogin();
    await shot(page, "login-invalid-email");
  });

  test("invalid product add - product not exist", async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await login(page);
    await shot(page, "invalid-product-not-exist-dashboard");
    await dashboard.expectCannotAddProduct(invalidProducts[0]);
    await shot(page, "invalid-product-not-exist");
  });

  test("invalid product add - wrong spelling", async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await login(page);
    await shot(page, "invalid-product-spelling-dashboard");
    await dashboard.expectCannotAddProduct(invalidProducts[1]);
    await shot(page, "invalid-product-wrong-spelling");
  });
});

// ---------- regression: positive flow ----------
test.describe("Positive flow", { tag: "@regression" }, () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

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

  test("cart get products then removedProduct", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);

    await cartPage.clearCart();
    await shot(page, "cart-cleared");
    await page.getByRole("button", { name: "HOME" }).click();
    await expect(page).toHaveURL(/dashboard/i);
    await shot(page, "cart-back-home");

    for (let i = 0; i < validProducts.length; i++) {
      await dashboardPage.addProductToCart(validProducts[i]);
      await dashboardPage.expectCartCount(i + 1);
      await shot(page, `cart-added-${i + 1}`);
    }

    await cartPage.Open();
    await expect(cartPage.getCartRowsLocator()).toHaveCount(validProducts.length);
    await shot(page, "cart-all-products");

    const productsInCart = await cartPage.getProductsInCart();
    expect(productsInCart.length).toBe(validProducts.length);

    const productsToRemove = [productsInCart[0], productsInCart[1]];
    const expectedLeft = productsInCart.length - productsToRemove.length;

    await cartPage.removedProducts(productsToRemove);
    await shot(page, "cart-after-remove");
    await cartPage.expectCartItemsCount(expectedLeft);

    const leftInCart = await cartPage.getProductsInCart();
    expect(leftInCart.length).toBe(expectedLeft);
    for (const removed of productsToRemove) {
      expect(leftInCart.map((p) => p.toLowerCase())).not.toContain(removed.toLowerCase());
    }
    await shot(page, "cart-final");
  });

  test("login to checkout", async ({ page }) => {
    test.setTimeout(90_000);

    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPurchasePage(page);

    await cartPage.clearCart();
    await page.getByRole("button", { name: "HOME" }).click();
    await expect(page).toHaveURL(/dashboard/i);
    await shot(page, "e2e-home");

    await dashboardPage.addProductToCart(productName);
    await shot(page, "e2e-added");
    await cartPage.Open();
    await cartPage.expectedAddedProduct(productName);
    await shot(page, "e2e-cart");

    await checkoutPage.clickCheckoutButton();
    await checkoutPage.expectCheckoutPageVisible();
    await shot(page, "e2e-checkout");
    await checkoutPage.fillCardNumber(data.creditCardNumber);
    await checkoutPage.selectExpiryDay(data.creditcardexoiryday);
    await checkoutPage.selectExpiryMonth(data.creditcardexoirymonth);
    await checkoutPage.fillCvv(data.cvv);
    await checkoutPage.fillNameOnCard(data.creditCardName);
    await checkoutPage.selectCountry(data.CountryPrefix, data.country);
    await shot(page, "e2e-payment-filled");
    await checkoutPage.clickPlaceOrder();

    await checkoutPage.expectOrderConfirmationPageVisible();
    await checkoutPage.expectThankYouHeadingVisible();
    await shot(page, "e2e-thankyou");
  });
});
