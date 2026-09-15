# SauceDemo Playwright Automation (Login Page)

## Overview

This project contains automated UI tests for the **SauceDemo** website using **Playwright** and **TypeScript**.

The project follows the **Page Object Model (POM)** approach to separate page-specific actions from test cases, making the automation code easier to maintain and reuse.

The test suite covers both **positive and negative login scenarios** using the available SauceDemo users.

## Technologies Used

* **Playwright** – End-to-end browser automation
* **TypeScript** – Programming language
* **Node.js / npm** – Project and package management
* **Page Object Model (POM)** – Test automation design pattern

## Project Structure

```text
PlaywrightAssignment1/
│
├── tests/
   |_Assignment1-Login/
│      ├── SauceDemoLogin.spec.ts
│      └── UserLoginPage.ts
       └── BasePage.ts
│
├── playwright.config.ts
├── package.json
├── package-lock.json
└── README.md
```

### Files

#### `SauceDemoLogin.spec.ts`

Contains the automated test scenarios for:

1. Verifying that the SauceDemo login page loads successfully.
2. Testing login behavior with multiple predefined users.
3. Verifying successful redirection to the inventory page.
4. Handling the expected login failure for `locked_out_user`.
5. Verifying that the inventory page loads successfully after login.

#### `UserLoginPage.ts`

Contains the Page Object Model for the login page, including reusable actions such as:

* Opening the SauceDemo website
* Entering the username
* Entering the password
* Clicking the Login button
* Handling successful login/redirection

## Test Scenarios

### TC01 – Verify Login Page Loads Successfully

**Objective:**
Verify that the SauceDemo login page loads successfully and that the required login elements are available.

**Validations:**

* Login page logo contains `Swag Labs`
* Username field is available
* Password field is available
* Login button is available
* Required element attributes are verified

### TC02 – Verify Login with SauceDemo Users

The login functionality is tested with the following users:

| Username                  | Expected Result                 |
| ------------------------- | ------------------------------- |
| `standard_user`           | Login successful                |
| `locked_out_user`         | Login fails with expected error |
| `problem_user`            | Login successful                |
| `performance_glitch_user` | Login successful                |
| `error_user`              | Login successful                |
| `visual_user`             | Login successful                |

The password used for the test users is:

```text
secret_sauce
```

### Locked-Out User

The `locked_out_user` is intentionally expected to fail authentication.

The test verifies that the login error contains the expected message:

```typescript
await expect(
    page.getByText("Epic sadface")
).toContainText(
    "Sorry, this user has been locked out."
);
```

This validates the expected negative login behavior.

### Successful Users

For the other users, successful authentication is verified by checking that the user is redirected to:

```text
https://www.saucedemo.com/inventory.html
```

The assertion used is:

```typescript
await expect(page).toHaveURL(
    "https://www.saucedemo.com/inventory.html"
);
```

## Page Object Model

The project uses the **Page Object Model** to separate test logic from page interactions.

A `UserLoginPage` object is created with the username and password:

```typescript
const userLoginPage = new UserLoginPage(
    page,
    username,
    password
);
```

The login page class uses these values to fill the login form:

```typescript
await this.page.getByPlaceholder("Username")
    .fill(this.username);

await this.page.getByPlaceholder("Password")
    .fill(this.password);
```

This allows the same Page Object to be reused with different test users.

## Locator Strategy

The tests use Playwright locators based on element semantics and attributes.

### Placeholder

```typescript
page.getByPlaceholder("Username")
```

```typescript
page.getByPlaceholder("Password")
```

### Role

```typescript
page.getByRole("button", { name: "Login" })
```

```typescript
page.getByRole("button", { name: "Cart, empty" })
```

### CSS Locator

```typescript
page.locator(".login_logo")
```

### Attribute Assertions

The tests verify important element attributes using `toHaveAttribute()`:

```typescript
await expect(page.getByPlaceholder("Username"))
    .toHaveAttribute("id", "user-name");
```

```typescript
await expect(page.getByPlaceholder("Password"))
    .toHaveAttribute("id", "password");
```

```typescript
await expect(page.getByRole("button", { name: "Login" }))
    .toHaveAttribute("id", "login-button");
```

### Text Assertions

The login page logo is validated using:

```typescript
await expect(page.locator(".login_logo"))
    .toHaveText("Swag Labs");
```

The locked-out user error is validated using `toContainText()`:

```typescript
await expect(page.getByText("Epic sadface"))
    .toContainText(
        "Sorry, this user has been locked out."
    );
```

### URL Assertion

Successful login is validated with:

```typescript
await expect(page).toHaveURL(
    "https://www.saucedemo.com/inventory.html"
);
```

### ARIA Attribute Assertion

The shopping cart is validated using its accessible role and ARIA label:

```typescript
await expect(
    page.getByRole("button", { name: "Cart, empty" })
).toHaveAttribute(
    "aria-label",
    "Cart, empty"
);
```

## Slow Motion Execution

The tests use Playwright's `slowMo` option:

```typescript
test.use({
    launchOptions: {
        slowMo: 800
    }
});
```

This adds an **800 ms delay between browser actions**, making the execution easier to observe while running tests in headed mode.

## Installation

Navigate to the project directory:

```bash
cd PlaywrightAssignment1
```

Install the project dependencies:

```bash
npm install
```

Install the Playwright browsers:

```bash
npx playwright install
```

## Running the Tests

### Run all tests

```bash
npx playwright test
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### Run the SauceDemo login test file

```bash
npx playwright test tests/SauceDemoLogin.spec.ts
```

### Run the test file in headed mode

```bash
npx playwright test tests/SauceDemoLogin.spec.ts --headed
```

### Run only Chromium

```bash
npx playwright test tests/SauceDemoLogin.spec.ts --headed --project=chromium
```

### Run a specific test

For example:

```bash
npx playwright test -g "standard_user"
```

Or:

```bash
npx playwright test -g "locked_out_user"
```

## Test Report

After test execution, Playwright generates an HTML report.

Open the report using:

```bash
npx playwright show-report
```

The report provides information about:

* Passed tests
* Failed tests
* Test duration
* Browser used
* Error details
* Test execution results

## Expected Results

### Login Page

The automation verifies that:

* `Swag Labs` logo is displayed.
* Username field has the expected ID.
* Password field has the expected ID.
* Login button has the expected ID.

### Successful Users

The following users should successfully authenticate:

* `standard_user`
* `problem_user`
* `performance_glitch_user`
* `error_user`
* `visual_user`

They should be redirected to:

```text
https://www.saucedemo.com/inventory.html
```

### Locked-Out User

`locked_out_user` should **not** successfully authenticate.

The test verifies that the login error contains:

```text
Sorry, this user has been locked out.
```

### Inventory Page

After successful authentication, the shopping cart should have:

```text
aria-label="Cart, empty"
```

## Automation Approach

This project demonstrates:

* End-to-end UI automation
* TypeScript with Playwright
* Page Object Model
* Positive and negative test scenarios
* Playwright assertions
* Semantic locators using roles and placeholders
* Attribute validation
* URL validation
* Cross-browser execution
* Headed test execution with slow motion

## Author

**QA Automation Practice Project**

Built using **Playwright + TypeScript**.
