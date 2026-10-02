/// <reference types="node" />

import { test, expect } from "@playwright/test";
import { LoginPage } from "../../Pages/LoginPage";
import fs from "fs";
import path from "path";

const jsonPath = path.join(path.resolve(), "test-data", "data.json");
const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const loginData = data.loginDataScenarios;

if (!Array.isArray(loginData) || loginData.length === 0) {
  throw new Error("data.json has no loginDataScenarios array");
}

for (const { username, password, validity } of loginData) {
  test(`login test for ${username} / ${password}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.LoginPageActions(username, password);

    if (validity === "valid") {
      await expect(page).toHaveURL(/dashboard/i);
    } else {
      await expect(page).not.toHaveURL(/dashboard/i);
      await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
    }
  });
}