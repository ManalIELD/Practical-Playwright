/// <reference types="node" />
import { expect, test } from "@playwright/test";
import { AuthApi } from "../../APIs/AuthAPI/AuthApi";

import fs from "fs";
import path from "path";


const jsonPath = path.join(path.resolve(), "test-data", "data.json");
const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const loginData = data.loginDataScenarios;

if (!Array.isArray(loginData) || loginData.length === 0) {
  throw new Error("data.json has no loginDataScenarios array");
}

let auth: AuthApi;

test.beforeAll(async () => {
  auth = await AuthApi.create();
});

test.afterAll(async () => {
 if (auth) {
    await auth.dispose();
  }});
  test.use({
      launchOptions: {slowMo: 1500 }
});

for (const { username, password, validity } of loginData) {
  test(`login API test for ${username} / ${password} (${validity})`, async ({ page }) => {
    if (String(validity).toLowerCase() === "valid") {
      await auth.login({ userEmail: username, userPassword: password });
      // here to assert that login was correct and navigate to correct url 
      await page.goto("https://rahulshettyacademy.com/client/");
      await expect(page).toHaveURL(/client/i);
    } else {
      await auth.expectLoginRejected({ userEmail: username, userPassword: password }); // whitespaces test data will not call any api so same wrong creds messege will appear 
    }
  });
}