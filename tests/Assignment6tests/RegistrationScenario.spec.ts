/// <reference types="node" />

import { test } from "@playwright/test";
import { AuthApi } from "../../APIs/AuthAPI/AuthApi";
import fs from "fs";
import path from "path";
import { RegisterApi } from "../../APIs/AuthAPI/RegisterApi";

const jsonPath = path.join(path.resolve(), "test-data", "data.json");
const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const registerData = data.registerDataScenarios;

if (!Array.isArray(registerData) || registerData.length === 0) {
  throw new Error("data.json has no registerDataScenarios array");
}

const validRegistration = registerData[0];

let register: RegisterApi;

test.beforeAll(async () => {
  register = await RegisterApi.create();
});

test.afterAll(async () => {
  if (register) {
    await register.dispose();
  }
});
  const uniqueEmail = `validRegistration.userEmail${Date.now()}@example.com`;


test("Register API test with valid data", async () => {
  await register.register({
    firstName: validRegistration.firstName,
    lastName: validRegistration.lastName,
    userEmail: uniqueEmail,
    userRole: validRegistration.userRole,
    occupation: validRegistration.occupation,
    gender: validRegistration.gender,
    userMobile: validRegistration.userMobile,
    userPassword: validRegistration.userPassword,
    confirmPassword: validRegistration.confirmPassword,
    required: validRegistration.required,
  });
});