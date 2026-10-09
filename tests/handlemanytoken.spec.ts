// 1. Two init scripts: which token wins?
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
      
test("last addInitScript overrides the earlier one", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await page.addInitScript(() => {
    window.localStorage.setItem("token", "fake-token");
  });

  await page.goto("https://rahulshettyacademy.com/client/#/dashboard/dash");

  const stored = await page.evaluate(() => window.localStorage.getItem("token"));
  console.log("Stored token:", stored);
  expect(stored).toBe("fake-token");
});

// 2. Does the init script re-apply the token on every page load?
test("init script overrides manual change after reload", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await page.goto("https://rahulshettyacademy.com/client/#/dashboard/dash");

  await page.evaluate(() => window.localStorage.setItem("token", "changed-manually"));
  expect(await page.evaluate(() => localStorage.getItem("token"))).toBe("changed-manually");

  await page.reload();

  const afterReload = await page.evaluate(() => localStorage.getItem("token"));
  expect(afterReload).toBe(token); // init script ran again and overwrote it
});

// 3. Does the app itself replace the injected token when you log in via the UI?
test("UI login overrides the injected token", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("token", "fake-token");
  });

  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill(loginPayload.userEmail);
  await page.locator("#userPassword").fill(loginPayload.userPassword);
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");

  const stored = await page.evaluate(() => localStorage.getItem("token"));
  console.log("Token after UI login:", stored);
  expect(stored).not.toBe("fake-token");
});