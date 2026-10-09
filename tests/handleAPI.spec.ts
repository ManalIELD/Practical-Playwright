import { test, expect, request } from "@playwright/test";

const loginPayload = {
  userEmail: "omarkhaled@gmail.com",
  userPassword: "Test1234!!",
};

let token: any;

test.beforeAll(async () => {
  const apiContext = await request.newContext();

  const loginResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
      data: loginPayload,
    }
  );

  expect(loginResponse.ok()).toBeTruthy();

  const loginResponseJson = await loginResponse.json();

  token = loginResponseJson.token;
});

test("add product to the cart", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await page.goto("https://rahulshettyacademy.com/client/#/dashboard/dash");

  const product = page.locator(".card-body").filter({ hasText: "ZARA COAT 3" });
  await product.getByRole("button", { name: "Add To Cart" }).click();

  await page.locator("[routerLink*='cart']").click();
  await expect(page.locator("h3").filter({ hasText: "ZARA COAT 3" })).toBeVisible();
});